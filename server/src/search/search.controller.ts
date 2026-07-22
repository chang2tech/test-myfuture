import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Tìm kiếm bài viết và dự án (public)' })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.searchPublic(query.q ?? '', query.limit ?? 10);
  }
}
