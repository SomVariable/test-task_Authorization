import { Module } from '@nestjs/common';
import { UserFileService } from './user-file.service';
import { UserFileController } from './user-file.controller';

@Module({
  controllers: [UserFileController],
  providers: [UserFileService],
  exports: [UserFileService]
})
export class UserFileModule {}
