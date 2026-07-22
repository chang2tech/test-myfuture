import { Suspense } from 'react';
import { AdminArticlesPageContent } from '@/components/admin/articles/AdminArticlesPageContent';

export const metadata = {
  title: 'Quản lý bài viết | Admin myFuture',
  robots: { index: false, follow: false },
};

export default function AdminArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-card">
          <div className="admin-card__body text-secondary">Đang tải...</div>
        </div>
      }
    >
      <AdminArticlesPageContent />
    </Suspense>
  );
}
