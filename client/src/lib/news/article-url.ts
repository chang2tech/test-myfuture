import { CATEGORY_ROUTE_BY_SLUG } from '@/constants/news/category-routes';

export function getArticleHref(
  categorySlug: string,
  articleSlug: string,
): string {
  const config = CATEGORY_ROUTE_BY_SLUG[categorySlug];
  const categorySegment = config?.routeId ?? categorySlug;
  return `/ban-tin/${categorySegment}/${articleSlug}`;
}
