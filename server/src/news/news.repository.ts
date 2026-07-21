import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HOME_ARTICLE_EXTERNAL_SLUGS } from '../../scripts/news-content-utils';
import { PrismaService } from '../prisma/prisma.service';

export type NewsArticleWithCategory = Prisma.NewsArticleGetPayload<{
  include: { category: true };
}>;

@Injectable()
export class NewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCategories() {
    return this.prisma.newsCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { articles: true } },
      },
    });
  }

  findCategoryBySlug(slug: string) {
    return this.prisma.newsCategory.findUnique({ where: { slug } });
  }

  findArticles(params: { categorySlug?: string; page: number; limit: number }) {
    const { categorySlug, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsArticleWhereInput = categorySlug
      ? { category: { slug: categorySlug } }
      : {};

    const orderBy: Prisma.NewsArticleOrderByWithRelationInput[] = categorySlug
      ? [{ categorySortOrder: 'asc' }, { publishedAt: 'desc' }]
      : [{ publishedAt: 'desc' }, { categorySortOrder: 'asc' }];

    return this.prisma.$transaction([
      this.prisma.newsArticle.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);
  }

  findFeaturedArticle(categorySlug?: string) {
    const where: Prisma.NewsArticleWhereInput = {
      isFeatured: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    };

    return this.prisma.newsArticle.findFirst({
      where,
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  findHomeArticles() {
    return this.prisma.newsArticle.findMany({
      where: {
        externalSlug: { in: [...HOME_ARTICLE_EXTERNAL_SLUGS] },
      },
      include: { category: true },
    });
  }

  findArticleBySlug(slug: string) {
    return this.prisma.newsArticle.findFirst({
      where: {
        OR: [{ slug }, { externalSlug: slug }],
      },
      include: { category: true },
    });
  }

  findAdjacentArticles(
    categoryId: string,
    categorySortOrder: number,
    excludeId: string,
  ) {
    return this.prisma.$transaction([
      this.prisma.newsArticle.findFirst({
        where: {
          categoryId,
          id: { not: excludeId },
          categorySortOrder: { lt: categorySortOrder },
        },
        orderBy: { categorySortOrder: 'desc' },
        select: { slug: true, title: true },
      }),
      this.prisma.newsArticle.findFirst({
        where: {
          categoryId,
          id: { not: excludeId },
          categorySortOrder: { gt: categorySortOrder },
        },
        orderBy: { categorySortOrder: 'asc' },
        select: { slug: true, title: true },
      }),
    ]);
  }

  findHotInCategory(categoryId: string, excludeId: string, limit: number) {
    return this.prisma.newsArticle.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
        OR: [{ isHot: true }, { isFeatured: true }],
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  findRecommendedArticles(excludeId: string, limit: number) {
    return this.prisma.newsArticle.findMany({
      where: { id: { not: excludeId } },
      include: { category: true },
      orderBy: [{ isHot: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    });
  }

  incrementViewCount(id: string) {
    return this.prisma.newsArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  getStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.$transaction([
      this.prisma.newsArticle.count(),
      this.prisma.newsArticle.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.newsCategory.count(),
      this.prisma.newsCategory.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.project.count(),
      this.prisma.project.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);
  }
}
