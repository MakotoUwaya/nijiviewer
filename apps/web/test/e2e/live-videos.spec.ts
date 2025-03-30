import { config } from '@/test/e2e/test-config';
import { expect, test } from '@playwright/test';

test.describe('ライブ配信一覧のテスト', () => {
  test('選択した組織のライブ配信一覧に遷移すること', async ({
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

      // モバイル専用の組織セレクターを特定
      const selector = page.getByTestId('mobile-org-selector');
      await expect(selector).toBeVisible();
      await selector.click();
    } else {
      // デスクトップ用の組織セレクター
      const selector = page.getByTestId('desktop-org-selector');
      await expect(selector).toBeVisible();
      await selector.click();
    }

    const option = page.getByRole('option', { name: 'ホロライブ ホロライブ' });
    await expect(option).toBeVisible();

    // 要素が安定するのを待ち、forceオプションでクリックを強制する
    await page.waitForTimeout(500);
    await option.click({ force: true, timeout: 45000 });

    await expect(page).toHaveURL(/\/live-videos\/Hololive/);
  });
});
