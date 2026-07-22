import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

@Module({
  imports: [QueueModule],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
  exports: [NewsService, NewsRepository],
})
export class NewsModule {}
