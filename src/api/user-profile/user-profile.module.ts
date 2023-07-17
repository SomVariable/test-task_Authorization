import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { DatabaseModule } from '../database/database.module';
import { UserFileModule } from '../user-file/user-file.module';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';

@Module({
  imports: [DatabaseModule, UserFileModule, JwtHelperModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService]
})
export class UserProfileModule {}
