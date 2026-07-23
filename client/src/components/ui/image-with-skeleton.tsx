'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ImageSkeleton } from '@/components/ui/image-skeleton';
import { cn } from '@/lib/core/cn';

export type ImageAspectRatio =
  | '16/9'
  | '4/3'
  | '3/2'
  | '1/1'
  | '2/1'
  | '4/5'
  | '12/7'
  | '20/9';

const ASPECT_CLASS: Record<ImageAspectRatio, string> = {
  '16/9': 'image-with-skeleton--aspect-16-9',
  '4/3': 'image-with-skeleton--aspect-4-3',
  '3/2': 'image-with-skeleton--aspect-3-2',
  '1/1': 'image-with-skeleton--aspect-1-1',
  '2/1': 'image-with-skeleton--aspect-2-1',
  '4/5': 'image-with-skeleton--aspect-4-5',
  '12/7': 'image-with-skeleton--aspect-12-7',
  '20/9': 'image-with-skeleton--aspect-20-9',
};

type ImageWithSkeletonBaseProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  rounded?: string;
  sizes?: string;
  priority?: boolean;
};

export type ImageWithSkeletonProps = ImageWithSkeletonBaseProps &
  (
    | { layout: 'fill' }
    | { layout?: 'aspect'; aspectRatio?: ImageAspectRatio }
    | {
        layout: 'intrinsic';
        width: number;
        height: number;
        style?: CSSProperties;
      }
  );

const IMAGE_REVEAL_STYLE = {
  transition:
    'opacity 0.55s ease, filter 0.65s ease, transform 0.65s ease',
} as const;

function ImageWithSkeletonInner(props: ImageWithSkeletonProps) {
  const {
    src,
    alt,
    className,
    imageClassName,
    rounded = '',
    sizes,
    priority,
  } = props;

  const layout = props.layout ?? 'aspect';
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = containerRef.current?.querySelector('img');
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const revealStyle: CSSProperties = {
    opacity: loaded ? 1 : 0,
    filter: loaded ? 'blur(0px)' : 'blur(6px)',
    transform: loaded ? 'scale(1)' : 'scale(1.02)',
    ...IMAGE_REVEAL_STYLE,
  };

  const resolvedLayout = props.layout ?? 'aspect';

  const containerClassName = cn(
    'image-with-skeleton',
    resolvedLayout === 'fill' && 'image-with-skeleton--fill',
    resolvedLayout === 'aspect' &&
      cn(
        'image-with-skeleton--aspect',
        ASPECT_CLASS[
          'aspectRatio' in props && props.aspectRatio ? props.aspectRatio : '3/2'
        ],
      ),
    resolvedLayout === 'intrinsic' && 'image-with-skeleton--intrinsic',
    rounded,
    className,
  );

  const intrinsicImage =
    resolvedLayout === 'intrinsic' && 'width' in props
      ? {
          width: props.width,
          height: props.height,
          style: props.style,
        }
      : null;

  return (
    <div ref={containerRef} className={containerClassName}>
      {!error && <ImageSkeleton exiting={loaded} />}
      {error ? (
        <div className="image-with-skeleton__error">
          <span className="image-with-skeleton__error-text">
            Image unavailable
          </span>
        </div>
      ) : layout === 'intrinsic' && intrinsicImage ? (
        <Image
          src={src}
          alt={alt}
          width={intrinsicImage.width}
          height={intrinsicImage.height}
          sizes={sizes}
          priority={priority}
          className={cn('image-with-skeleton__img-intrinsic', imageClassName)}
          style={{ ...intrinsicImage.style, ...revealStyle }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('image-with-skeleton__img', imageClassName)}
          style={revealStyle}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export function ImageWithSkeleton(props: ImageWithSkeletonProps) {
  return <ImageWithSkeletonInner key={props.src} {...props} />;
}
