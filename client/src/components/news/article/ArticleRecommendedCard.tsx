import Link from 'next/link';
import { formatArticleDateSlash } from '@/lib/utils/article-date';
import type { NewsArticle } from '@/lib/api/news';

interface ArticleRecommendedCardProps {
  article: NewsArticle;
}

export function ArticleRecommendedCard({ article }: ArticleRecommendedCardProps) {
  return (
    <div className="new-item">
      <div className="card h-100">
        <Link href={`/ban-tin/${article.slug}`} className="card-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage ?? ''}
            alt={article.title}
            loading="lazy"
          />
          <span className="badge-category text-white limit_1line">
            {article.category.name}
          </span>
        </Link>
        <div className="card-body p-2 d-flex flex-column gap-2">
          <Link
            href={`/ban-tin/${article.slug}`}
            className="card-title limit_3line mb-0 text-dark"
          >
            {article.title}
          </Link>
          <div className="meta-info d-flex align-items-center gap-2 mt-auto">
            <span className="d-flex align-items-center gap-1">
              <i className="fa fa-clock-o" />{' '}
              {formatArticleDateSlash(article.publishedAt)}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="fa fa-eye" /> {article.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
