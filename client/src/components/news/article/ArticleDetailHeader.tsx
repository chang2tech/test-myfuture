import { SmartLink } from '@/components/shared/SmartLink';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import {
  formatArticleDateDash,
} from '@/lib/utils/article-date';
import type { NewsArticleDetail } from '@/lib/api/news';

interface ArticleDetailHeaderProps {
  article: NewsArticleDetail;
}

export function ArticleDetailHeader({ article }: ArticleDetailHeaderProps) {
  return (
    <div className="article-header">
      <h1 className="article-title">{article.title}</h1>
      <div className="article-meta">
        <span>
          <i className="fa fa-clock-o" />{' '}
          {formatArticleDateDash(article.publishedAt)}
        </span>
        <span>
          <i className="fa fa-eye" /> {article.viewCount} lượt xem
        </span>
        <span className="article-read-time" id="js-read-time">
          <i className="fa fa-book" /> <span>{article.readTimeMinutes}</span>{' '}
          phút đọc
        </span>
      </div>
      {article.coverImage && (
        <div
          className="article-cover position-relative rounded-3 overflow-hidden mb-3"
          style={{ height: 280 }}
        >
          <ImageWithSkeleton
            layout="fill"
            src={article.coverImage}
            alt={article.title}
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
        </div>
      )}
      {article.keywords.length > 0 && (
        <div className="hashtag d-flex flex-wrap gap-1 align-items-center">
          <span className="text-muted fs-12">Từ khóa tìm kiếm: </span>
          {article.keywords.map((keyword) => (
            <span key={keyword} className="text-dark fs-12">
              #{keyword}
            </span>
          ))}
        </div>
      )}
      {article.source && (
        <p className="article-meta mb-0">
          Nguồn:{' '}
          {article.sourceUrl ? (
            <SmartLink href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              {article.source}
            </SmartLink>
          ) : (
            article.source
          )}
        </p>
      )}
    </div>
  );
}
