export interface CategoryRouteConfig {
  routeId: string;
  slug: string;
  name: string;
  icon: string;
}

export const CATEGORY_ROUTE_CONFIGS: CategoryRouteConfig[] = [
  {
    routeId: 'phap-ly-du-an-c11726',
    slug: 'phap-ly-du-an',
    name: 'Pháp lý dự án',
    icon: 'bxs-file-doc',
  },
  {
    routeId: 'quy-hoach-ha-tang-c11727',
    slug: 'quy-hoach-ha-tang',
    name: 'Quy hoạch - Hạ tầng',
    icon: 'bx-map',
  },
  {
    routeId: 'lai-suat-tai-chinh-c11728',
    slug: 'lai-suat-tai-chinh',
    name: 'Lãi suất - Tài chính',
    icon: 'bx-wallet',
  },
  {
    routeId: 'thi-truong-gia-ca-c11729',
    slug: 'thi-truong-gia-ca',
    name: 'Thị trường - Giá cả',
    icon: 'bx-trending-up',
  },
  {
    routeId: 'dau-tu-dong-tien-c11730',
    slug: 'dau-tu-dong-tien',
    name: 'Đầu tư - Dòng tiền',
    icon: 'bx-transfer-alt',
  },
  {
    routeId: 'cho-thue-c11731',
    slug: 'cho-thue',
    name: 'Cho thuê',
    icon: 'bx-key',
  },
];

export const CATEGORY_ROUTE_BY_ID = Object.fromEntries(
  CATEGORY_ROUTE_CONFIGS.map((item) => [item.routeId, item]),
) as Record<string, CategoryRouteConfig>;

export const CATEGORY_ROUTE_BY_SLUG = Object.fromEntries(
  CATEGORY_ROUTE_CONFIGS.map((item) => [item.slug, item]),
) as Record<string, CategoryRouteConfig>;

export const CATEGORY_PAGE_SIZE = 10;

export function getCategoryRouteHref(slug: string): string {
  if (slug === 'toan-canh') return '/ban-tin';
  const config = CATEGORY_ROUTE_BY_SLUG[slug];
  return config ? `/ban-tin/${config.routeId}` : '/ban-tin';
}

export function getCategoryPageHref(routeId: string, page: number): string {
  if (page <= 1) return `/ban-tin/${routeId}`;
  return `/ban-tin/${routeId}/trang-${page}`;
}

export function getCategoryRouteById(
  routeId: string,
): CategoryRouteConfig | undefined {
  return CATEGORY_ROUTE_BY_ID[routeId];
}
