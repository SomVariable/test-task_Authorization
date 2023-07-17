import { Module } from '@nestjs/common';
import { KvStoreService } from './kv-store.service';
import { KvStoreController } from './kv-store.controller';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisConfig } from 'src/config/redis.config';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [CacheModule.register<RedisClientOptions>(redisConfig)],
  controllers: [KvStoreController],
  providers: [KvStoreService],
  exports: [KvStoreService]
})
export class KvStoreModule {}
