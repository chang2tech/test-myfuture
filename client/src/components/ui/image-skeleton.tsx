import { cn } from '@/lib/core/cn';

interface ImageSkeletonProps {
  exiting?: boolean;
  className?: string;
}

export function ImageSkeleton({ exiting = false, className }: ImageSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'image-skeleton',
        exiting && 'image-skeleton-exit',
        className,
      )}
    />
  );
}
