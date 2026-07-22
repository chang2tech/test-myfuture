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
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  '2/1': 'aspect-[2/1]',
  '4/5': 'aspect-[4/5]',
  '12/7': 'aspect-[12/7]',
  '20/9': 'aspect-[20/9]',
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
    'overflow-hidden bg-[#ececec]',
    resolvedLayout === 'fill' && 'absolute inset-0 h-full w-full',
    resolvedLayout === 'aspect' &&
      cn(
        'relative w-full',
        ASPECT_CLASS[
          'aspectRatio' in props && props.aspectRatio ? props.aspectRatio : '3/2'
        ],
      ),
    resolvedLayout === 'intrinsic' && 'relative inline-block leading-none',
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#ececec] px-3 text-center">
          <span className="text-[10px] font-medium text-gray-400">
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
          className={cn('relative z-[1]', imageClassName)}
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
          className={cn('relative z-[1] object-cover', imageClassName)}
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
