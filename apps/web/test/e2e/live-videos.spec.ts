import { config } from '@/test/e2e/test-config';
import { expect, test } from '@playwright/test';

test.describe('ライブ配信一覧のテスト', () => {
  test('選択した組織のライブ配信一覧に遷移すること', async ({ page }) => {
    await page.goto(config.baseURL);

    // サイドバーを開く（モバイル・デスクトップ共通）
    const menuToggle = page.getByRole('button', {
      name: 'Toggle sidebar',
    });
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    const selector = page.getByTestId('org-selector');
    await expect(selector).toBeVisible();
    await selector.click();

    const option = page.getByRole('option', { name: 'ホロライブ ホロライブ' });
    await expect(option).toBeVisible();

    await option.click({ force: true, timeout: 45000 });

    await expect(page).toHaveURL(/\/live-videos\/Hololive/);
  });
});
