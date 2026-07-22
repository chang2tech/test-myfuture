import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import type { MarketStats } from '@/lib/api/news';

interface NewsStatsCardsProps {
  stats: MarketStats;
}

export function NewsStatsCards({ stats }: NewsStatsCardsProps) {
  const cards = [
    {
      label: 'Bài viết',
      value: stats.articles.total,
      delta: `+${stats.articles.newCount} bài viết mới`,
      icon: 'bxs-news',
      bg: 'rgba(239,68,68,.12)',
      color: '#ef4444',
      badgeClass: 'text-danger',
    },
    {
      label: 'Chủ đề',
      value: stats.topics.total,
      delta: `+${stats.topics.newCount} chủ đề mới`,
      icon: 'bxs-bookmark',
      bg: 'rgba(6,182,212,.12)',
      color: '#06b6d4',
      badgeStyle: { color: '#06b6d4' },
    },
    {
      label: 'Dự án',
      value: stats.projects.total,
      delta: `+${stats.projects.newCount} dự án mới`,
      icon: 'bxs-briefcase',
      bg: 'rgba(16,185,129,.12)',
      color: '#10b981',
      badgeStyle: { color: '#10b981' },
      valueStyle: { fontSize: 15 },
    },
    {
      label: '24/7',
      value: 'Cập nhật liên tục',
      delta: 'Nguồn tin uy tín',
      icon: 'bx-time-five',
      bg: '#f3e5f5',
      color: '#7b1fa2',
      badgeStyle: { color: '#7b1fa2' },
      valueStyle: { fontSize: 15 },
    },
  ];

  return (
    <OwlCarouselRow
      className="news-stats-carousel"
      showNav
      xsSlide={1.5}
      mdSlide={3}
      lgSlide={4}
      loop={false}
    >
      {cards.map((card) => (
        <OwlCarouselItem key={card.label}>
          <div className="bg-white rounded-3 p-3 d-flex align-items-center gap-3 shadow-sm card-hover h-100">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 p-3 fs-4"
              style={{ background: card.bg, color: card.color }}
            >
              <i className={`bx ${card.icon}`} />
            </div>
            <div className="min-w-0">
              <div className="fw-bold lh-sm" style={card.valueStyle}>
                {card.value}
              </div>
              <div className="text-secondary small">{card.label}</div>
              <span
                className={`badge fw-semibold ${card.badgeClass ?? ''}`}
                style={card.badgeStyle}
              >
                {card.delta}
              </span>
            </div>
          </div>
        </OwlCarouselItem>
      ))}
    </OwlCarouselRow>
  );
}
