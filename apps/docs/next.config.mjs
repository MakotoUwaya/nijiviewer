import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async headers() {
    // Content Security Policy
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://storage.googleapis.com https://qiita-image-store.s3.amazonaws.com",
      "media-src 'self' blob:",
      "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
      "font-src 'self' data:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), fullscreen=(self), payment=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
};

export default withMDX(config);
