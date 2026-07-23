import { env } from '@/lib/core/env';
import {
  buildFetchHeaders,
  parseApiErrorMessage,
} from '@/lib/api/fetch-headers';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return env.apiUrl;
}

export async function authFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: buildFetchHeaders(options),
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      message = parseApiErrorMessage(response.status, body, message);
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}
