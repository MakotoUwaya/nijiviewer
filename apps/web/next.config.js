/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: true,
  },
};
