import Image from 'next/image';
import Link from 'next/link';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import {
  TOPIC_FALLBACK_IMAGE,
  TOPIC_IMAGES,
} from '@/constants/news/topic-images';
import { getCategoryRouteHref } from '@/constants/news/category-routes';
import type { NewsCategory } from '@/lib/api/news';

interface TopicNewsSectionProps {
  categories: NewsCategory[];
}

const TOPIC_ITEM_WIDTH = 310.417;

export function TopicNewsSection({ categories }: TopicNewsSectionProps) {
  const topics = categories.filter((c) => c.slug !== 'toan-canh');

  return (
    <div className="box_topic_news">
      <h2 className="section-heading">Tin tức theo chủ đề</h2>
      <OwlCarouselRow>
        {topics.map((category) => (
          <OwlCarouselItem key={category.id} width={TOPIC_ITEM_WIDTH}>
            <Link
              href={getCategoryRouteHref(category.slug)}
              className="topic-news-card"
            >
              <Image
                src={TOPIC_IMAGES[category.slug] ?? TOPIC_FALLBACK_IMAGE}
                alt={category.name}
                width={600}
                height={350}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
              <div className="topic-overlay">
                <div className="topic-title">{category.name}</div>
                <div className="topic-count">
                  {category._count?.articles ?? 0} bài viết
                </div>
              </div>
            </Link>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
    </div>
  );
}
