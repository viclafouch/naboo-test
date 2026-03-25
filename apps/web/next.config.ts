import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
