import { Suspense } from 'react';
import { LoginPanel } from '@/components/auth/LoginPanel';
import '@/styles/admin.css';

export const metadata = {
  title: 'Admin Login | myFuture',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-vh-100 bg-light" />}>
      <LoginPanel />
    </Suspense>
  );
}
