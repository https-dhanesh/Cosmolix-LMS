/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/__clerk/:path*',
        destination: 'https://api.clerk.com/__clerk/:path*',
      },
    ];
  },
};

export default nextConfig;