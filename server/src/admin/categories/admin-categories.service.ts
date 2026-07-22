import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

const categoryInclude = {
  _count: { select: { articles: true } },
} as const;

@Injectable()
export class AdminCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.newsCategory.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: categoryInclude,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.newsCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return this.prisma.newsCategory.update({
      where: { id },
      data: dto,
      include: categoryInclude,
    });
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
    return { ok: true };
  }
}
