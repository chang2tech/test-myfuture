import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang',
  })
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
