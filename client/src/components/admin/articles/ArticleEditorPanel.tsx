'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArticleHtmlEditor } from '@/components/admin/articles/ArticleHtmlEditor';
import { ArticlePreviewSidebar } from '@/components/admin/articles/ArticlePreviewSidebar';
import { ArticleThumbnailField } from '@/components/admin/articles/ArticleThumbnailField';
import type {
  AdminArticle,
  AdminCategory,
  ArticleFormData,
} from '@/lib/api/admin';
import {
  createAdminArticle,
  getAdminCategories,
  updateAdminArticle,
} from '@/lib/api/admin';
import { getArticleHref } from '@/lib/news/article-url';
import { filterAdminCategories } from '@/lib/admin/filter-categories';
import { revalidateNewsCache } from '@/lib/actions/revalidate-news';
import { slugify } from '@/lib/utils/slugify';

interface ArticleEditorPanelProps {
  article: AdminArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM: ArticleFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '<p></p>',
  coverImage: '',
  categoryId: '',
  status: 'DRAFT',
  isFeatured: false,
  isHot: false,
  keywords: [],
  publishedAt: new Date().toISOString(),
  categorySortOrder: 0,
};

function buildFormState(
  article: AdminArticle | null,
  defaultCategoryId: string,
): ArticleFormData {
  if (!article) {
    return {
      ...EMPTY_FORM,
      categoryId: defaultCategoryId,
    };
  }

  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? '',
    content: article.content,
    coverImage: article.coverImage ?? '',
    categoryId: article.categoryId,
    status: article.status,
    isFeatured: article.isFeatured,
    isHot: article.isHot,
    keywords: article.keywords,
    publishedAt: article.publishedAt,
    categorySortOrder: article.categorySortOrder,
  };
}

export function ArticleEditorPanel({
  article,
  isOpen,
  onClose,
  onSaved,
}: ArticleEditorPanelProps) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ArticleFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    getAdminCategories()
      .then((items) => {
        const editableCategories = filterAdminCategories(items);
        setCategories(editableCategories);
        setForm(
          buildFormState(article, editableCategories[0]?.id ?? ''),
        );
        setReady(true);
      })
      .catch(() => toast.error('Không tải được danh mục'));
  }, [article]);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === form.categoryId),
    [categories, form.categoryId],
  );

  const publicUrlPreview =
    selectedCategory && form.slug
      ? getArticleHref(selectedCategory.slug, form.slug)
      : null;

  function updateField<K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (article) {
        await updateAdminArticle(article.id, form);
        toast.success('Đã cập nhật bài viết');
      } else {
        await createAdminArticle(form);
        toast.success('Đã tạo bài viết mới');
      }
      await revalidateNewsCache();
      onSaved();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setPreviewOpen(false);
    onClose();
  }

  if (!isOpen || !ready) return null;

  return (
    <>
      <button
        type="button"
        className="admin-editor-backdrop"
        aria-label="Đóng panel"
        onClick={handleClose}
      />
      <ArticlePreviewSidebar
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={form.title}
        excerpt={form.excerpt}
        content={form.content}
        coverImage={form.coverImage}
        categoryName={selectedCategory?.name}
      />
      <aside
        className={`admin-editor-panel bg-white border-start shadow-lg d-flex flex-column${previewOpen ? ' is-preview-open' : ''}`}
      >
        <div className="admin-editor-panel__header">
          <h2 className="h6 mb-0 fw-bold">
            {article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClose}>
            <i className="bx bx-x" aria-hidden />
          </button>
        </div>

        <div className="admin-editor-panel__body flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold">Tiêu đề</label>
            <input
              className="form-control"
              value={form.title}
              placeholder="Nhập tiêu đề bài viết..."
              onChange={(e) => {
                const title = e.target.value;
                updateField('title', title);
                if (!article) updateField('slug', slugify(title));
              }}
            />
          </div>

          <div>
            <label className="form-label small fw-semibold">Slug URL</label>
            <input
              className="form-control"
              value={form.slug}
              placeholder="vd: thi-truong-bat-dong-san-2026"
              onChange={(e) => updateField('slug', slugify(e.target.value))}
            />
            {publicUrlPreview && (
              <p className="small text-secondary mt-2 mb-0">
                URL public: <code>{publicUrlPreview}</code>
              </p>
            )}
          </div>

          <div>
            <label className="form-label small fw-semibold">Mô tả ngắn</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.excerpt}
              placeholder="Mô tả ngắn hiển thị trên danh sách bài viết..."
              onChange={(e) => updateField('excerpt', e.target.value)}
            />
          </div>

          <ArticleThumbnailField
            value={form.coverImage}
            onChange={(url) => updateField('coverImage', url)}
          />

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Danh mục</label>
              <select
                className="form-select"
                value={form.categoryId}
                onChange={(e) => updateField('categoryId', e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Trạng thái</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) =>
                  updateField(
                    'status',
                    e.target.value as ArticleFormData['status'],
                  )
                }
              >
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label small fw-semibold">
              Thứ tự hiển thị (public)
            </label>
            <input
              type="number"
              className="form-control"
              value={form.categorySortOrder}
              placeholder="0"
              onChange={(e) =>
                updateField('categorySortOrder', Number(e.target.value) || 0)
              }
            />
            <p className="small text-secondary mt-1 mb-0">
              Số nhỏ hơn hiển thị trước trong danh mục
            </p>
          </div>

          <div className="d-flex flex-wrap gap-3">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
              />
              <span className="form-check-label small">Nổi bật</span>
            </label>
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.isHot}
                onChange={(e) => updateField('isHot', e.target.checked)}
              />
              <span className="form-check-label small">Hot</span>
            </label>
          </div>

          <div>
            <label className="form-label small fw-semibold">Nội dung bài viết</label>
            <ArticleHtmlEditor
              value={form.content}
              onChange={(html) => updateField('content', html)}
              previewOpen={previewOpen}
              onPreviewToggle={() => setPreviewOpen((open) => !open)}
            />
          </div>
        </div>

        <div className="p-3 border-top d-flex gap-2 justify-content-end">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClose}>
            Hủy
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </aside>
    </>
  );
}
