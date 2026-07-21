export interface QuickAccessItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  colorClass: string;
  iconColor?: string;
  isPro?: boolean;
  positionRelative?: boolean;
}

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    title: 'Tra cứu căn hộ',
    description: 'Tìm kiếm nhanh',
    href: '/tool',
    icon: 'bx-search',
    colorClass: 'text-danger',
  },
  {
    title: 'Dự án',
    description: 'Khám phá dự án',
    href: '/thong-tin-du-an',
    icon: 'bx-building-house',
    colorClass: 'text-primary',
    iconColor: '#4f46e5',
  },
  {
    title: 'Bảng hàng',
    description: 'Quỹ hàng dự án',
    href: '/bang-hang',
    icon: 'bx-table',
    colorClass: 'text-warning',
  },
  {
    title: 'Báo giá nhanh',
    description: 'Tạo báo giá tức thì',
    href: '/bang-gia',
    icon: 'bx-calculator',
    colorClass: 'text-success',
    isPro: true,
    positionRelative: true,
  },
  {
    title: 'Tài liệu',
    description: 'Kho tài liệu dự án',
    href: '/kho-tai-lieu',
    icon: 'bx-folder-open',
    colorClass: 'text-primary',
    positionRelative: true,
  },
  {
    title: 'Lịch hẹn',
    description: 'Quản lý lịch hẹn',
    href: '/mf/lich-hen',
    icon: 'bx-calendar',
    colorClass: 'text-danger',
    isPro: true,
    positionRelative: true,
  },
];
