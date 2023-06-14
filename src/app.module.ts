import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './verification/verification.module';
import configuration from './config/configuration.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true
    }
  ), MailerModule.forRoot(mailerConfig), UserModule, AuthModule, VerificationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
