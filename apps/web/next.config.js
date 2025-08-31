/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // WebAssembly サポートを有効化（loro-crdt用）
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // WebAssemblyファイルの処理を追加
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Supabase realtime-js の Node.js API 警告を抑制
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // 大きな文字列のシリアライゼーション警告を抑制
    config.infrastructureLogging = {
      level: 'error',
    };

    return config;
  },
};
