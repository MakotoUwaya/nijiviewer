import { config } from '@/test/e2e/test-config';
import { expect, test } from '@playwright/test';

test.describe('ホーム画面のテスト', () => {
  test('アプリタイトルが NijiViewer になっていること', async ({ page }) => {
    await page.goto(config.baseURL);
    await expect(page).toHaveTitle('NijiViewer');
  });
});
