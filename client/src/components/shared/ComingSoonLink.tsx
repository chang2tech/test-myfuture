'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { showComingSoonToast } from '@/lib/core/coming-soon';

type ComingSoonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  feature?: string;
};

export function ComingSoonLink({
  feature,
  onClick,
  children,
  ...props
}: ComingSoonLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showComingSoonToast(feature);
    onClick?.(event);
  };

  return (
    <a href="#" role="link" onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
