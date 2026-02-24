import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// 環境変数をロード
dotenv.config();

/**
 * Playwrightの設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './apps/nijiviewer/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',

  // テスト実行前にアプリケーションをビルドする場合は、以下のようにセットアップする
  // globalSetup: require.resolve('./global-setup'),

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // ローカル開発サーバーの設定
  webServer: {
    command: 'pnpm viewer dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  },
});