/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [{
      hostname: "via.placeholder.com",
    }],
  },
};

export default nextConfig;
