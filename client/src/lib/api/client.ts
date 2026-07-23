import { env } from '@/lib/core/env';
import { buildFetchHeaders } from '@/lib/api/fetch-headers';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    headers: buildFetchHeaders(options),
    next: { tags: ['news'], revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}
