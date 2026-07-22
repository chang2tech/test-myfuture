import { toast } from 'sonner';

const COMING_SOON_TITLE = 'Tính năng đang được cập nhật';
const COMING_SOON_DESCRIPTION =
  'Chúng tôi đang hoàn thiện tính năng này. Vui lòng quay lại sau.';

const COMING_SOON_EXTERNAL_HOSTS = ['ai.myfuture.vn'];

export function showComingSoonToast(feature?: string) {
  toast.info(feature ?? COMING_SOON_TITLE, {
    description: COMING_SOON_DESCRIPTION,
    duration: 3200,
  });
}

export function normalizePath(href: string): string {
  if (!href) return '';

  const rawPath = href.startsWith('/')
    ? (href.split('?')[0]?.split('#')[0] ?? href)
    : new URL(href, 'http://localhost').pathname;

  if (rawPath !== '/' && rawPath.endsWith('/')) {
    return rawPath.slice(0, -1);
  }

  return rawPath;
}

function isUtilityHref(href: string): boolean {
  return href.startsWith('tel:') || href.startsWith('mailto:');
}

function isComingSoonExternalHref(href: string): boolean {
  try {
    const host = new URL(href).hostname;
    return COMING_SOON_EXTERNAL_HOSTS.some(
      (pattern) => host === pattern || host.endsWith(`.${pattern}`),
    );
  } catch {
    return false;
  }
}

function isNewsRoute(path: string): boolean {
  return path === '/ban-tin' || path.startsWith('/ban-tin/');
}

export function isComingSoonHref(href: string): boolean {
  if (!href || href === '#') return true;

  if (isUtilityHref(href)) return false;

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return isComingSoonExternalHref(href);
  }

  const path = normalizePath(href);

  if (isNewsRoute(path)) return false;
  if (path === '/') return true;

  return true;
}

export function isRouteAvailable(href: string): boolean {
  if (!href || href === '#') return false;
  return !isComingSoonHref(href);
}
