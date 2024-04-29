/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
