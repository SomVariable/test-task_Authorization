import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { isEqual } from 'lodash';
import { KvStoreService } from 'src/api/kv-store/kv-store.service';
import { ACCESS_JWT_STRATEGY, BLOCKED_SESSION_MESSAGE } from '../constants/auth.constants';
import { jwtType } from 'src/api/jwt-helper/types/jwt-helper.types';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, ACCESS_JWT_STRATEGY) {
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
    const session = await this.KvStoreService.getSession({id: payload.sessionKey})

    if(session?.status === 'BLOCKED'){
      throw new BadRequestException(BLOCKED_SESSION_MESSAGE)
    }

    return payload
  }
}