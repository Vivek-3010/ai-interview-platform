/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.favpng.com',
      },
    ],
  },
};

export default nextConfig;
