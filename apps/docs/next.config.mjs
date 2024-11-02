import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

export default withNextra({
  reactStrictMode: true,
  transpilePackages: ['ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
});
