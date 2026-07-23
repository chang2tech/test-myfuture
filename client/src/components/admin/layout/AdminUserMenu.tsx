'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  getUserInitials,
  getUserRoleLabel,
} from '@/components/admin/layout/admin-user-utils';
import { getMe, logout, type AuthUser } from '@/lib/api/admin';

export function AdminUserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Không thể đăng xuất',
      );
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  }

  const displayName = user?.name ?? user?.email ?? 'Administrator';
  const initials = user ? getUserInitials(user) : '…';

  return (
    <div className="admin-user-menu" ref={menuRef}>
      <button
        type="button"
        className="admin-user-menu__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="admin-user-menu__avatar" aria-hidden>
          {initials}
        </span>
        <span className="admin-user-menu__meta">
          <span className="admin-user-menu__name">{displayName}</span>
          {user && (
            <span className="admin-user-menu__role">{getUserRoleLabel(user.role)}</span>
          )}
        </span>
        <i
          className={`bx bx-chevron-down admin-user-menu__chevron${open ? ' is-open' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="admin-user-menu__dropdown" role="menu">
          <div className="admin-user-menu__header">
            <span className="admin-user-menu__avatar admin-user-menu__avatar--lg" aria-hidden>
              {initials}
            </span>
            <div className="admin-user-menu__header-text">
              <p className="admin-user-menu__name">{displayName}</p>
              {user?.email && (
                <p className="admin-user-menu__email">{user.email}</p>
              )}
              {user && (
                <span className="admin-user-menu__role-badge">
                  {getUserRoleLabel(user.role)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="admin-user-menu__item admin-user-menu__item--danger"
            role="menuitem"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
          >
            <i className="bx bx-log-out" aria-hidden />
            {loggingOut ? 'Đang thoát...' : 'Đăng xuất'}
          </button>
        </div>
      )}
    </div>
  );
}
