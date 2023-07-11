import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { UserModule } from '../user/user.module';
import { VerificationModule } from '../verification/verification.module';
import { KvStoreModule } from '../kv-store/kv-store.module';
import { UserProfileModule } from '../user-profile/user-profile.module';


@Module({
  imports: [
    JwtModule.register({ global: true }),
    UserModule,
    PassportModule,
    VerificationModule,
    KvStoreModule,
    UserProfileModule 
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
