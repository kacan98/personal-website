/** @type {import('next').NextConfig} */

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    // No remote patterns needed - using local images only
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // ppr: 'incremental', // TODO: Enable when upgrading to Next.js canary
  },
};

export default nextConfig;
