'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAdminStats, getAdminCategories } from '@/lib/api/admin';

export function AdminDashboardContent() {
  const [stats, setStats] = useState<{
    total: number;
    published: number;
    draft: number;
    totalViews: number;
  } | null>(null);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [articleStats, categories] = await Promise.all([
          getAdminStats(),
          getAdminCategories(),
        ]);
        if (!active) return;
        setStats(articleStats);
        setCategoryCount(categories.length);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const publishedRate =
    stats && stats.total > 0
      ? Math.round((stats.published / stats.total) * 100)
      : 0;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Dashboard</h2>
          <p className="admin-page-header__desc">
            Tổng quan nội dung và hiệu suất bản tin myFuture
          </p>
        </div>
        <Link href="/admin/articles?create=1" className="admin-btn admin-btn--primary">
          <i className="bx bx-plus" aria-hidden />
          Tạo bài viết
        </Link>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-dashboard-main">
          <div className="admin-stat-grid">
            <StatCard
              icon="bx-news"
              label="Tổng bài viết"
              value={loading ? '—' : String(stats?.total ?? 0)}
            />
            <StatCard
              icon="bx-check-circle"
              label="Đã xuất bản"
              value={loading ? '—' : String(stats?.published ?? 0)}
              hint={loading ? undefined : `${publishedRate}% tổng bài`}
            />
            <StatCard
              icon="bx-edit"
              label="Bản nháp"
              value={loading ? '—' : String(stats?.draft ?? 0)}
            />
            <StatCard
              icon="bx-show"
              label="Lượt xem"
              value={loading ? '—' : formatViews(stats?.totalViews ?? 0)}
            />
          </div>

          <div className="admin-card admin-dashboard-overview">
            <div className="admin-card__body">
              <h3 className="admin-dashboard-card__title">Tình trạng nội dung</h3>
              <p className="admin-dashboard-card__desc">
                Quản lý {loading ? '...' : stats?.total ?? 0} bài viết trên{' '}
                {loading ? '...' : categoryCount} danh mục. Sắp xếp thứ tự và
                theo dõi lượt xem trực tiếp tại trang quản lý bài viết.
              </p>
              <div className="admin-dashboard-progress">
                <div className="admin-dashboard-progress__bar">
                  <span
                    className="admin-dashboard-progress__fill"
                    style={{ width: `${publishedRate}%` }}
                  />
                </div>
                <span className="admin-dashboard-progress__label">
                  {loading ? '—' : `${stats?.published ?? 0} bài đã xuất bản`}
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="admin-dashboard-side">
          <div className="admin-card">
            <div className="admin-card__body">
              <h3 className="admin-dashboard-card__title">Truy cập nhanh</h3>
              <nav className="admin-quick-links">
                <QuickLink
                  href="/admin/articles?create=1"
                  icon="bx-plus-circle"
                  label="Tạo bài viết mới"
                  desc="Mở form tạo bài viết"
                />
                <QuickLink
                  href="/admin/articles"
                  icon="bx-news"
                  label="Quản lý bài viết"
                  desc="Xem, sửa, xuất bản bài viết"
                />
                <QuickLink
                  href="/admin/categories?create=1"
                  icon="bx-folder-plus"
                  label="Tạo danh mục"
                  desc="Thêm danh mục tin tức mới"
                />
                <QuickLink
                  href="/admin/categories"
                  icon="bx-category"
                  label="Quản lý danh mục"
                  desc="Chỉnh sửa danh mục tin tức"
                />
                <QuickLink
                  href="/ban-tin"
                  icon="bx-link-external"
                  label="Xem trang public"
                  desc="Mở bản tin trên website"
                  external
                />
              </nav>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__body">
              <h3 className="admin-dashboard-card__title">Gợi ý tiếp theo</h3>
              <ul className="admin-dashboard-tips">
                <li>Kiểm tra bài nháp trước khi xuất bản</li>
                <li>Đặt thứ tự hiển thị số nhỏ hơn = ưu tiên cao hơn</li>
                <li>Slug bài viết nằm sau slug danh mục trên URL public</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function formatViews(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-card__icon" aria-hidden>
        <i className={`bx ${icon}`} />
      </span>
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__value">{value}</p>
      {hint && <p className="admin-stat-card__hint">{hint}</p>}
    </article>
  );
}

function QuickLink({
  href,
  icon,
  label,
  desc,
  external,
}: {
  href: string;
  icon: string;
  label: string;
  desc: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="admin-quick-link"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="admin-quick-link__icon" aria-hidden>
        <i className={`bx ${icon}`} />
      </span>
      <span className="admin-quick-link__text">
        <span className="admin-quick-link__label">{label}</span>
        <span className="admin-quick-link__desc">{desc}</span>
      </span>
      <i className="bx bx-chevron-right admin-quick-link__arrow" aria-hidden />
    </Link>
  );
}
