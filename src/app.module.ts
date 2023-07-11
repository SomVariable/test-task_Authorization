import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './verification/verification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { KvStoreModule } from './kv-store/kv-store.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UserFileModule } from './user-file/user-file.module';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true
    }
  ), 
  MailerModule.forRoot(mailerConfig),  
  UserModule, AuthModule, VerificationModule, KvStoreModule, UserProfileModule, UserFileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
