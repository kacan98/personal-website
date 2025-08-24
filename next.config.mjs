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
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // ppr: 'incremental', // TODO: Enable when upgrading to Next.js canary
  },
  // External packages for server components
  serverExternalPackages: [
    'openai', 
    'three', 
    'gsap',
    'html2canvas',
    'jspdf',
    'jspdf-autotable',
    '@emotion/react',
    '@emotion/styled',
    'zod'
  ],
  // Exclude packages from serverless function bundles
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'node_modules/three/**',
      'node_modules/gsap/**',
      'node_modules/html2canvas/**',
      'node_modules/jspdf/**',
      'node_modules/@emotion/**',
      'node_modules/@splinetool/**',
      'node_modules/@mui/**',
      'node_modules/react-icons/**',
      'node_modules/@types/**',
      'node_modules/typescript/**',
      'node_modules/.pnpm/**',
      '.git/**',
      '.vscode/**',
      'public/**',
      'chrome-extension/**',
    ],
  },
  // Force transpilation of problematic packages
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
