import { env } from '@/lib/core/env';
import { authFetch } from '@/lib/api/auth-client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

async function publicSearchFetch<T>(path: string): Promise<T> {
  const base = typeof window !== 'undefined' ? '/api' : env.apiUrl;
  const response = await fetch(`${base}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

export interface SearchArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  snippet: string | null;
  coverImage: string | null;
  publishedAt: string;
  category: {
    slug: string;
    name: string;
  };
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface SearchProjectItem {
  id: string;
  slug: string;
  name: string;
  address: string;
  coverImage: string | null;
  investor: string | null;
}

export interface PublicSearchResponse {
  query: string;
  popular: string[];
  articles: {
    total: number;
    items: SearchArticleItem[];
  };
  projects: {
    total: number;
    items: SearchProjectItem[];
  };
}

export interface AdminSearchResponse {
  query: string;
  popular: string[];
  articles: {
    total: number;
    items: SearchArticleItem[];
  };
}

export function getPublicSearch(query = '', limit = 10) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  params.set('limit', String(limit));
  const qs = params.toString();

  return publicSearchFetch<PublicSearchResponse>(`/search${qs ? `?${qs}` : ''}`);
}

export function getAdminSearchSuggestions(query = '', limit = 8) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  params.set('limit', String(limit));
  const qs = params.toString();

  return authFetch<AdminSearchResponse>(
    `/admin/articles/suggestions${qs ? `?${qs}` : ''}`,
  );
}
