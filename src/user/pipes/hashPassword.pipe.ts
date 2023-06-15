import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class HashPasswordPipe implements PipeTransform<any>{
  constructor(private readonly password: string ){}
  
  async transform(data: any): Promise<string> {
    const hashedPassword = await bcrypt.hash(this.password, 6);
    return hashedPassword;
  }
}

@Injectable()
export class HashPasswordPipeNewVersion implements PipeTransform<any>{
  async transform(value: any): Promise<any> {
    if(typeof value === 'string'){
      const hashedPassword = await bcrypt.hash(value, 6);
      return hashedPassword;
    }else if(Array.isArray(value)){
      const users = [...value]
      const newUsers = await Promise.all(users.map(async user => {
        if(typeof user === 'object' && user['password']){
          const hashedPassword = await bcrypt.hash(user['password'], 6);
          const updatedUser = {...user, password: hashedPassword}
          return updatedUser;
        }else{
          return user
        }
      }))

      return newUsers
    }
    else if(typeof value === 'object' && value['password']){
      const hashedPassword = await bcrypt.hash(value['password'], 6);
      return {...value, password: hashedPassword};
    }else{
      return value
    }
  }
}