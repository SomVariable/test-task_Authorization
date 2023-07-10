import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
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
