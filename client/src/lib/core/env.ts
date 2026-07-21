import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:4721/api'),
  NEXT_PUBLIC_API_ORIGIN: z
    .string()
    .url()
    .default('http://localhost:4721'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default('http://localhost:3721'),
});

export type ClientEnv = z.infer<typeof envSchema>;

const parsed = envSchema.parse({
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const env: ClientEnv & { apiUrl: string } = {
  ...parsed,
  apiUrl: parsed.API_URL ?? parsed.NEXT_PUBLIC_API_URL,
};
