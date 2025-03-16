import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'vjfsascagdencbewveoz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**/storage/v1/object/public/**',
      }
    ],
    domains: process.env.NODE_ENV === 'development' ? ['localhost', '*'] : [],
    unoptimized: true,
  },
};

export default nextConfig;
