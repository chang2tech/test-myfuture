import { AppNavbar } from '@/components/layout/AppNavbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthFooter } from '@/components/layout/AuthFooter';
import { LayoutScripts } from '@/components/layout/LayoutScripts';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="layout-wrapper layout-content-navbar">
      <AppNavbar />
      <div className="layout-container">
        <AppSidebar />
        <div className="layout-page">
          <div className="content-wrapper">
            {children}
            <MobileBottomNav />
            <AuthFooter />
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" />
      <div className="drag-target" />
      <LayoutScripts />
    </div>
  );
}
