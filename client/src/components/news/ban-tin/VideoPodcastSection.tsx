import Image from 'next/image';
import Link from 'next/link';
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
        <Link href="#" className="view-all w-px-150 justify-content-end">
          Xem tất cả <i className="fa fa-arrow-right" />
        </Link>
      </div>
      <OwlCarouselRow showNav xsSlide={1.5} smSlide={3} lgSlide={5}>
        {VIDEO_ITEMS.map((video) => (
          <OwlCarouselItem key={video.title}>
            <Link href={video.href} className="video-card d-block">
              <div className="video-thumb">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={225}
                  className="w-100 h-auto"
                  style={{ objectFit: 'cover' }}
                />
                <div className="play-btn">
                  <i className="bx bx-play" />
                </div>
                <div className="video-duration">{video.duration}</div>
              </div>
              <div className="card-body">
                <div className="card-title">{video.title}</div>
                <div className="meta">
                  <span>{video.channel}</span>
                  <span>
                    <i className="bx bx-show" />
                    {video.views}
                  </span>
                </div>
              </div>
            </Link>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
      <ProUpgradeOverlay />
    </section>
  );
}
