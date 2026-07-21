import Link from 'next/link';
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
      <Link href="/ban-tin">
        <i className="fa fa-newspaper-o" /> Bản tin
      </Link>
      <span className="sep">/</span>
      <Link href={getCategoryRouteHref(categorySlug)}>{categoryName}</Link>
      <span className="sep">/</span>
      <span className="current">Bài viết</span>
    </div>
  );
}
