import { SmartLink } from '@/components/shared/SmartLink';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { getCategoryBadgeColor } from '@/constants/news/categories';
import { ASSETS } from '@/constants/layout/assets';
import { formatArticleDateSlash } from '@/lib/utils/article-date';
import { getArticleHref } from '@/lib/news/article-url';
import type { NewsArticle } from '@/lib/api/news';

interface ArticleRecommendedCardProps {
  article: NewsArticle;
}

export function ArticleRecommendedCard({ article }: ArticleRecommendedCardProps) {
  return (
    <div className="new-item h-100 w-100">
      <div className="card h-100 d-flex flex-column">
        <SmartLink
          href={getArticleHref(article.category.slug, article.slug)}
          className="card-img-wrap position-relative d-block flex-shrink-0"
        >
          <ImageWithSkeleton
            layout="fill"
            src={article.coverImage ?? ASSETS.noImage}
            alt={article.title}
            sizes="(max-width: 640px) 50vw, 25vw"
            imageClassName="object-cover"
          />
          <span
            className="badge-category text-white limit_1line"
            style={{ backgroundColor: getCategoryBadgeColor(article.category.slug) }}
          >
            {article.category.name}
          </span>
        </SmartLink>
        <div className="card-body p-2 d-flex flex-column gap-2">
          <SmartLink
            href={getArticleHref(article.category.slug, article.slug)}
            className="card-title limit_3line mb-0 text-dark"
          >
            {article.title}
          </SmartLink>
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
