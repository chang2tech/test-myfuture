import Link from 'next/link';
import type { ArticleNavItem } from '@/lib/api/news';

interface ArticleNavigationProps {
  prev: ArticleNavItem | null;
  next: ArticleNavItem | null;
}

export function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="article-navigation mt-4 rounded-3 p-3 shadow-sm mt-4">
      <div className="row">
        <div className="col-6">
          {prev && (
            <div className="nav-item-prev">
              <Link
                href={`/ban-tin/${prev.slug}`}
                className="nav-direction"
              >
                Bài trước
              </Link>
              <Link
                href={`/ban-tin/${prev.slug}`}
                className="nav-content mt-2"
              >
                <div className="nav-img">
                  <i className="bx bx-left-arrow-alt" />
                </div>
                <div className="nav-title first-uppercase">{prev.title}</div>
              </Link>
            </div>
          )}
        </div>
        <div className="col-6">
          {next && (
            <div className="nav-item-next text-end">
              <Link
                href={`/ban-tin/${next.slug}`}
                className="nav-direction"
              >
                Bài tiếp theo{' '}
              </Link>
              <Link
                href={`/ban-tin/${next.slug}`}
                className="nav-content mt-2 flex-row-reverse"
              >
                <div className="nav-img">
                  <i className="bx bx-right-arrow-alt" />
                </div>
                <div className="nav-title first-uppercase">{next.title}</div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
