import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
  // Force transpilation of problematic packages
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
