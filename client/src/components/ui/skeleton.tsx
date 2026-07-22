import { cn } from '@/lib/core/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn('skeleton-shimmer', className)} />;
}
