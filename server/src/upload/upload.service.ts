import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { UploadedImageFile } from '../common/types/uploaded-file.type';
import { getUploadDirectory, UPLOAD_PUBLIC_BASE_PATH } from './upload.paths';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}

  private get uploadDir(): string {
    return getUploadDirectory(this.config);
  }

  async saveImage(file: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException('Không có file được tải lên');
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException('Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Ảnh không được vượt quá 5MB');
    }

    await mkdir(this.uploadDir, { recursive: true });

    const ext = extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const filepath = join(this.uploadDir, filename);

    await writeFile(filepath, file.buffer);

    return {
      url: `${UPLOAD_PUBLIC_BASE_PATH}/${filename}`,
      filename,
    };
  }
}
