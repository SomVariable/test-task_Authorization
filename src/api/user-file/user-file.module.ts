import { Module } from '@nestjs/common';
import { UserFileService } from './user-file.service';
import { UserFileController } from './user-file.controller';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { DatabaseModule } from '../database/database.module';


import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    JwtHelperModule, 
    DatabaseModule, 
    MinioModule
  ],
  controllers: [UserFileController],
  providers: [UserFileService],
  exports: [UserFileService]
})
export class UserFileModule {}


