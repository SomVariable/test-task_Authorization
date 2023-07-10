import { ClientOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import appConfig from './configuration.config';

export const redisConfig : ClientOptions  = {
  transport: Transport.REDIS,
  options: {
    url: appConfig().REDIS_URL
  },
}

