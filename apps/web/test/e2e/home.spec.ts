import { test, expect } from '@playwright/test';
import { config } from '@/test/e2e/test-config';

test.describe('ホーム画面のテスト', () => {
  test('アプリタイトルが NijiViewer になっていること', async ({ page }) => {
    await page.goto(config.baseURL);
    await expect(page).toHaveTitle('NijiViewer');
  });
});