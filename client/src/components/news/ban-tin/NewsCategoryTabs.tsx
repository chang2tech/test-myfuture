import Link from 'next/link';
import { NEWS_CATEGORY_TABS } from '@/constants/news/categories';
import { getCategoryRouteHref } from '@/constants/news/category-routes';

interface NewsCategoryTabsProps {
  activeCategory: string;
}

export function NewsCategoryTabs({ activeCategory }: NewsCategoryTabsProps) {
  return (
    <div className="bg-white rounded-3 shadow-sm d-flex flex-wrap gap-1 mb-4">
      {NEWS_CATEGORY_TABS.map((tab) => {
        const isActive = activeCategory === tab.slug;

        return (
          <Link
            key={tab.slug}
            href={getCategoryRouteHref(tab.slug)}
            className={`tab-link nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-2 text-secondary small${
              isActive ? ' active' : ''
            }`}
          >
            <i className={`bx ${tab.icon}`} />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
