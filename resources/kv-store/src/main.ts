import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { RpcValidationFilter } from './api/redis/exceptions/rpc-validation.filter';

const microserviceOptions = {
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:6379'
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);

  app.listen();
}

bootstrap();
