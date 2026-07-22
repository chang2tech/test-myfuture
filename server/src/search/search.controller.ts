import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Tìm kiếm bài viết và dự án (public)' })
  search(@Query() query: SearchQueryDto, @Req() req: FastifyRequest) {
    return this.searchService.searchPublic(
      query.q ?? '',
      query.limit ?? 10,
      req.ip,
    );
  }
}
