import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('authorization task')
    .setDescription('-')
    .setVersion('1.0')
    .addTag('authorization')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
