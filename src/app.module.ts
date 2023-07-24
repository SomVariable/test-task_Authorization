import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { JwtHelperModule } from './api/jwt-helper/jwt-helper.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { VerificationModule } from './api/verification/verification.module';
import { PrismaService } from 'nestjs-prisma';
import { KvStoreModule } from './api/kv-store/kv-store.module';
import { UserProfileModule } from './api/user-profile/user-profile.module';
import { UserFileModule } from './api/user-file/user-file.module';
import { DatabaseModule } from './api/database/database.module';
import { UserPostModule } from './api/user-post/user-post.module';
import { ChannelProfileModule } from './api/channel-profile/channel-profile.module';
import { ChannelModule } from './api/channel/channel.module';
import { S3Module } from './api/s3-store/s3-store.module';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true
    }
  ), 
  MailerModule.forRoot(mailerConfig),  
  UserModule, 
  AuthModule, 
  VerificationModule, 
  KvStoreModule, 
  UserProfileModule, 
  UserFileModule, 
  JwtHelperModule,
  DatabaseModule,
  UserPostModule,
  S3Module,
  ChannelProfileModule,
  ChannelModule, 
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
