import { SmartLink } from '@/components/shared/SmartLink';

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <div className="fh-breadcrumb mb-3">
      <SmartLink href="/ban-tin">
        <i className="fa fa-newspaper-o" /> Bản tin
      </SmartLink>
      <span className="sep"> / </span>
      <span className="current">{categoryName}</span>
    </div>
  );
}
