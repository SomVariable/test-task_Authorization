import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';
import { KvStoreModule } from '../kv-store/kv-store.module';


@Module({
  imports: [UserModule, KvStoreModule],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService]
})
export class VerificationModule {}
