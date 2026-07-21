import Image from 'next/image';
import Link from 'next/link';
import { ASSETS } from '@/constants/layout/assets';
import type { NewsArticle } from '@/lib/api/news';

interface CategoryArticleListItemProps {
  article: NewsArticle;
  index: number;
  isLast: boolean;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CategoryArticleListItem({
  article,
  index,
  isLast,
}: CategoryArticleListItemProps) {
  return (
    <div
      className={`d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mx-3 py-3 scale_img_hover${
        isLast ? '' : ' border-bottom'
      }`}
    >
      <Link href={`/ban-tin/${article.slug}`} className="news-thumb">
        <Image
          src={article.coverImage ?? ASSETS.noImage}
          alt={article.title}
          width={160}
          height={120}
          className="rounded-3 object-fit-cover w-100 h-100"
        />
      </Link>
      <div
        className="bg-secondary rounded-circle text-white text-center flex-shrink-0 d-none d-md-block"
        style={{ width: 24, height: 24, lineHeight: '24px' }}
      >
        {index}
      </div>
      <div className="flex-grow-1 min-w-0">
        <Link
          href={`/ban-tin/${article.slug}`}
          className="text-dark fw-bold active-single fs-5"
        >
          {article.title}
        </Link>
        {article.excerpt && (
          <div className="limit_1line mt-1">{article.excerpt}</div>
        )}
      </div>
      <div className="d-flex flex-row flex-md-column align-items-start align-items-md-end gap-1 flex-shrink-0 news-meta">
        <span>
          <i className="bx bx-time-five" /> {formatDate(article.publishedAt)}
        </span>
        <span>
          <i className="bx bx-show" /> {article.viewCount} lượt xem
        </span>
      </div>
    </div>
  );
}
