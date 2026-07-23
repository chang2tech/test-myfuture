import { SmartLink } from '@/components/shared/SmartLink';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
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

export function TopicNewsSection({ categories }: TopicNewsSectionProps) {
  const topics = categories;

  return (
    <div className="mb-4 box_topic_news">
      <h2 className="section-heading">Tin tức theo chủ đề</h2>
      <OwlCarouselRow showNav xsSlide={1.5} smSlide={2} mdSlide={3} lgSlide={4}>
        {topics.map((category) => (
          <OwlCarouselItem key={category.id}>
            <SmartLink
              href={getCategoryRouteHref(category.slug)}
              className="topic-news-card position-relative d-block overflow-hidden"
            >
              <ImageWithSkeleton
                layout="fill"
                src={TOPIC_IMAGES[category.slug] ?? TOPIC_FALLBACK_IMAGE}
                alt={category.name}
                sizes="(max-width: 576px) 66vw, (max-width: 768px) 50vw, (max-width: 1199px) 33vw, 25vw"
              />
              <div className="topic-overlay">
                <div className="topic-title">{category.name}</div>
                <div className="topic-count">
                  {category._count?.articles ?? 0} bài viết
                </div>
              </div>
            </SmartLink>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
    </div>
  );
}
