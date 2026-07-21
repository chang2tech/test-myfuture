import Image from 'next/image';
import Link from 'next/link';
import { ASSETS } from '@/constants/layout/assets';
import type { NewsArticle } from '@/lib/api/news';

interface FeaturedNewsSectionProps {
  featured: NewsArticle | null;
  sideArticles: NewsArticle[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export function FeaturedNewsSection({
  featured,
  sideArticles,
}: FeaturedNewsSectionProps) {
  return (
    <div className="row mb-4">
      <div className="col-12 col-md-6 col-lg-7">
        {featured && (
          <div className="box_featured position-relative rounded-3 overflow-hidden image-scale h-100">
            <div className="featured-img-wrap">
              <span className="featured-badge-red">NỔI BẬT</span>
              <Link href={`/ban-tin/${featured.slug}`}>
                <Image
                  src={featured.coverImage ?? ASSETS.noImage}
                  alt={featured.title}
                  width={800}
                  height={360}
                  className="w-100"
                  style={{ height: 360, objectFit: 'cover' }}
                />
              </Link>
            </div>
            <div className="content_featured position-absolute bottom-0 left-0 w-100 d-flex flex-column justify-content-end p-3 text-white zindex-2">
              <h3
                className="font-weight-bold mb-2 text-reset"
                style={{ fontSize: 18, lineHeight: 1.5 }}
              >
                <Link
                  href={`/ban-tin/${featured.slug}`}
                  className="text-reset text-decoration-none"
                >
                  {featured.title}
                </Link>
              </h3>
              {featured.excerpt && (
                <p
                  className="text-reset mb-3 text-truncate-2"
                  style={{ fontSize: 13 }}
                >
                  {featured.excerpt}
                </p>
              )}
              <div className="d-flex justify-content-between align-items-center meta-text w-100">
                <div>
                  <span className="me-3">
                    <i className="fa fa-clock-o" /> {formatDate(featured.publishedAt)}
                  </span>
                  <span>
                    <i className="fa fa-eye" /> {featured.viewCount} lượt xem
                  </span>
                </div>
                <span
                  className="dropdown-toggle hide-arrow"
                  style={{ cursor: 'pointer', color: 'var(--fh-text)' }}
                >
                  <i className="fa fa-share-alt" /> Chia sẻ
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="col-12 col-md-6 col-lg-5 mt-3 mt-md-0">
        <div className="d-flex flex-column h-100 justify-content-between">
          {sideArticles.map((article, index) => (
            <div
              key={article.id}
              className={`d-flex image-scale${index < sideArticles.length - 1 ? ' mb-3 border-bottom pb-3' : ' mb-3'}`}
            >
              <Link
                href={`/ban-tin/${article.slug}`}
                className="d-block side-news-img me-3 overflow-hidden rounded-3"
              >
                <Image
                  src={article.coverImage ?? ASSETS.noImage}
                  alt={article.title}
                  width={110}
                  height={80}
                  className="w-100"
                  style={{ width: 110, height: 80, objectFit: 'cover' }}
                />
              </Link>
              <div>
                <h4 className="fh-title line-clamp-3">
                  <Link
                    href={`/ban-tin/${article.slug}`}
                    className="text-dark text-decoration-none"
                  >
                    {article.title}
                  </Link>
                </h4>
                <div className="meta-text mt-2">
                  <i className="fa fa-clock-o" /> {formatDate(article.publishedAt)}{' '}
                  &nbsp; <i className="fa fa-eye" /> {article.viewCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
