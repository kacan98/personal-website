import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withMDX = createMDX({});

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
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  experimental: {
    webpackMemoryOptimizations: true,
    // ppr: 'incremental', // TODO: Enable when upgrading to Next.js canary
  },
  serverExternalPackages: [
    'openai',
    'three',
    'gsap',
    'html2canvas',
    'jspdf',
    'jspdf-autotable',
    'zod'
  ],
  outputFileTracingExcludes: {
    '*': [
      '.next/cache/**/*',
      '.next/cache/webpack/**/*',
      '.next/trace/**/*',
      '.next/build-manifest.json',
      '.next/export-marker.json',
      '.next/package.json',
      '.next/prerender-manifest.json',
      '.next/routes-manifest.json',
      'node_modules/@swc/core-linux-x64-gnu/**',
      'node_modules/@swc/core-linux-x64-musl/**',
      'node_modules/@swc/core-win32-x64-msvc/**',
      'node_modules/@esbuild/**',
      'node_modules/esbuild/**',
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
      'node_modules/canvas/**',
      'node_modules/sharp/**',
      '.git/**',
      '.vscode/**',
      '.github/**',
      'chrome-extension/**',
      'node_modules/jest/**',
      'node_modules/@testing-library/**',
      'node_modules/docs/**',
      'node_modules/examples/**',
      'node_modules/test/**',
      'node_modules/tests/**',
      'node_modules/*.md',
      'node_modules/**/README.md',
      'node_modules/**/CHANGELOG.md',
      'node_modules/**/*.map',
      'node_modules/**/*.d.ts.map',
      '.next/**/*.map',
    ],
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = false;
    }

    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
