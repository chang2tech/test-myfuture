import { AdminShell } from '@/components/admin/layout/AdminShell';
import '@/styles/admin.css';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
