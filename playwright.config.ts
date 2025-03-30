import { defineConfig, devices } from '@playwright/test';

/**
 * Playwrightの設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './apps/web/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
    // モバイルブラウザでのテスト
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // ローカル開発サーバーの設定
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分
  },
});