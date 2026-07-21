import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'myfuture.vn' },
      { protocol: 'https', hostname: 'ca.futurehomes.vn' },
      { protocol: 'https', hostname: 'cdn.tienphong.vn' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
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
    ];
  },
};

export default nextConfig;
