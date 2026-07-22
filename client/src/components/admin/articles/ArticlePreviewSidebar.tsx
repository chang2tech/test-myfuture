'use client';

import Image from 'next/image';
import { sanitizeArticleHtml } from '@/lib/utils/sanitize-html';

interface ArticlePreviewSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryName?: string;
}

export function ArticlePreviewSidebar({
  isOpen,
  onClose,
  title,
  excerpt,
  content,
  coverImage,
  categoryName,
}: ArticlePreviewSidebarProps) {
  if (!isOpen) return null;

  const sanitized = sanitizeArticleHtml(content || '<p></p>');

  return (
    <aside
      className="admin-article-preview bg-white border-start shadow-lg d-flex flex-column"
      aria-label="Xem trước bài viết"
    >
      <div className="admin-article-preview__header">
        <div>
          <p className="admin-article-preview__eyebrow mb-1">Xem trước</p>
          <h2 className="h6 mb-0 fw-bold">Bài viết public</h2>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          aria-label="Đóng xem trước"
          onClick={onClose}
        >
          <i className="bx bx-x" aria-hidden />
        </button>
      </div>

      <div className="admin-article-preview__body flex-grow-1 overflow-auto">
        <article className="admin-article-preview__article">
          {categoryName && (
            <span className="admin-article-preview__category">{categoryName}</span>
          )}

          <h1 className="admin-article-preview__title">
            {title.trim() || 'Tiêu đề bài viết'}
          </h1>

          {excerpt.trim() && (
            <p className="admin-article-preview__excerpt">{excerpt}</p>
          )}

          {coverImage && (
            <div className="admin-article-preview__cover">
              <Image
                src={coverImage}
                alt={title || 'Ảnh bìa bài viết'}
                width={640}
                height={360}
                className="admin-article-preview__cover-img"
                unoptimized
              />
            </div>
          )}

          <div
            className="article-content admin-article-preview__content"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        </article>
      </div>
    </aside>
  );
}
