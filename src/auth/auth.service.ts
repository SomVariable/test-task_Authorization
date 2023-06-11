import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    console.log('we are in validator')
    const user: User = await this.userService.findByEmail(email);

    const isCompare: boolean =  await bcrypt.compare(password, user.hash)

    if (user && isCompare) {
      const {email, id, login, role} = user
      const result = {
        email,
        id,
        login,
        role,
        password
      };
      return result
    }

    return null;
  }

  async singUp(data: Prisma.UserCreateInput) {
    try {
      const userData = await this.userService.create(data);

      return {
        token: this.jwtService.sign({ sub: userData.id, username: userData.login})
      };

    } catch (error) {
      console.log(error)
      throw new ForbiddenException('RegistrationError')

    }
  }

  async signIn(data: {id: number, email: string, password: string}) {
    const payload = { username: data.email, sub: data.id};
    console.log('payload ', payload)
    console.log('before jwt')
    const jwt = this.jwtService.sign(payload)
    console.log(jwt)
  }

  
}
