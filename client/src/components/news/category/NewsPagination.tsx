import { SmartLink } from '@/components/shared/SmartLink';
import { getCategoryPageHref } from '@/constants/news/category-routes';

interface NewsPaginationProps {
  routeId: string;
  currentPage: number;
  totalPages: number;
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index,
  );
}

export function NewsPagination({
  routeId,
  currentPage,
  totalPages,
}: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="d-flex justify-content-center">
      <div className="pagination">
        <li className="page-item">
          {prevPage ? (
            <SmartLink
              className="prev page-link"
              href={getCategoryPageHref(routeId, prevPage)}
            >
              ‹
            </SmartLink>
          ) : (
            <span className="prev page-link disabled">‹</span>
          )}
        </li>
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item${page === currentPage ? ' active' : ''}`}
          >
            {page === currentPage ? (
              <span className="current page page-link">{page}</span>
            ) : (
              <SmartLink
                className="page page-link"
                href={getCategoryPageHref(routeId, page)}
              >
                {page}
              </SmartLink>
            )}
          </li>
        ))}
        <li className="page-item">
          {nextPage ? (
            <SmartLink
              className="next page-link"
              href={getCategoryPageHref(routeId, nextPage)}
              title={String(nextPage)}
            >
              ›
            </SmartLink>
          ) : (
            <span className="next page-link disabled">›</span>
          )}
        </li>
      </div>
    </div>
  );
}
