import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminArticlesModule } from './articles/admin-articles.module';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminCategoriesService } from './categories/admin-categories.service';

@Module({
  imports: [AuthModule, AdminArticlesModule],
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
})
export class AdminModule {}
