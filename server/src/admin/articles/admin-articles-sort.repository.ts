import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type PrismaTx = Prisma.TransactionClient;

@Injectable()
export class AdminArticlesSortRepository {
  constructor(private readonly prisma: PrismaService) {}

  async normalizeSortOrder(
    categoryId: string,
    requested: number,
    options?: { excludeArticleId?: string; forInsert?: boolean },
  ): Promise<number> {
    const count = await this.prisma.newsArticle.count({
      where: {
        categoryId,
        ...(options?.excludeArticleId
          ? { NOT: { id: options.excludeArticleId } }
          : {}),
      },
    });

    const max = options?.forInsert ? count : Math.max(0, count - 1);
    return Math.max(0, Math.min(requested, max));
  }

  makeRoomInCategory(tx: PrismaTx, categoryId: string, sortOrder: number) {
    return tx.$executeRaw`
      UPDATE "news_articles"
      SET "categorySortOrder" = "categorySortOrder" + 1
      WHERE "categoryId" = ${categoryId}
        AND "categorySortOrder" >= ${sortOrder}
    `;
  }

  closeGapInCategory(tx: PrismaTx, categoryId: string, sortOrder: number) {
    return tx.$executeRaw`
      UPDATE "news_articles"
      SET "categorySortOrder" = "categorySortOrder" - 1
      WHERE "categoryId" = ${categoryId}
        AND "categorySortOrder" > ${sortOrder}
    `;
  }

  reassignInCategory(
    tx: PrismaTx,
    articleId: string,
    categoryId: string,
    oldOrder: number,
    newOrder: number,
  ) {
    if (oldOrder === newOrder) {
      return Promise.resolve(0);
    }

    return tx.$executeRaw`
      UPDATE "news_articles"
      SET "categorySortOrder" = CASE
        WHEN id = ${articleId} THEN ${newOrder}
        WHEN ${newOrder} < ${oldOrder}
          AND "categorySortOrder" >= ${newOrder}
          AND "categorySortOrder" < ${oldOrder}
          THEN "categorySortOrder" + 1
        WHEN ${newOrder} > ${oldOrder}
          AND "categorySortOrder" > ${oldOrder}
          AND "categorySortOrder" <= ${newOrder}
          THEN "categorySortOrder" - 1
        ELSE "categorySortOrder"
      END
      WHERE "categoryId" = ${categoryId}
        AND (
          id = ${articleId}
          OR (
            (${newOrder} < ${oldOrder}
              AND "categorySortOrder" >= ${newOrder}
              AND "categorySortOrder" < ${oldOrder})
            OR (${newOrder} > ${oldOrder}
              AND "categorySortOrder" > ${oldOrder}
              AND "categorySortOrder" <= ${newOrder})
          )
        )
    `;
  }

  moveToCategory(
    articleId: string,
    fromCategoryId: string,
    fromOrder: number,
    toCategoryId: string,
    toOrder: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await this.closeGapInCategory(tx, fromCategoryId, fromOrder);
      await this.makeRoomInCategory(tx, toCategoryId, toOrder);

      return tx.newsArticle.update({
        where: { id: articleId },
        data: {
          categoryId: toCategoryId,
          categorySortOrder: toOrder,
        },
      });
    });
  }

  compactAfterDelete(categoryId: string, deletedOrder: number) {
    return this.prisma.$executeRaw`
      UPDATE "news_articles"
      SET "categorySortOrder" = "categorySortOrder" - 1
      WHERE "categoryId" = ${categoryId}
        AND "categorySortOrder" > ${deletedOrder}
    `;
  }
}
