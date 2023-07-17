import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { UserPostService } from './user-post.service';
import { UserPostController } from './user-post.controller';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { UserFileModule } from '../user-file/user-file.module';

@Module({
  imports: [DatabaseModule, JwtHelperModule, UserFileModule, UserFileModule],
  controllers: [UserPostController],
  providers: [UserPostService],
  exports: [UserPostService]
})
export class UserPostModule {}
