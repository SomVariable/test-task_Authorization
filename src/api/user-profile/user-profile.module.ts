import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [UserProfileController, PrismaService],
  providers: [UserProfileService]
})
export class UserProfileModule {}
