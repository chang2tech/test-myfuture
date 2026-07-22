'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArticleEditorPanel } from '@/components/admin/articles/ArticleEditorPanel';
import { ArticleListPanel } from '@/components/admin/articles/ArticleListPanel';
import { useAdminLayout } from '@/components/admin/context/AdminLayoutContext';
import type { AdminArticle } from '@/lib/api/admin';
import { getAdminArticle } from '@/lib/api/admin';

export function AdminArticlesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { search } = useAdminLayout();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<AdminArticle | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function openCreate() {
    setSelectedArticle(null);
    setEditorOpen(true);
  }

  function openEdit(article: AdminArticle) {
    setSelectedArticle(article);
    setEditorOpen(true);
  }

  function handleSaved() {
    setRefreshKey((key) => key + 1);
  }

  function handleCloseEditor() {
    setEditorOpen(false);
    setSelectedArticle(null);
  }

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId) return;

    let cancelled = false;

    void getAdminArticle(editId)
      .then((article) => {
        if (cancelled) return;
        openEdit(article);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Không tìm thấy bài viết');
        }
      })
      .finally(() => {
        if (!cancelled) {
          router.replace('/admin/articles', { scroll: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- open panel from route query
    openCreate();
    router.replace('/admin/articles', { scroll: false });
  }, [searchParams, router]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Quản lý bài viết</h2>
          <p className="admin-page-header__desc">
            Tạo, chỉnh sửa và xuất bản bài viết tin tức
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={openCreate}
        >
          <i className="bx bx-plus" aria-hidden />
          Tạo bài viết
        </button>
      </div>

      <ArticleListPanel
        key={`${search}-${refreshKey}`}
        search={search}
        refreshKey={refreshKey}
        onEdit={openEdit}
      />

      <ArticleEditorPanel
        key={selectedArticle?.id ?? 'new'}
        article={selectedArticle}
        isOpen={editorOpen}
        onClose={handleCloseEditor}
        onSaved={handleSaved}
      />
    </>
  );
}
