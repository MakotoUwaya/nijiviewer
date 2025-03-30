import { test, expect } from '@playwright/test';

test.describe('ライバー検索機能のテスト', () => {
  test('「はなび」という名前のライバーを検索できること', async ({ page, isMobile }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3000/');
    
    // タイトルの確認
    await expect(page).toHaveTitle('NijiViewer');
    
    // モバイル端末の場合、メニューボタンをクリックして検索ボックスを表示
    if (isMobile) {
      const menuToggle = page.getByRole('button', { name: 'open navigation menu' });
      await expect(menuToggle).toBeVisible();
      await menuToggle.click();
    }
    
    // 検索ボックスに「はなび」と入力
    const searchBox = page.getByRole('searchbox', { name: 'Search Liver Name...' });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('はなび');
    
    // Enterキーを押して検索を実行
    await searchBox.press('Enter');
    
    // 検索結果ページに遷移したことを確認
    await expect(page).toHaveURL(/\/liver-search\?q=%E3%81%AF%E3%81%AA%E3%81%B3/);
  });
});