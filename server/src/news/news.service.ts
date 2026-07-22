import { Injectable, NotFoundException } from '@nestjs/common';
import { HOME_ARTICLE_EXTERNAL_SLUGS } from '../../scripts/news-content-utils';
import { CACHE_KEYS, CACHE_TTL } from '../redis/redis.constants';
import { CacheService } from '../redis/cache.service';
import { NewsQueueService } from '../queue/news-queue.service';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly cacheService: CacheService,
    private readonly newsQueue: NewsQueueService,
  ) {}

  getCategories() {
    return this.cacheService.getOrSet(
      CACHE_KEYS.newsCategories(),
      CACHE_TTL.NEWS_CATEGORIES,
      () => this.newsRepository.findCategories(),
    );
  }

  async getArticles(params: {
    categorySlug?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 10, 50);

    return this.cacheService.getOrSet(
      CACHE_KEYS.newsList(params.categorySlug, page, limit),
      CACHE_TTL.NEWS_LIST,
      async () => {
        const [items, total] = await this.newsRepository.findArticles({
          categorySlug: params.categorySlug,
          page,
          limit,
        });

        return {
          items,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
    );
  }

  async getFeatured(categorySlug?: string) {
    return this.cacheService.getOrSet(
      CACHE_KEYS.newsFeatured(categorySlug),
      CACHE_TTL.NEWS_FEATURED,
      () => this.newsRepository.findFeaturedArticle(categorySlug),
    );
  }

  async getHomeArticles() {
    return this.cacheService.getOrSet(
      CACHE_KEYS.newsHome(),
      CACHE_TTL.NEWS_HOME,
      async () => {
        const articles = await this.newsRepository.findHomeArticles();
        const orderMap = new Map<string, number>(
          HOME_ARTICLE_EXTERNAL_SLUGS.map((slug, index) => [slug, index]),
        );

        const sorted = [...articles].sort((left, right) => {
          const leftOrder = orderMap.get(left.externalSlug ?? '') ?? 99;
          const rightOrder = orderMap.get(right.externalSlug ?? '') ?? 99;
          return leftOrder - rightOrder;
        });

        const featured =
          sorted.find((article) => article.isFeatured) ?? sorted[0] ?? null;
        const sideArticles = sorted
          .filter((article) => article.slug !== featured?.slug)
          .slice(0, 3);

        return { featured, sideArticles };
      },
    );
  }

  async getArticleBySlug(slug: string, trackView = true) {
    const article = await this.newsRepository.findArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    const [adjacent, sidebarFeatured, recommended] = await Promise.all([
      this.newsRepository.findAdjacentArticles(
        article.categoryId,
        article.categorySortOrder,
        article.id,
      ),
      this.newsRepository.findHotInCategory(article.categoryId, article.id, 4),
      this.newsRepository.findRecommendedArticles(article.id, 5),
      trackView
        ? this.newsQueue.incrementViewCount(article.id)
        : Promise.resolve(null),
    ]);

    const [prevArticle, nextArticle] = adjacent;

    return {
      ...article,
      viewCount: trackView ? article.viewCount + 1 : article.viewCount,
      prev: prevArticle,
      next: nextArticle,
      sidebarFeatured,
      recommended,
    };
  }

  async getStats() {
    return this.cacheService.getOrSet(
      CACHE_KEYS.newsStats(),
      CACHE_TTL.NEWS_STATS,
      async () => {
        const [
          articleCount,
          newArticles,
          topicCount,
          newTopics,
          projectCount,
          newProjects,
        ] = await this.newsRepository.getStats();

        return {
          articles: { total: articleCount, newCount: newArticles },
          topics: { total: topicCount, newCount: newTopics },
          projects: { total: projectCount, newCount: newProjects },
        };
      },
    );
  }
}
