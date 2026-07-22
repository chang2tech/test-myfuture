import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  buildArticleSearchFilter,
  publishedArticleWhere,
} from '../common/article-search.util';
import { PrismaService } from '../prisma/prisma.service';

const ARTICLE_SELECT = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  coverImage: true,
  status: true,
  publishedAt: true,
  category: {
    select: {
      slug: true,
      name: true,
    },
  },
} satisfies Prisma.NewsArticleSelect;

const PROJECT_SELECT = {
  id: true,
  slug: true,
  name: true,
  address: true,
  coverImage: true,
  investor: true,
} satisfies Prisma.ProjectSelect;

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  searchPublishedArticles(query: string, limit: number) {
    const searchFilter = buildArticleSearchFilter(query);
    if (!searchFilter) {
      return Promise.resolve([[], 0] as const);
    }

    const where: Prisma.NewsArticleWhereInput = {
      AND: [publishedArticleWhere(), searchFilter],
    };

    return this.prisma.$transaction([
      this.prisma.newsArticle.findMany({
        where,
        select: ARTICLE_SELECT,
        orderBy: [{ publishedAt: 'desc' }],
        take: limit,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);
  }

  searchAdminArticles(query: string, limit: number) {
    const searchFilter = buildArticleSearchFilter(query);
    if (!searchFilter) {
      return Promise.resolve([[], 0] as const);
    }

    return this.prisma.$transaction([
      this.prisma.newsArticle.findMany({
        where: searchFilter,
        select: ARTICLE_SELECT,
        orderBy: [{ updatedAt: 'desc' }],
        take: limit,
      }),
      this.prisma.newsArticle.count({ where: searchFilter }),
    ]);
  }

  searchProjects(query: string, limit: number) {
    const trimmed = query.trim();
    if (!trimmed) {
      return Promise.resolve([[], 0] as const);
    }

    const where: Prisma.ProjectWhereInput = {
      OR: [
        { name: { contains: trimmed, mode: 'insensitive' } },
        { address: { contains: trimmed, mode: 'insensitive' } },
        { investor: { contains: trimmed, mode: 'insensitive' } },
        { slug: { contains: trimmed, mode: 'insensitive' } },
      ],
    };

    return this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        select: PROJECT_SELECT,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);
  }

  findPopularTerms(limit: number) {
    return this.prisma.$transaction([
      this.prisma.project.findMany({
        where: { isFeatured: true },
        select: { name: true },
        orderBy: [{ sortOrder: 'asc' }],
        take: limit,
      }),
      this.prisma.newsArticle.findMany({
        where: {
          ...publishedArticleWhere(),
          OR: [{ isHot: true }, { isFeatured: true }],
        },
        select: { title: true },
        orderBy: [{ publishedAt: 'desc' }],
        take: limit,
      }),
    ]);
  }
}
