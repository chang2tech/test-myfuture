import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4721),
  DATABASE_URL: z.string().min(1),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6380),
  REDIS_PASSWORD: z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:3721'),
  CLIENT_URL: z.string().default('http://localhost:3721'),
  JWT_SECRET: z.string().min(16).default('dev-jwt-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  UPLOAD_DIR: z.string().default('uploads/articles'),
  DEV_ADMIN_EMAIL: z.string().email().default('admin@myfuture.vn'),
  DEV_ADMIN_PASSWORD: z.string().min(8).default('Admin@2026'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new Error(`Invalid environment variables: ${message}`);
  }
  return parsed.data;
}
