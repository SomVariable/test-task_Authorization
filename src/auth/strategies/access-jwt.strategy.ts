import { KvStoreService } from 'src/kv-store/kv-store.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { jwtType } from '../types/auth.types';
import { User } from '@prisma/client';
import { Session } from 'kv-types';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { isEqual } from 'lodash';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly KvStoreService: KvStoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET_KEY'),
    });
  }

  async validate(payload: jwtType ) {
    const session: Session = await this.KvStoreService.getSession({id: payload.sessionKey})
    
    if(session.status === 'BLOCKED'){
      throw new BadRequestException('session is blocked')
    }

    return payload
  }
}