import { apiFetch, type PaginatedResponse } from '@/lib/api/client';

export interface NewsCategory {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  _count?: { articles: number };
}

export interface NewsArticle {
  id: string;
  slug: string;
  externalSlug: string | null;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  source: string | null;
  sourceUrl: string | null;
  keywords: string[];
  readTimeMinutes: number;
  isHot: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string;
  category: NewsCategory;
}

export interface ArticleNavItem {
  slug: string;
  title: string;
}

export interface NewsArticleDetail extends NewsArticle {
  prev: ArticleNavItem | null;
  next: ArticleNavItem | null;
  sidebarFeatured: NewsArticle[];
  recommended: NewsArticle[];
}

export interface MarketStats {
  articles: { total: number; newCount: number };
  topics: { total: number; newCount: number };
  projects: { total: number; newCount: number };
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  address: string;
  coverImage: string | null;
  investor: string | null;
}

export function getMarketStats() {
  return apiFetch<MarketStats>('/news/stats');
}

export function getNewsCategories() {
  return apiFetch<NewsCategory[]>('/news/categories');
}

export function getFeaturedArticle(category?: string) {
  const query = category ? `?category=${category}` : '';
  return apiFetch<NewsArticle | null>(`/news/featured${query}`);
}

export interface HomeNewsSection {
  featured: NewsArticle | null;
  sideArticles: NewsArticle[];
}

export function getHomeNewsSection() {
  return apiFetch<HomeNewsSection>('/news/home');
}

export function getNewsArticles(params?: {
  category?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();
  return apiFetch<PaginatedResponse<NewsArticle>>(
    `/news${query ? `?${query}` : ''}`,
  );
}

export function getFeaturedProjects(limit = 12) {
  return apiFetch<Project[]>(`/projects/featured?limit=${limit}`);
}

export function getNewsArticle(slug: string) {
  return apiFetch<NewsArticle>(`/news/${slug}`);
}

export function getNewsArticleDetail(
  slug: string,
  options?: { trackView?: boolean },
) {
  const query =
    options?.trackView === false ? '?trackView=false' : '';
  return apiFetch<NewsArticleDetail>(`/news/${slug}${query}`);
}
