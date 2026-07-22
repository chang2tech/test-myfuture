'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSearchBox } from '@/components/admin/layout/AdminSearchBox';
import { AdminNotificationMenu } from '@/components/admin/layout/AdminNotificationMenu';
import { AdminUserMenu } from '@/components/admin/layout/AdminUserMenu';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const pathname = usePathname();
  const showSearch = pathname.startsWith('/admin/articles');

  return (
    <header className="admin-navbar">
      <div className="admin-shell__container admin-navbar__inner">
        <button
          type="button"
          className="admin-navbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Mở menu"
        >
          <i className="bx bx-menu" aria-hidden />
        </button>

        {showSearch && (
          <div className="admin-navbar__search">
            <AdminSearchBox />
          </div>
        )}

        <div className="admin-navbar__actions">
          <Link
            href="/ban-tin"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-navbar__icon-btn"
            title="Xem trang public"
            aria-label="Xem trang public"
          >
            <i className="bx bx-link-external" aria-hidden />
          </Link>
          <AdminNotificationMenu />
          <AdminUserMenu />
        </div>
      </div>
    </header>
  );
}
