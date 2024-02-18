const withNextra = require('nextra')({
  reactStrictMode: true,
  transpilePackages: ['ui'],
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra();
