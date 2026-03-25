import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['@naboo/design-system'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/**'
      }
    ]
  }
}

export default nextConfig
