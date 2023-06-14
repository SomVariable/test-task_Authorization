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