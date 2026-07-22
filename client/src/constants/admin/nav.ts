export const ADMIN_NAV_ITEMS = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: 'bx-grid-alt',
    section: 'main',
  },
  {
    href: '/admin/articles',
    label: 'Bài viết',
    icon: 'bx-news',
    section: 'main',
  },
  {
    href: '/admin/categories',
    label: 'Danh mục',
    icon: 'bx-category',
    section: 'main',
  },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV_ITEMS)[number];
