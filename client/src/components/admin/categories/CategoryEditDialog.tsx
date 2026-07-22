'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { revalidateNewsCache } from '@/lib/actions/revalidate-news';
import {
  createAdminCategory,
  updateAdminCategory,
  type AdminCategory,
} from '@/lib/api/admin';
import { slugify } from '@/lib/utils/slugify';

interface CategoryEditDialogProps {
  category?: AdminCategory;
  onClose: () => void;
  onSaved: () => void;
}

export function CategoryEditDialog({
  category,
  onClose,
  onSaved,
}: CategoryEditDialogProps) {
  const isCreate = !category;
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (isCreate && !slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const order = Number.parseInt(sortOrder, 10);
    if (Number.isNaN(order)) {
      toast.error('Thứ tự phải là số');
      return;
    }

    const trimmedName = name.trim();
    const trimmedSlug = slugify(slug.trim());
    if (!trimmedSlug) {
      toast.error('Slug không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      if (isCreate) {
        await createAdminCategory({
          name: trimmedName,
          slug: trimmedSlug,
          description: description.trim() || undefined,
          sortOrder: order,
        });
      } else {
        await updateAdminCategory(category.id, {
          name: trimmedName,
          description: description.trim() || undefined,
          sortOrder: order,
        });
      }
      toast.success(isCreate ? 'Đã tạo danh mục' : 'Đã cập nhật danh mục');
      await revalidateNewsCache();
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isCreate
            ? 'Không thể tạo danh mục'
            : 'Không thể cập nhật danh mục',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="admin-editor-backdrop"
        aria-label="Đóng"
        onClick={onClose}
      />
      <aside className="admin-editor-panel d-flex flex-column" role="dialog" aria-modal>
        <div className="border-bottom p-3 d-flex align-items-center justify-content-between">
          <h2 className="h6 fw-semibold mb-0">
            {isCreate ? 'Tạo danh mục' : 'Chỉnh sửa danh mục'}
          </h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            <i className="bx bx-x" aria-hidden />
          </button>
        </div>

        <form
          className="admin-editor-panel__body flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="category-name" className="form-label small fw-medium">
              Tên danh mục
            </label>
            <input
              id="category-name"
              className="form-control"
              value={name}
              placeholder="Nhập tên danh mục..."
              onChange={(event) => handleNameChange(event.target.value)}
              required
              minLength={2}
            />
          </div>

          {isCreate ? (
            <div>
              <label htmlFor="category-slug" className="form-label small fw-medium">
                Slug
              </label>
              <input
                id="category-slug"
                className="form-control"
                value={slug}
                placeholder="vd: toan-canh-thi-truong"
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                required
                minLength={2}
              />
            </div>
          ) : (
            <p className="small text-secondary mb-0">
              Slug: <code>{category.slug}</code> (không thể thay đổi)
            </p>
          )}

          <div>
            <label htmlFor="category-desc" className="form-label small fw-medium">
              Mô tả
            </label>
            <textarea
              id="category-desc"
              className="form-control"
              rows={3}
              value={description}
              placeholder="Mô tả ngắn về danh mục (tuỳ chọn)..."
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category-order" className="form-label small fw-medium">
              Thứ tự hiển thị
            </label>
            <input
              id="category-order"
              type="number"
              className="form-control"
              value={sortOrder}
              placeholder="0"
              onChange={(event) => setSortOrder(event.target.value)}
              required
            />
          </div>

          <div className="mt-auto d-flex gap-2 pt-2">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : isCreate ? 'Tạo danh mục' : 'Lưu thay đổi'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
