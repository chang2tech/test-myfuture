import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import { AppModule } from './app.module';
import {
  getUploadDirectory,
  UPLOAD_PUBLIC_BASE_PATH,
} from './upload/upload.paths';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.use(UPLOAD_PUBLIC_BASE_PATH, express.static(getUploadDirectory(config)));

  app.use(cookieParser());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const corsOrigins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:3721')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('myFUTURE API')
    .setDescription('API nền tảng bất động sản myFUTURE')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 4721);
  await app.listen(port);
}

void bootstrap();
