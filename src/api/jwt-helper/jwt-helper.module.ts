import { Module } from '@nestjs/common';
import { JwtHelperService } from './jwt-helper.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [],
  providers: [JwtHelperService],
  exports: [JwtHelperService]
})
export class JwtHelperModule {}
