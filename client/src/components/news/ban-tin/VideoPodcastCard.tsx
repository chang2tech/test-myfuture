import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import type { VideoItem } from '@/constants/news/videos';

interface VideoPodcastCardProps {
  video: VideoItem;
}

export function VideoPodcastCard({ video }: VideoPodcastCardProps) {
  return (
    <div className="video-card">
      <div className="video-thumb">
        <ImageWithSkeleton
          layout="fill"
          src={video.thumbnail}
          alt={video.title}
          sizes="(max-width: 768px) 50vw, 220px"
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
    </div>
  );
}
