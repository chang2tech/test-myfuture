import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Dự án nổi bật' })
  @ApiQuery({ name: 'limit', required: false })
  getFeatured(@Query('limit') limit?: string) {
    return this.projectsService.getFeatured(limit ? Number(limit) : 12);
  }
}
