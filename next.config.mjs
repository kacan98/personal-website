/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [{
      hostname: 'cdn.sanity.io',
    }],
  },
};

export default nextConfig;
