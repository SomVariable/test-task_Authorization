import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RefreshJwtStrategy } from './strategies/refreshJwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { VerificationModule } from 'src/verification/verification.module';
import { AccessJwtStrategy } from './strategies/accessJwt.strategy';

@Module({
  imports: [JwtModule.register({}), UserModule, PassportModule, VerificationModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [AuthService] 
})
export class AuthModule {}
