'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminLayoutProvider } from '@/components/admin/context/AdminLayoutContext';
import { AdminNavbar } from '@/components/admin/layout/AdminNavbar';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

function AdminShellInner({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="admin-root admin-shell">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((prev) => !prev)}
        onMobileClose={closeMobile}
      />
      <div className="admin-shell__main">
        <AdminNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="admin-shell__content">
          <div className="admin-shell__container">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminLayoutProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminLayoutProvider>
  );
}
