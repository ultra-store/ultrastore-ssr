import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.ultrastore.khizrim.online',
        pathname: '/wp-content/**',
      },
    ],
  },
}

export default nextConfig
