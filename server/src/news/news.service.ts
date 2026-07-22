import { Injectable, NotFoundException } from '@nestjs/common';
import { HOME_ARTICLE_EXTERNAL_SLUGS } from '../../scripts/news-content-utils';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  getCategories() {
    return this.newsRepository.findCategories();
  }

  async getArticles(params: {
    categorySlug?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 10, 50);

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
  }

  async getFeatured(categorySlug?: string) {
    const article = await this.newsRepository.findFeaturedArticle(categorySlug);
    if (!article) {
      return null;
    }
    return article;
  }

  async getHomeArticles() {
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
        ? this.newsRepository.incrementViewCount(article.id)
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
  }
}
