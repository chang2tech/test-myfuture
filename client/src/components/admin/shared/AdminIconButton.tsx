import type { ButtonHTMLAttributes } from 'react';

type AdminIconButtonVariant = 'ghost' | 'danger';

interface AdminIconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: string;
  label: string;
  variant?: AdminIconButtonVariant;
  size?: 'sm';
}

export function AdminIconButton({
  icon,
  label,
  variant = 'ghost',
  size,
  className = '',
  type = 'button',
  ...props
}: AdminIconButtonProps) {
  const sizeClass = size ? ` admin-btn--${size}` : '';

  return (
    <button
      type={type}
      className={`admin-btn admin-btn--icon admin-btn--${variant}${sizeClass} ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      <i className={`bx ${icon}`} aria-hidden />
    </button>
  );
}
