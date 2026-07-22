'use client';

import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { showComingSoonToast } from '@/lib/core/coming-soon';

type ComingSoonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  feature?: string;
};

export function ComingSoonButton({
  feature,
  onClick,
  type = 'button',
  ...props
}: ComingSoonButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    showComingSoonToast(feature);
    onClick?.(event);
  };

  return <button type={type} onClick={handleClick} {...props} />;
}
