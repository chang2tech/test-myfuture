import { env } from '@/lib/core/env';

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
  const isFormData = options?.body instanceof FormData;
  const hasJsonBody =
    options?.body !== undefined &&
    options?.body !== null &&
    options?.body !== '' &&
    !isFormData;

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}
