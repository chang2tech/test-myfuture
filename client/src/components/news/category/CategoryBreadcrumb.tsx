import Link from 'next/link';

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <div className="fh-breadcrumb mb-3">
      <Link href="/ban-tin">
        <i className="fa fa-newspaper-o" /> Bản tin
      </Link>
      <span className="sep"> / </span>
      <span className="current">{categoryName}</span>
    </div>
  );
}
