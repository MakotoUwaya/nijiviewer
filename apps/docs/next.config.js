const withNextra = require('nextra')({
  reactStrictMode: true,
  transpilePackages: ['ui'],
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  eslint: {
    ignoreDuringBuilds: true,
  },
});

module.exports = withNextra();
