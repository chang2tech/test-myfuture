import { SmartLink } from '@/components/shared/SmartLink';
import { VideoPodcastCard } from '@/components/news/ban-tin/VideoPodcastCard';
import { ProUpgradeOverlay } from '@/components/news/shared/ProUpgradeOverlay';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import { VIDEO_ITEMS } from '@/constants/news/videos';

export function VideoPodcastSection() {
  return (
    <section className="block video_podcast position-relative overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="section-heading mb-0">Video &amp; Podcast nổi bật</h2>
        <SmartLink href="#" className="view-all w-px-150 justify-content-end">
          Xem tất cả <i className="fa fa-arrow-right" />
        </SmartLink>
      </div>

      <OwlCarouselRow
        className=""
        showNav
        xsSlide={1.5}
        smSlide={3}
        lgSlide={5}
        loop
      >
        {VIDEO_ITEMS.map((video) => (
          <OwlCarouselItem key={video.id}>
            <VideoPodcastCard video={video} />
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>

      <ProUpgradeOverlay />
    </section>
  );
}
