'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArticleCategoryTabs } from '@/components/admin/articles/ArticleCategoryTabs';
import { ArticleSortOrderCell } from '@/components/admin/articles/ArticleSortOrderCell';
import { AdminIconButton } from '@/components/admin/shared/AdminIconButton';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { revalidateNewsCache } from '@/lib/actions/revalidate-news';
import type { AdminArticle } from '@/lib/api/admin';
import { deleteAdminArticle, getAdminArticles } from '@/lib/api/admin';
import { getArticleHref } from '@/lib/news/article-url';

interface ArticleListPanelProps {
  search: string;
  onEdit: (article: AdminArticle) => void;
  refreshKey: number;
}

const STATUS_LABELS: Record<AdminArticle['status'], string> = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Xuất bản',
  ARCHIVED: 'Lưu trữ',
};

function formatViews(value: number): string {
  return value.toLocaleString('vi-VN');
}

export function ArticleListPanel({
  search,
  onEdit,
  refreshKey,
}: ArticleListPanelProps) {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState('');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminArticles({
        page,
        search: search || undefined,
        categoryId: categoryId || undefined,
      });
      setArticles(data.items);
      setTotalPages(data.meta.totalPages);
    } catch {
      toast.error('Không tải được danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async list fetch
    void loadArticles();
  }, [loadArticles, refreshKey]);

  function handleCategoryChange(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setPage(1);
  }

  async function handleDelete(article: AdminArticle) {
    if (!window.confirm(`Xóa bài "${article.title}"?`)) return;

    try {
      await deleteAdminArticle(article.id);
      await revalidateNewsCache();
      toast.success('Đã xóa bài viết');
      void loadArticles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa thất bại');
    }
  }

  const showCategoryColumn = !categoryId;
  const showOrderColumn = Boolean(categoryId);
  const tableColumnCount =
    5 + (showCategoryColumn ? 1 : 0) + (showOrderColumn ? 1 : 0);

  return (
    <div className="admin-articles-panel">
      <ArticleCategoryTabs
        activeCategoryId={categoryId}
        onChange={handleCategoryChange}
      />

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table admin-table--articles">
            <thead>
              <tr>
                <th className="admin-table__col-image">Ảnh</th>
                <th className="admin-table__col-title">Tiêu đề</th>
                {showCategoryColumn && (
                  <th className="admin-table__col-category">Danh mục</th>
                )}
                <th className="admin-table__col-views">Lượt xem</th>
                {showOrderColumn && (
                  <th className="admin-table__col-order">Thứ tự</th>
                )}
                <th className="admin-table__col-status">Trạng thái</th>
                <th className="admin-table__col-actions text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={tableColumnCount}
                    className="text-center py-4 text-secondary"
                  >
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && articles.length === 0 && (
                <tr>
                  <td
                    colSpan={tableColumnCount}
                    className="text-center py-4 text-secondary"
                  >
                    Không có bài viết
                  </td>
                </tr>
              )}

              {!loading &&
                articles.map((article) => (
                  <tr key={article.id}>
                    <td className="admin-table__col-image">
                      <div className="admin-table__thumb">
                        {article.coverImage ? (
                          <ImageWithSkeleton
                            layout="fill"
                            src={article.coverImage}
                            alt={article.title}
                            sizes="56px"
                          />
                        ) : (
                          <div className="bg-light w-100 h-100" />
                        )}
                      </div>
                    </td>
                    <td className="admin-table__col-title">
                      <div className="admin-table__title" title={article.title}>
                        {article.title}
                      </div>
                      <div
                        className="admin-table__slug"
                        title={getArticleHref(article.category.slug, article.slug)}
                      >
                        {getArticleHref(article.category.slug, article.slug)}
                      </div>
                    </td>
                    {showCategoryColumn && (
                      <td className="admin-table__col-category small">
                        {article.category.name}
                      </td>
                    )}
                    <td className="admin-table__col-views small text-nowrap">
                      {formatViews(article.viewCount ?? 0)}
                    </td>
                    {showOrderColumn && (
                      <td className="admin-table__col-order">
                        <ArticleSortOrderCell
                          key={`${article.id}-${article.categorySortOrder}`}
                          articleId={article.id}
                          value={article.categorySortOrder ?? 0}
                          onUpdated={loadArticles}
                        />
                      </td>
                    )}
                    <td className="admin-table__col-status">
                      <span
                        className={`admin-status admin-status--${article.status.toLowerCase()}`}
                      >
                        {STATUS_LABELS[article.status]}
                      </span>
                    </td>
                    <td className="admin-table__col-actions text-end">
                      <div className="admin-row-actions">
                        <AdminIconButton
                          icon="bx-edit"
                          label="Sửa bài viết"
                          size="sm"
                          onClick={() => onEdit(article)}
                        />
                        <AdminIconButton
                          icon="bx-trash"
                          label="Xóa bài viết"
                          variant="danger"
                          size="sm"
                          onClick={() => void handleDelete(article)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 p-3 border-top">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </button>
            <span className="small align-self-center">
              Trang {page}/{totalPages}
            </span>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
