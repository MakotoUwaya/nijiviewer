/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['loro-crdt'],
  webpack: (config, { isServer }) => {
    // WebAssembly サポートを有効化（loro-crdt用）
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // WebAssemblyファイルの処理を追加
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // ターゲット環境を明示的に設定
    config.target = isServer ? 'node' : ['web', 'es2020'];

    // Supabase関連の Node.js API 警告を抑制
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Supabaseモジュールの警告を抑制
    config.ignoreWarnings = [
      /A Node\.js API is used \(process\./,
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/,
    ];

    // 大きな文字列のシリアライゼーション警告を抑制
    config.infrastructureLogging = {
      level: 'error',
    };

    return config;
  },
};
