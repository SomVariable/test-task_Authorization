import  * as redisStore from 'cache-manager-redis-store';
import {RedisClientOptions} from 'redis'
import appConfig from './configuration.config';

const config = appConfig()

export const redisConfig: RedisClientOptions = {
  store: redisStore,
  isGlobal: true,

  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  
  // Store-specific configuration:
  
}

