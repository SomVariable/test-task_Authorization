import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET_KEY'),
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.userService.findById( payload.id);
    if (!user) {
      throw new UnauthorizedException('You do not have access');
    }

    return {
      id: user.id,
    };
  }
}