import { Module } from '@nestjs/common';
import { UserFileService } from './user-file.service';
import { UserFileController } from './user-file.controller';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { DatabaseModule } from '../database/database.module';
import { S3Module } from '../s3-store/s3-store.module';

@Module({
  imports: [
    JwtHelperModule, 
    DatabaseModule, 
    S3Module
  ],
  controllers: [UserFileController],
  providers: [UserFileService],
  exports: [UserFileService]
})
export class UserFileModule {}


