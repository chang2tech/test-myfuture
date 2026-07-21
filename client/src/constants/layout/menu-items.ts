export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  badge?: { text: string; variant: 'new' | 'pro' };
  isAi?: boolean;
  isDivider?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Trang chủ', href: '/', icon: 'bx-home-circle' },
  {
    label: 'AI Triệu Lộ Nhi',
    href: 'https://ai.myfuture.vn',
    isAi: true,
  },
  { label: 'Tra cứu căn hộ', href: '/tool', icon: 'bx-search-alt-2' },
  { label: 'Thông tin dự án', href: '/thong-tin-du-an', icon: 'bx-building-house' },
  { label: 'Bảng hàng dự án', href: '/bang-hang', icon: 'bx-table' },
  {
    label: 'Thông tin thị trường',
    href: '/ban-tin',
    icon: 'bx-news',
  },
  {
    label: 'Tài liệu dự án',
    href: '/kho-tai-lieu',
    icon: 'bx-folder-open',
    badge: { text: 'NEW', variant: 'new' },
  },
  {
    label: 'Báo giá nhanh',
    href: '/bang-gia',
    icon: 'bx-calculator',
    badge: { text: 'PRO', variant: 'pro' },
  },
  {
    label: 'Khách hàng',
    href: '/crm',
    icon: 'bx-user',
    badge: { text: 'PRO', variant: 'pro' },
  },
  {
    label: 'Lịch hẹn',
    href: '/mf/lich-hen',
    icon: 'bx-calendar',
    badge: { text: 'PRO', variant: 'pro' },
  },
  {
    label: 'Công việc',
    href: '/mf/cong-viec',
    icon: 'bx-check-square',
    badge: { text: 'PRO', variant: 'pro' },
  },
  { label: '', href: '', isDivider: true },
  {
    label: 'Mạng lưới',
    href: '/mf/mang-luoi',
    icon: 'bx-share-alt',
    badge: { text: 'PRO', variant: 'pro' },
  },
  {
    label: 'Hoa hồng',
    href: '/mf/hoa-hong',
    icon: 'bx-dollar-circle',
    badge: { text: 'PRO', variant: 'pro' },
  },
  {
    label: 'Báo cáo',
    href: '/mf/bao-cao',
    icon: 'bx-bar-chart-alt-2',
    badge: { text: 'PRO', variant: 'pro' },
  },
  { label: '', href: '', isDivider: true },
  {
    label: 'Cài đặt',
    href: '#',
    icon: 'bx-cog',
    badge: { text: 'PRO', variant: 'pro' },
  },
];
