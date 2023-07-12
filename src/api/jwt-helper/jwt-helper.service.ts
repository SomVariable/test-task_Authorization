import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AccessJwtConfig } from 'src/config/jwt.config';
import { jwtType } from './types/jwt-helper.types';

//on the top     const {id, role, status} = await this.userService.findBy({ email })


@Injectable()
export class JwtHelperService {
  constructor(private readonly jwtService: JwtService){}

  async generateToken({id, email,  role, status}: User, sessionKey: string,  options?: JwtSignOptions): Promise<string> {
    const payload = { email, sub: id, sessionKey, role, status }; 
    const jwt: string = this.jwtService.sign(payload, options)

    return jwt
  }

  async getDataFromJwt(authorization: string, option: JwtSignOptions = AccessJwtConfig): Promise<jwtType> {
    const token = authorization?.replace('Bearer ', '');
    const dataFromToken = await this.jwtService.verify(token, option)

    return dataFromToken ;
  }
}
