import type { NextConfig } from 'next';

const apiOrigin =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://localhost:4721';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    localPatterns: [
      { pathname: '/uploads/**' },
      { pathname: '/images/**' },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'myfuture.vn' },
      { protocol: 'https', hostname: 'myfuture.changtotech.click' },
      { protocol: 'https', hostname: 'ca.futurehomes.vn' },
      { protocol: 'https', hostname: 'cdn.tienphong.vn' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${apiOrigin}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${apiOrigin}/uploads/:path*`,
        },
      ],
      afterFiles: [
        {
          source: '/ban-tin/:categoryRoute.html',
          destination: '/ban-tin/:categoryRoute',
        },
        {
          source: '/ban-tin/:categoryRoute/trang-:page.html',
          destination: '/ban-tin/:categoryRoute/trang-:page',
        },
        {
          source: '/ban-tin.html',
          destination: '/ban-tin',
        },
      ],
    };
  },
};

export default nextConfig;
