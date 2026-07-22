import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards/auth.guards';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: AdminCategoriesService) {}

  @Get()
  list() {
    return this.categoriesService.list();
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
