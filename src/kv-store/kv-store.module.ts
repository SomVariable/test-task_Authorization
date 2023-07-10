import { Module } from '@nestjs/common';
import { KvStoreService } from './kv-store.service';
import { KvStoreController } from './kv-store.controller';

@Module({
  controllers: [KvStoreController],
  providers: [KvStoreService],
  exports: [KvStoreService]
})
export class KvStoreModule {}
