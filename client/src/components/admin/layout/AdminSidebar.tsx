'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_ITEMS } from '@/constants/admin/nav';
import { ASSETS } from '@/constants/layout/assets';

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={[
          'admin-sidebar',
          collapsed ? 'is-collapsed' : '',
          mobileOpen ? 'is-mobile-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar__brand">
          <Link
            href="/admin/dashboard"
            className="admin-sidebar__logo"
            data-tooltip={collapsed ? 'myFuture CMS' : undefined}
            title={collapsed ? 'myFuture CMS' : undefined}
            onClick={onMobileClose}
          >
            <Image
              src={ASSETS.logo}
              alt="myFuture"
              width={150}
              height={34}
              className="admin-sidebar__logo-img admin-sidebar__logo-img--full"
              priority
            />
            <span className="admin-sidebar__logo-mark">
              <Image
                src="/images/favicon.png"
                alt="myFuture"
                width={36}
                height={36}
                className="admin-sidebar__logo-img admin-sidebar__logo-img--icon"
                priority
              />
            </span>
            <span className="admin-sidebar__badge">CMS</span>
          </Link>
        </div>

        <p className="admin-sidebar__section-label">Menu chính</p>
        <nav className="admin-sidebar__nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar__link${active ? ' active' : ''}`}
                data-tooltip={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                onClick={onMobileClose}
              >
                <span className="admin-sidebar__link-icon">
                  <i className={`bx ${item.icon}`} aria-hidden />
                </span>
                <span className="admin-sidebar__link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-sidebar__collapse-btn"
            onClick={onToggle}
            data-tooltip={collapsed ? 'Mở rộng sidebar' : undefined}
            title={collapsed ? 'Mở rộng sidebar' : undefined}
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <i
              className={`bx ${collapsed ? 'bx-chevrons-right' : 'bx-chevrons-left'}`}
              aria-hidden
            />
            <span className="admin-sidebar__collapse-label">
              {collapsed ? 'Mở rộng' : 'Thu gọn'}
            </span>
          </button>
        </div>
      </aside>

      <button
        type="button"
        className="admin-sidebar-backdrop"
        aria-label="Đóng menu"
        onClick={onMobileClose}
        tabIndex={mobileOpen ? 0 : -1}
      />
    </>
  );
}
