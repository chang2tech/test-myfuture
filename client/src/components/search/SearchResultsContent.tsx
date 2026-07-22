'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SmartLink } from '@/components/shared/SmartLink';
import {
  getPublicSearch,
  type PublicSearchResponse,
} from '@/lib/api/search';
import { getArticleHref } from '@/lib/news/article-url';
import { formatArticleDateSlash } from '@/lib/utils/article-date';

interface SearchResultsContentProps {
  query: string;
}

export function SearchResultsContent({ query }: SearchResultsContentProps) {
  const trimmedQuery = query.trim();
  const [loading, setLoading] = useState(Boolean(trimmedQuery));
  const [data, setData] = useState<PublicSearchResponse | null>(null);

  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading before fetch
    setLoading(true);

    void getPublicSearch(trimmedQuery, 20)
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedQuery]);

  return (
    <main className="main-content">
      <div className="content-body">
        <h1 className="fs-24 fw-bold text-dark mb-3">
          {trimmedQuery ? `Kết quả tìm kiếm: “${trimmedQuery}”` : 'Tìm kiếm bài viết'}
        </h1>

        {!trimmedQuery && (
          <p className="text-secondary">
            Nhập từ khóa vào ô tìm kiếm ở header để bắt đầu.
          </p>
        )}

        {trimmedQuery && loading && (
          <p className="text-secondary">Đang tìm kiếm...</p>
        )}

        {trimmedQuery && !loading && data && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <h2 className="fs-18 fw-bold mb-3">
                Bài viết ({data.articles.total})
              </h2>
              {data.articles.items.length === 0 ? (
                <p className="text-secondary">Không tìm thấy bài viết phù hợp.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {data.articles.items.map((article) => (
                    <SmartLink
                      key={article.id}
                      href={getArticleHref(article.category.slug, article.slug)}
                      className="card border-0 shadow-sm p-3 text-dark text-decoration-none"
                    >
                      <div className="fw-bold mb-1">{article.title}</div>
                      <div className="small text-secondary mb-1">
                        {article.category.name} ·{' '}
                        {formatArticleDateSlash(article.publishedAt)}
                      </div>
                      {article.snippet && (
                        <div className="small text-secondary">{article.snippet}</div>
                      )}
                    </SmartLink>
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 col-lg-4">
              <h2 className="fs-18 fw-bold mb-3">
                Dự án ({data.projects.total})
              </h2>
              {data.projects.items.length === 0 ? (
                <p className="text-secondary">Không tìm thấy dự án phù hợp.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {data.projects.items.map((project) => (
                    <Link
                      key={project.id}
                      href={`/project/${project.slug}.html`}
                      className="card border-0 shadow-sm p-3 text-dark text-decoration-none"
                    >
                      <div className="fw-bold mb-1">{project.name}</div>
                      <div className="small text-secondary">{project.address}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
