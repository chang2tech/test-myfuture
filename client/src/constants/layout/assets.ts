export const ASSETS = {
  logo: '/images/logo-homepage.png',
  favicon: '/images/favicon.png',
  noImage: '/images/no-image.png',
  imageSeo: '/images/image-seo.jpg',
  vr360: '/images/vr360.png',
  bgFutureMind: '/images/bg-future-mind.jpg',
  aiAvatar: '/images/avt-tln.png',
} as const;

export const THEME_VERSION = '1784636244';

export const THEME_BASE = 'https://myfuture.vn/application/themes';

export const THEME_CSS = [
  `${THEME_BASE}/css/font.min.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/boxicons.min.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/global.min.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/default.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/style.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/unit.css?v=${THEME_VERSION}`,
  `${THEME_BASE}/css/news.css?v=${THEME_VERSION}`,
] as const;
