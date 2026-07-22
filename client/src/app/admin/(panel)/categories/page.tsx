import { Suspense } from 'react';
import { AdminCategoriesPageContent } from '@/components/admin/categories/AdminCategoriesPageContent';

export const metadata = {
  title: 'Quản lý danh mục | Admin myFuture',
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-card">
          <div className="admin-card__body text-secondary">Đang tải...</div>
        </div>
      }
    >
      <AdminCategoriesPageContent />
    </Suspense>
  );
}
