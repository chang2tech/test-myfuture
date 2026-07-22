'use client';

import { useEffect, type RefObject } from 'react';
import { SearchHighlight } from '@/components/search/SearchHighlight';
import type {
  SearchArticleItem,
  SearchProjectItem,
} from '@/lib/api/search';
import { formatArticleDateSlash } from '@/lib/utils/article-date';
import { getArticleHref } from '@/lib/news/article-url';

type SearchPane = 'articles' | 'projects';

interface SearchSuggestPanelProps {
  open: boolean;
  query: string;
  loading: boolean;
  variant: 'public' | 'admin';
  activePane: SearchPane;
  popular: string[];
  articles: {
    total: number;
    items: SearchArticleItem[];
  };
  projects: {
    total: number;
    items: SearchProjectItem[];
  };
  onPaneChange: (pane: SearchPane) => void;
  onPopularSelect: (term: string) => void;
  onArticleSelect: (article: SearchArticleItem) => void;
  onProjectSelect: (project: SearchProjectItem) => void;
}

const STATUS_LABELS: Record<NonNullable<SearchArticleItem['status']>, string> = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Xuất bản',
  ARCHIVED: 'Lưu trữ',
};

export function SearchSuggestPanel({
  open,
  query,
  loading,
  variant,
  activePane,
  popular,
  articles,
  projects,
  onPaneChange,
  onPopularSelect,
  onArticleSelect,
  onProjectSelect,
}: SearchSuggestPanelProps) {
  const trimmedQuery = query.trim();
  const showTabs = trimmedQuery.length > 0;
  const showPopular = !showTabs;

  if (!open) return null;

  return (
    <div className="search_suggest" role="listbox" aria-label="Gợi ý tìm kiếm">
      {showPopular && (
        <div className="ss-recent">
          <div className="ss-recent-head">
            <span>
              <i className="bx bx-trending-up" aria-hidden />
              Tìm phổ biến
            </span>
          </div>
          <div className="ss-trending-list">
            {popular.map((term) => (
              <button
                key={term}
                type="button"
                className="ss-trending-chip"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onPopularSelect(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {showTabs && (
        <>
          <div className="ss-tabs">
            <button
              type="button"
              className={`ss-tab${activePane === 'articles' ? ' active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPaneChange('articles')}
            >
              Bài viết{' '}
              <span className="ss-count">{articles.total}</span>
            </button>
            {variant === 'public' && (
              <button
                type="button"
                className={`ss-tab${activePane === 'projects' ? ' active' : ''}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onPaneChange('projects')}
              >
                Dự án <span className="ss-count">{projects.total}</span>
              </button>
            )}
          </div>

          {trimmedQuery && (
            <ul className="ss-filter-chips-row">
              <li className="ss-chip ss-chip--text">{trimmedQuery}</li>
            </ul>
          )}

          <div className="ss-body">
            {loading && <div className="ss-empty">Đang tìm kiếm...</div>}

            {!loading && activePane === 'articles' && (
              <ul
                className={`ss-pane ss-pane--info active overflow-y-auto`}
              >
                {articles.items.length === 0 && (
                  <li className="ss-empty">Không tìm thấy bài viết</li>
                )}
                {articles.items.map((article) => (
                  <li key={article.id}>
                    <button
                      type="button"
                      className="ss-info-item w-100 border-0 bg-transparent text-start"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onArticleSelect(article)}
                    >
                      <div className="ss-info-body">
                        <div className="ss-info-title">
                          <SearchHighlight
                            text={article.title}
                            query={trimmedQuery}
                          />
                        </div>
                        <div className="ss-info-sub">
                          {article.category.name}
                          {article.snippet
                            ? ` · ${article.snippet}`
                            : article.excerpt
                              ? ` · ${article.excerpt}`
                              : ''}
                        </div>
                        {variant === 'admin' && article.status && (
                          <div className="ss-info-sub mt-1">
                            {STATUS_LABELS[article.status]} ·{' '}
                            {formatArticleDateSlash(article.publishedAt)}
                          </div>
                        )}
                      </div>
                      <i className="bx bx-up-arrow-alt ss-info-arrow" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!loading && activePane === 'projects' && variant === 'public' && (
              <ul className="ss-pane ss-pane--info active overflow-y-auto">
                {projects.items.length === 0 && (
                  <li className="ss-empty">Không tìm thấy dự án</li>
                )}
                {projects.items.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      className="ss-info-item w-100 border-0 bg-transparent text-start"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onProjectSelect(project)}
                    >
                      <div className="ss-info-body">
                        <div className="ss-info-title">
                          <SearchHighlight
                            text={project.name}
                            query={trimmedQuery}
                          />
                        </div>
                        <div className="ss-info-sub">{project.address}</div>
                      </div>
                      <i className="bx bx-up-arrow-alt ss-info-arrow" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function useSearchSuggestDismiss(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [containerRef, onClose, open]);
}

export function getPublicArticlePath(article: SearchArticleItem): string {
  return getArticleHref(article.category.slug, article.slug);
}

export function getPublicProjectPath(project: SearchProjectItem): string {
  return `/project/${project.slug}.html`;
}
