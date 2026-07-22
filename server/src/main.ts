import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { AppModule } from './app.module';
import {
  getUploadDirectory,
  UPLOAD_PUBLIC_BASE_PATH,
} from './upload/upload.paths';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get(ConfigService);

  await app.register(fastifyCookie);
  await app.register(fastifyMultipart, {
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  await app.register(fastifyStatic, {
    root: getUploadDirectory(config),
    prefix: `${UPLOAD_PUBLIC_BASE_PATH}/`,
    decorateReply: false,
  });

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
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
