import { resolve } from 'node:path';
import type { ConfigService } from '@nestjs/config';

export const UPLOAD_PUBLIC_BASE_PATH = '/uploads/articles';

export function getUploadDirectory(config: ConfigService): string {
  return resolve(
    process.cwd(),
    config.get<string>('UPLOAD_DIR', 'uploads/articles'),
  );
}
