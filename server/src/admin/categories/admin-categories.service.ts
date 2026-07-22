import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewsQueueService } from '../../queue/news-queue.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

const categoryInclude = {
  _count: { select: { articles: true } },
} as const;

@Injectable()
export class AdminCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly newsQueue: NewsQueueService,
  ) {}

  list() {
    return this.prisma.newsCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: categoryInclude,
    });
  }

  async create(dto: CreateCategoryDto) {
    const slugExists = await this.prisma.newsCategory.findUnique({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new ConflictException('Slug danh mục đã tồn tại');
    }

    const category = await this.prisma.newsCategory.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: categoryInclude,
    });

    await this.newsQueue.invalidateNewsCache();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.newsCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    const updated = await this.prisma.newsCategory.update({
      where: { id },
      data: dto,
      include: categoryInclude,
    });

    await this.newsQueue.invalidateNewsCache();
    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.newsCategory.findUnique({
      where: { id },
      include: categoryInclude,
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    const articleCount = existing._count.articles;
    if (articleCount > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục "${existing.name}" vì còn ${articleCount} bài viết`,
      );
    }

    await this.prisma.newsCategory.delete({ where: { id } });
    await this.newsQueue.invalidateNewsCache();
    return { ok: true };
  }
}
