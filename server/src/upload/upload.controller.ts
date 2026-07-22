import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { UserRole } from '@prisma/client';
import type { UploadedImageFile } from '../common/types/uploaded-file.type';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/auth.guards';
import { UploadService } from './upload.service';

@Controller('admin/upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async upload(@Req() req: FastifyRequest) {
    const multipart = await req.file();
    if (!multipart) {
      throw new BadRequestException('Không có file được tải lên');
    }

    const buffer = await multipart.toBuffer();
    const file: UploadedImageFile = {
      mimetype: multipart.mimetype,
      size: buffer.length,
      buffer,
      originalname: multipart.filename,
    };

    return this.uploadService.saveImage(file);
  }
}
