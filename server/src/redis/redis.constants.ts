export const CACHE_TTL = {
  NEWS_CATEGORIES: 60,
  NEWS_LIST: 60,
  NEWS_FEATURED: 60,
  NEWS_HOME: 60,
  NEWS_STATS: 120,
  SEARCH_POPULAR: 300,
} as const;

export const CACHE_KEYS = {
  newsCategories: () => 'news:categories',
  newsList: (category: string | undefined, page: number, limit: number) =>
    `news:list:${category ?? 'all'}:${page}:${limit}`,
  newsFeatured: (category?: string) => `news:featured:${category ?? 'all'}`,
  newsHome: () => 'news:home',
  newsStats: () => 'news:stats',
  searchPopular: () => 'search:popular',
} as const;
