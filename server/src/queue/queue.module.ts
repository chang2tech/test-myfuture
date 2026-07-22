import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewsProcessor } from './processors/news.processor';
import { NewsQueueService } from './news-queue.service';
import { NEWS_QUEUE } from './news-queue.types';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6380),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
    }),
    BullModule.registerQueue({ name: NEWS_QUEUE }),
  ],
  providers: [NewsProcessor, NewsQueueService],
  exports: [BullModule, NewsQueueService],
})
export class QueueModule {}
