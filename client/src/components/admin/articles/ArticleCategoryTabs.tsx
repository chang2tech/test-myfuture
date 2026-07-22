'use client';

import { useEffect, useState } from 'react';
import type { AdminCategory } from '@/lib/api/admin';
import { getAdminCategories } from '@/lib/api/admin';
import { filterAdminCategories } from '@/lib/admin/filter-categories';

interface ArticleCategoryTabsProps {
  activeCategoryId: string;
  onChange: (categoryId: string) => void;
}

export function ArticleCategoryTabs({
  activeCategoryId,
  onChange,
}: ArticleCategoryTabsProps) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminCategories()
      .then((items) => {
        if (active) setCategories(filterAdminCategories(items));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="admin-category-tabs admin-category-tabs--loading">Đang tải danh mục...</div>;
  }

  return (
    <div className="admin-category-tabs" role="tablist" aria-label="Lọc theo danh mục">
      <button
        type="button"
        role="tab"
        className={`admin-category-tabs__item${activeCategoryId === '' ? ' is-active' : ''}`}
        aria-selected={activeCategoryId === ''}
        onClick={() => onChange('')}
      >
        Tất cả
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          className={`admin-category-tabs__item${
            activeCategoryId === category.id ? ' is-active' : ''
          }`}
          aria-selected={activeCategoryId === category.id}
          onClick={() => onChange(category.id)}
        >
          {category.name}
          {category._count?.articles !== undefined && (
            <span className="admin-category-tabs__count">{category._count.articles}</span>
          )}
        </button>
      ))}
    </div>
  );
}
