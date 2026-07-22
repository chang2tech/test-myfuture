import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { QueueModule } from '../../queue/queue.module';
import { SearchModule } from '../../search/search.module';
import { AdminArticlesController } from './admin-articles.controller';
import { AdminArticlesRepository } from './admin-articles.repository';
import { AdminArticlesSortRepository } from './admin-articles-sort.repository';
import { AdminArticlesService } from './admin-articles.service';

@Module({
  imports: [AuthModule, SearchModule, QueueModule],
  controllers: [AdminArticlesController],
  providers: [
    AdminArticlesService,
    AdminArticlesRepository,
    AdminArticlesSortRepository,
  ],
})
export class AdminArticlesModule {}
