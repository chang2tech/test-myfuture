import { SmartLink } from '@/components/shared/SmartLink';
import { NEWS_CATEGORY_TABS } from '@/constants/news/categories';
import { getCategoryRouteHref } from '@/constants/news/category-routes';

interface CategoryNewsTabsProps {
  activeSlug: string;
}

export function CategoryNewsTabs({ activeSlug }: CategoryNewsTabsProps) {
  return (
    <div className="bg-white rounded-3 shadow-sm d-flex flex-wrap gap-1 mb-4">
      {NEWS_CATEGORY_TABS.map((tab) => {
        const isActive = activeSlug === tab.slug;
        const label = tab.slug === 'toan-canh' ? 'Tất cả' : tab.name;

        return (
          <SmartLink
            key={tab.slug}
            href={getCategoryRouteHref(tab.slug)}
            className={`tab-link nav-link d-flex align-items-center gap-2 px-2 py-3 rounded-2 text-secondary small${
              isActive ? ' active' : ''
            }`}
          >
            <i className={`bx ${tab.icon}`} />
            {label}
          </SmartLink>
        );
      })}
    </div>
  );
}
