'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { isComingSoonHref, showComingSoonToast } from '@/lib/core/coming-soon';

type SmartLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function isExternalHref(href: string): boolean {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:')
  );
}

function isAnchorHref(href: string): boolean {
  return href.startsWith('#') && href.length > 1;
}

export function SmartLink({
  href,
  onClick,
  children,
  target,
  rel,
  ...props
}: SmartLinkProps) {
  const handleComingSoon = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showComingSoonToast();
    onClick?.(event);
  };

  if (isAnchorHref(href)) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  if (isExternalHref(href)) {
    if (isComingSoonHref(href)) {
      return (
        <a href="#" role="link" onClick={handleComingSoon} {...props}>
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isComingSoonHref(href)) {
    return (
      <a href="#" role="link" onClick={handleComingSoon} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} target={target} rel={rel} {...props}>
      {children}
    </Link>
  );
}
