export interface NewsCategoryTab {
  slug: string;
  name: string;
  icon: string;
}

export const BAN_TIN_OVERVIEW_TAB = {
  href: '/ban-tin',
  name: 'Tất cả',
  icon: 'bxs-home',
} as const;

export const NEWS_CATEGORY_TABS: NewsCategoryTab[] = [
  { slug: 'phap-ly-du-an', name: 'Pháp lý dự án', icon: 'bxs-file-doc' },
  { slug: 'quy-hoach-ha-tang', name: 'Quy hoạch - Hạ tầng', icon: 'bx-map' },
  { slug: 'lai-suat-tai-chinh', name: 'Lãi suất - Tài chính', icon: 'bx-wallet' },
  { slug: 'thi-truong-gia-ca', name: 'Thị trường - Giá cả', icon: 'bx-trending-up' },
  { slug: 'dau-tu-dong-tien', name: 'Đầu tư - Dòng tiền', icon: 'bx-transfer-alt' },
  { slug: 'cho-thue', name: 'Cho thuê', icon: 'bx-key' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  'phap-ly-du-an': 'bxs-file-doc',
  'quy-hoach-ha-tang': 'bx-map',
  'lai-suat-tai-chinh': 'bx-wallet',
  'thi-truong-gia-ca': 'bx-trending-up',
  'dau-tu-dong-tien': 'bx-transfer-alt',
  'cho-thue': 'bx-key',
};

export const CATEGORY_BADGE_COLORS: Record<string, string> = {
  'phap-ly-du-an': '#4f46e5',
  'quy-hoach-ha-tang': '#7c3aed',
  'lai-suat-tai-chinh': '#16a34a',
  'thi-truong-gia-ca': '#0ea5e9',
  'dau-tu-dong-tien': '#ea580c',
  'cho-thue': '#db2777',
};

const DEFAULT_CATEGORY_BADGE_COLOR = '#64748b';

export function getCategoryBadgeColor(slug: string): string {
  return CATEGORY_BADGE_COLORS[slug] ?? DEFAULT_CATEGORY_BADGE_COLOR;
}
