import { SmartLink } from '@/components/shared/SmartLink';
import {
  BAN_TIN_OVERVIEW_TAB,
  NEWS_CATEGORY_TABS,
} from '@/constants/news/categories';
import { getCategoryRouteHref } from '@/constants/news/category-routes';

interface CategoryNewsTabsProps {
  activeSlug: string;
}

export function CategoryNewsTabs({ activeSlug }: CategoryNewsTabsProps) {
  return (
    <div className="bg-white rounded-3 shadow-sm d-flex flex-wrap gap-1 mb-4">
      <SmartLink
        href={BAN_TIN_OVERVIEW_TAB.href}
        className="tab-link nav-link d-flex align-items-center gap-2 px-2 py-3 rounded-2 text-secondary small"
      >
        <i className={`bx ${BAN_TIN_OVERVIEW_TAB.icon}`} />
        {BAN_TIN_OVERVIEW_TAB.name}
      </SmartLink>
      {NEWS_CATEGORY_TABS.map((tab) => {
        const isActive = activeSlug === tab.slug;

        return (
          <SmartLink
            key={tab.slug}
            href={getCategoryRouteHref(tab.slug)}
            className={`tab-link nav-link d-flex align-items-center gap-2 px-2 py-3 rounded-2 text-secondary small${
              isActive ? ' active' : ''
            }`}
          >
            <i className={`bx ${tab.icon}`} />
            {tab.name}
          </SmartLink>
        );
      })}
    </div>
  );
}
