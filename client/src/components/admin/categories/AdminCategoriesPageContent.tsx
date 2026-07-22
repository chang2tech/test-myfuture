'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryEditDialog } from '@/components/admin/categories/CategoryEditDialog';
import { CategoryListPanel } from '@/components/admin/categories/CategoryListPanel';
import type { AdminCategory } from '@/lib/api/admin';

type CategoryDialogState =
  | { mode: 'create' }
  | { mode: 'edit'; category: AdminCategory }
  | null;

export function AdminCategoriesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialog, setDialog] = useState<CategoryDialogState>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSaved() {
    setDialog(null);
    setRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- open dialog from route query
    setDialog({ mode: 'create' });
    router.replace('/admin/categories', { scroll: false });
  }, [searchParams, router]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Quản lý danh mục</h2>
          <p className="admin-page-header__desc">
            Tạo, chỉnh sửa và xóa danh mục bài viết
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => setDialog({ mode: 'create' })}
        >
          <i className="bx bx-plus" aria-hidden />
          Tạo danh mục
        </button>
      </div>

      <CategoryListPanel
        refreshKey={refreshKey}
        onEdit={(category) => setDialog({ mode: 'edit', category })}
      />

      {dialog && (
        <CategoryEditDialog
          category={dialog.mode === 'edit' ? dialog.category : undefined}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
