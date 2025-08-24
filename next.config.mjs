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
    webpackMemoryOptimizations: true, // Next.js 15+ memory optimization
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
      // Critical: Exclude webpack cache (main cause of 1.37GB size)
      '.next/cache/**/*',
      '.next/cache/webpack/**/*',
      '.next/trace/**/*',
      '.next/build-manifest.json',
      '.next/export-marker.json',
      '.next/package.json',
      '.next/prerender-manifest.json',
      '.next/routes-manifest.json',
      // Node modules and build tools
      'node_modules/@swc/core-linux-x64-gnu/**',
      'node_modules/@swc/core-linux-x64-musl/**', 
      'node_modules/@swc/core-win32-x64-msvc/**',
      'node_modules/@esbuild/**',
      'node_modules/esbuild/**',
      // Heavy dependencies
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
      // Dev and build artifacts
      '.git/**',
      '.vscode/**',
      '.github/**',
      'chrome-extension/**',
      'public/images/**',
      // Testing and docs
      'node_modules/jest/**',
      'node_modules/@testing-library/**',
      'node_modules/docs/**',
      'node_modules/examples/**',
      'node_modules/test/**',
      'node_modules/tests/**',
      'node_modules/*.md',
      'node_modules/**/README.md',
      'node_modules/**/CHANGELOG.md',
      // Source maps and debug files
      'node_modules/**/*.map',
      'node_modules/**/*.d.ts.map',
      '.next/**/*.map',
    ],
  },
  // Force transpilation of problematic packages
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
  // Webpack configuration for memory optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Optimize webpack cache settings for production to prevent 1.37GB cache inclusion
    if (config.cache && !dev) {
      // For Next.js 15, disable filesystem cache in production to prevent 1.37GB cache
      config.cache = false;
    }
    
    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
