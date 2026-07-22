import { SmartLink } from '@/components/shared/SmartLink';
import { getCategoryRouteHref } from '@/constants/news/category-routes';

interface ArticleBreadcrumbProps {
  categoryName: string;
  categorySlug: string;
}

export function ArticleBreadcrumb({
  categoryName,
  categorySlug,
}: ArticleBreadcrumbProps) {
  return (
    <div className="fh-breadcrumb mb-3">
      <SmartLink href="/ban-tin">
        <i className="fa fa-newspaper-o" /> Bản tin
      </SmartLink>
      <span className="sep">/</span>
      <SmartLink href={getCategoryRouteHref(categorySlug)}>{categoryName}</SmartLink>
      <span className="sep">/</span>
      <span className="current">Bài viết</span>
    </div>
  );
}
