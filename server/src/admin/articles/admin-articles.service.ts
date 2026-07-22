import { BadRequestException, Injectable } from '@nestjs/common';
import type { AuthUser } from '../../auth/auth.types';
import { NewsQueueService } from '../../queue/news-queue.service';
import { SearchService } from '../../search/search.service';
import type {
  AdminArticleQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './dto/admin-article.dto';
import { AdminArticlesRepository } from './admin-articles.repository';
import { AdminArticlesSortRepository } from './admin-articles-sort.repository';

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizeCoverImage(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

@Injectable()
export class AdminArticlesService {
  constructor(
    private readonly repository: AdminArticlesRepository,
    private readonly sortRepository: AdminArticlesSortRepository,
    private readonly searchService: SearchService,
    private readonly newsQueue: NewsQueueService,
  ) {}

  async list(query: AdminArticleQueryDto) {
    const [items, total] = await this.repository.findMany(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

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

  getById(id: string) {
    return this.repository.ensureExists(id);
  }

  searchSuggestions(query: string, limit?: number) {
    return this.searchService.searchAdminSuggestions(query, limit);
  }

  async create(dto: CreateArticleDto, user: AuthUser) {
    const existing = await this.repository.slugExists(dto.slug);
    if (existing) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    const categorySortOrder = await this.sortRepository.normalizeSortOrder(
      dto.categoryId,
      dto.categorySortOrder ?? 0,
      { forInsert: true },
    );

    const article = await this.repository.createWithSortOrder(
      {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: normalizeCoverImage(dto.coverImage) ?? null,
        status: dto.status,
        isFeatured: dto.isFeatured ?? false,
        isHot: dto.isHot ?? false,
        keywords: dto.keywords ?? [],
        readTimeMinutes: estimateReadTime(dto.content),
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
        categorySortOrder,
        category: { connect: { id: dto.categoryId } },
        author: { connect: { id: user.id } },
      },
      dto.categoryId,
      categorySortOrder,
    );

    await this.newsQueue.invalidateNewsCache();
    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.repository.ensureExists(id);

    if (dto.slug) {
      const existing = await this.repository.slugExists(dto.slug, id);
      if (existing) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    const categoryChanged =
      dto.categoryId !== undefined && dto.categoryId !== article.categoryId;
    const sortChanged =
      dto.categorySortOrder !== undefined &&
      dto.categorySortOrder !== article.categorySortOrder;

    if (categoryChanged) {
      const targetCategoryId = dto.categoryId!;
      const targetSortOrder = await this.sortRepository.normalizeSortOrder(
        targetCategoryId,
        dto.categorySortOrder ?? article.categorySortOrder,
        { forInsert: true },
      );

      await this.sortRepository.moveToCategory(
        id,
        article.categoryId,
        article.categorySortOrder,
        targetCategoryId,
        targetSortOrder,
      );
    } else if (sortChanged) {
      const targetSortOrder = await this.sortRepository.normalizeSortOrder(
        article.categoryId,
        dto.categorySortOrder!,
        { excludeArticleId: id },
      );

      await this.repository.reassignSortOrder(
        id,
        article.categoryId,
        article.categorySortOrder,
        targetSortOrder,
      );
    }

    const updated = await this.repository.update(id, {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
      ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
      ...(dto.content !== undefined
        ? {
            content: dto.content,
            readTimeMinutes: estimateReadTime(dto.content),
          }
        : {}),
      ...(dto.coverImage !== undefined
        ? { coverImage: normalizeCoverImage(dto.coverImage) ?? null }
        : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
      ...(dto.isHot !== undefined ? { isHot: dto.isHot } : {}),
      ...(dto.keywords !== undefined ? { keywords: dto.keywords } : {}),
      ...(dto.publishedAt !== undefined
        ? { publishedAt: new Date(dto.publishedAt) }
        : {}),
      ...(categoryChanged || sortChanged
        ? {}
        : dto.categorySortOrder !== undefined
          ? { categorySortOrder: dto.categorySortOrder }
          : {}),
      ...(categoryChanged
        ? {}
        : dto.categoryId !== undefined
          ? { category: { connect: { id: dto.categoryId } } }
          : {}),
    });

    await this.newsQueue.invalidateNewsCache();
    return updated;
  }

  async remove(id: string) {
    const article = await this.repository.ensureExists(id);
    await this.repository.delete(id);
    await this.sortRepository.compactAfterDelete(
      article.categoryId,
      article.categorySortOrder,
    );
    await this.newsQueue.invalidateNewsCache();
    return { ok: true };
  }

  async stats() {
    const [published, draft, archived, views] = await Promise.all([
      this.repository.countByStatus('PUBLISHED'),
      this.repository.countByStatus('DRAFT'),
      this.repository.countByStatus('ARCHIVED'),
      this.repository.sumViewCount(),
    ]);

    return {
      total: published + draft + archived,
      published,
      draft,
      archived,
      totalViews: views._sum.viewCount ?? 0,
    };
  }
}
