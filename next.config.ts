/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fastly.4sqi.net',
      },
      {
        protocol: 'https',
        hostname: 'ss3.4sqi.net',
      }
    ],
  },
};

export default nextConfig;