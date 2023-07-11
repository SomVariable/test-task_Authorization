import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtType } from '../types/auth.types';
import { UserService } from 'src/api/user/user.service';
import { FORBIDDEN_MESSAGE, JWT_REFRESH } from '../constants/auth.constants';


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, JWT_REFRESH) {
  constructor(private readonly userService: UserService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_SECRET_KEY'),
    });
  }

  async validate(payload: jwtType) {
    const user = await this.userService.findBy( {email: payload.email} );
    
    if (!user) {
      throw new UnauthorizedException(FORBIDDEN_MESSAGE);
    }

    return payload;
  }
}