import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService]
})
export class UserProfileModule {}
