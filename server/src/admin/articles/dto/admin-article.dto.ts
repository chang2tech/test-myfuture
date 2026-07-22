import { ArticleStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AdminArticleQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
}

export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(3)
  slug!: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categorySortOrder?: number;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categorySortOrder?: number;
}
