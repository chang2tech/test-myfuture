import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma } from '@prisma/client';
import { mergeArticleSearchWhere } from '../../common/article-search.util';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminArticlesSortRepository } from './admin-articles-sort.repository';
import type { AdminArticleQueryDto } from './dto/admin-article.dto';

@Injectable()
export class AdminArticlesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sortRepository: AdminArticlesSortRepository,
  ) {}

  findMany(query: AdminArticleQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsArticleWhereInput = mergeArticleSearchWhere(
      {
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      query.search,
    );

    const orderBy: Prisma.NewsArticleOrderByWithRelationInput[] =
      query.categoryId
        ? [{ categorySortOrder: 'asc' }, { publishedAt: 'desc' }]
        : [{ updatedAt: 'desc' }];

    return this.prisma.$transaction([
      this.prisma.newsArticle.findMany({
        where,
        include: { category: true, author: true },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);
  }

  findById(id: string) {
    return this.prisma.newsArticle.findUnique({
      where: { id },
      include: { category: true, author: true },
    });
  }

  create(data: Prisma.NewsArticleCreateInput) {
    return this.prisma.newsArticle.create({
      data,
      include: { category: true, author: true },
    });
  }

  createWithSortOrder(
    data: Prisma.NewsArticleCreateInput,
    categoryId: string,
    sortOrder: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await this.sortRepository.makeRoomInCategory(tx, categoryId, sortOrder);

      return tx.newsArticle.create({
        data,
        include: { category: true, author: true },
      });
    });
  }

  reassignSortOrder(
    articleId: string,
    categoryId: string,
    oldOrder: number,
    newOrder: number,
  ) {
    return this.prisma.$transaction((tx) =>
      this.sortRepository.reassignInCategory(
        tx,
        articleId,
        categoryId,
        oldOrder,
        newOrder,
      ),
    );
  }

  update(id: string, data: Prisma.NewsArticleUpdateInput) {
    return this.prisma.newsArticle.update({
      where: { id },
      data,
      include: { category: true, author: true },
    });
  }

  delete(id: string) {
    return this.prisma.newsArticle.delete({ where: { id } });
  }

  async ensureExists(id: string) {
    const article = await this.findById(id);
    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    return article;
  }

  slugExists(slug: string, excludeId?: string) {
    return this.prisma.newsArticle.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  }

  countByStatus(status: ArticleStatus) {
    return this.prisma.newsArticle.count({ where: { status } });
  }

  sumViewCount() {
    return this.prisma.newsArticle.aggregate({
      _sum: { viewCount: true },
    });
  }
}
