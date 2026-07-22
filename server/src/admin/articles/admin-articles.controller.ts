import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import type { AuthUser } from '../../auth/auth.types';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards/auth.guards';
import { AdminArticlesService } from './admin-articles.service';
import {
  AdminArticleQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
} from './dto/admin-article.dto';

@Controller('admin/articles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class AdminArticlesController {
  constructor(private readonly service: AdminArticlesService) {}

  @Get('stats')
  stats() {
    return this.service.stats();
  }

  @Get('suggestions')
  suggestions(@Query('q') q?: string, @Query('limit') limit?: string) {
    return this.service.searchSuggestions(q ?? '', limit ? Number(limit) : 8);
  }

  @Get()
  list(@Query() query: AdminArticleQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
