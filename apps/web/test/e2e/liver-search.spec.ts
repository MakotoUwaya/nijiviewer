import { test, expect } from '@playwright/test';
import { config } from '@/test/e2e/test-config';

test.describe('ライバー検索機能のテスト', () => {
  test('「はなび」という名前のライバーを検索できること', async ({
    page,
    isMobile,
  }) => {
    await page.goto(config.baseURL);

    if (isMobile) {
      const menuToggle = page.getByRole('button', {
        name: 'open navigation menu',
      });
      await expect(menuToggle).toBeVisible();
      await menuToggle.click();
    }

    const searchBox = page.getByRole('searchbox', {
      name: 'Search Liver Name...',
    });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('はなび');
    await searchBox.press('Enter');

    await expect(page).toHaveURL(
      /\/liver-search\?q=%E3%81%AF%E3%81%AA%E3%81%B3/,
    );
  });
});
