import { SmartLink } from '@/components/shared/SmartLink';
import type { ArticleNavItem } from '@/lib/api/news';
import { getArticleHref } from '@/lib/news/article-url';

interface ArticleNavigationProps {
  categorySlug: string;
  prev: ArticleNavItem | null;
  next: ArticleNavItem | null;
}

export function ArticleNavigation({
  categorySlug,
  prev,
  next,
}: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="article-navigation mt-4 rounded-3 p-3 shadow-sm mt-4">
      <div className="row">
        <div className="col-6">
          {prev && (
            <div className="nav-item-prev">
              <SmartLink
                href={getArticleHref(categorySlug, prev.slug)}
                className="nav-direction"
              >
                Bài trước
              </SmartLink>
              <SmartLink
                href={getArticleHref(categorySlug, prev.slug)}
                className="nav-content mt-2"
              >
                <div className="nav-img">
                  <i className="bx bx-left-arrow-alt" />
                </div>
                <div className="nav-title first-uppercase">{prev.title}</div>
              </SmartLink>
            </div>
          )}
        </div>
        <div className="col-6">
          {next && (
            <div className="nav-item-next text-end">
              <SmartLink
                href={getArticleHref(categorySlug, next.slug)}
                className="nav-direction"
              >
                Bài tiếp theo{' '}
              </SmartLink>
              <SmartLink
                href={getArticleHref(categorySlug, next.slug)}
                className="nav-content mt-2 flex-row-reverse"
              >
                <div className="nav-img">
                  <i className="bx bx-right-arrow-alt" />
                </div>
                <div className="nav-title first-uppercase">{next.title}</div>
              </SmartLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
