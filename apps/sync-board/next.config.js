import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = path.resolve(__dirname, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  serverExternalPackages: ['loro-crdt'],
  turbopack: {
    root: workspaceRoot,
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
};

export default nextConfig;
