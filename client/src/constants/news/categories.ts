export interface NewsCategoryTab {
  slug: string;
  name: string;
  icon: string;
}

export const NEWS_CATEGORY_TABS: NewsCategoryTab[] = [
  { slug: 'toan-canh', name: 'Toàn cảnh', icon: 'bxs-home' },
  { slug: 'phap-ly-du-an', name: 'Pháp lý dự án', icon: 'bxs-file-doc' },
  { slug: 'quy-hoach-ha-tang', name: 'Quy hoạch - Hạ tầng', icon: 'bx-map' },
  { slug: 'lai-suat-tai-chinh', name: 'Lãi suất - Tài chính', icon: 'bx-wallet' },
  { slug: 'thi-truong-gia-ca', name: 'Thị trường - Giá cả', icon: 'bx-trending-up' },
  { slug: 'dau-tu-dong-tien', name: 'Đầu tư - Dòng tiền', icon: 'bx-transfer-alt' },
  { slug: 'cho-thue', name: 'Cho thuê', icon: 'bx-key' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  'toan-canh': 'bxs-home',
  'phap-ly-du-an': 'bxs-file-doc',
  'quy-hoach-ha-tang': 'bx-map',
  'lai-suat-tai-chinh': 'bx-wallet',
  'thi-truong-gia-ca': 'bx-trending-up',
  'dau-tu-dong-tien': 'bx-transfer-alt',
  'cho-thue': 'bx-key',
};
