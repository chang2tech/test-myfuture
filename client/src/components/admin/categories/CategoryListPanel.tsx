'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminIconButton } from '@/components/admin/shared/AdminIconButton';
import { revalidateNewsCache } from '@/lib/actions/revalidate-news';
import {
  deleteAdminCategory,
  getAdminCategories,
  type AdminCategory,
} from '@/lib/api/admin';

interface CategoryListPanelProps {
  onEdit: (category: AdminCategory) => void;
  refreshKey?: number;
}

export function CategoryListPanel({ onEdit, refreshKey = 0 }: CategoryListPanelProps) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async list fetch
    void loadCategories();
  }, [loadCategories, refreshKey]);

  async function handleDelete(category: AdminCategory) {
    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;

    setDeletingId(category.id);
    try {
      await deleteAdminCategory(category.id);
      await revalidateNewsCache();
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      toast.success('Đã xóa danh mục');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Không thể xóa danh mục',
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-card">
        <div className="admin-card__body text-secondary">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Slug</th>
              <th>Bài viết</th>
              <th>Thứ tự</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-secondary">
                  Chưa có danh mục
                </td>
              </tr>
            )}

            {categories.map((category) => (
              <tr key={category.id}>
                <td className="fw-medium">{category.name}</td>
                <td className="text-secondary">{category.slug}</td>
                <td>{category._count?.articles ?? 0}</td>
                <td>{category.sortOrder}</td>
                <td className="text-end">
                  <div className="admin-row-actions">
                    <AdminIconButton
                      icon="bx-edit"
                      label="Sửa danh mục"
                      size="sm"
                      onClick={() => onEdit(category)}
                    />
                    <AdminIconButton
                      icon="bx-trash"
                      label="Xóa danh mục"
                      variant="danger"
                      size="sm"
                      disabled={deletingId === category.id}
                      onClick={() => void handleDelete(category)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
