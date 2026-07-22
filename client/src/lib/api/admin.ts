import type { PaginatedResponse } from '@/lib/api/client';
import { authFetch } from '@/lib/api/auth-client';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'EDITOR';
}

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  isHot: boolean;
  keywords: string[];
  viewCount: number;
  categorySortOrder: number;
  publishedAt: string;
  categoryId: string;
  category: { id: string; slug: string; name: string };
  author: { id: string; email: string; name: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count?: { articles: number };
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  isHot: boolean;
  keywords: string[];
  publishedAt: string;
  categorySortOrder: number;
}

export function login(email: string, password: string) {
  return authFetch<{ user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return authFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return authFetch<AuthUser>('/auth/me');
}

export function getAdminStats() {
  return authFetch<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalViews: number;
  }>('/admin/articles/stats');
}

export function getAdminArticles(params: {
  page?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.categoryId) query.set('categoryId', params.categoryId);
  const qs = query.toString();

  return authFetch<PaginatedResponse<AdminArticle>>(
    `/admin/articles${qs ? `?${qs}` : ''}`,
  );
}

export function getAdminArticle(id: string) {
  return authFetch<AdminArticle>(`/admin/articles/${id}`);
}

export function createAdminArticle(data: ArticleFormData) {
  return authFetch<AdminArticle>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminArticle(id: string, data: Partial<ArticleFormData>) {
  return authFetch<AdminArticle>(`/admin/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAdminArticle(id: string) {
  return authFetch<{ ok: boolean }>(`/admin/articles/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminCategories() {
  return authFetch<AdminCategory[]>('/admin/categories');
}

export function createAdminCategory(data: {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
}) {
  return authFetch<AdminCategory>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminCategory(
  id: string,
  data: { name?: string; description?: string; sortOrder?: number },
) {
  return authFetch<AdminCategory>(`/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAdminCategory(id: string) {
  return authFetch<{ ok: boolean }>(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
}

export function uploadArticleImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return authFetch<{ url: string; filename: string }>('/admin/upload', {
    method: 'POST',
    body: formData,
  });
}
