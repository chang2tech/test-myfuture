import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tin tức thị trường' })
  getStats() {
    return this.newsService.getStats();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Danh sách chủ đề tin tức' })
  getCategories() {
    return this.newsService.getCategories();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Bài viết nổi bật' })
  @ApiQuery({ name: 'category', required: false })
  getFeatured(@Query('category') category?: string) {
    return this.newsService.getFeatured(category);
  }

  @Get('home')
  @ApiOperation({ summary: 'Bài viết nổi bật trang chủ bản tin' })
  getHomeArticles() {
    return this.newsService.getHomeArticles();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách bài viết' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getArticles(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.newsService.getArticles({
      categorySlug: category,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @ApiQuery({ name: 'trackView', required: false })
  getArticle(
    @Param('slug') slug: string,
    @Query('trackView') trackView?: string,
  ) {
    return this.newsService.getArticleBySlug(slug, trackView !== 'false');
  }
}
