import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validateEnv } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    RedisModule,
    QueueModule,
    HealthModule,
    AuthModule,
    NewsModule,
    ProjectsModule,
    SearchModule,
    AdminModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
