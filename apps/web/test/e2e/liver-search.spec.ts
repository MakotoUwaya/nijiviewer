import { test, expect } from '@playwright/test';

test.describe('ライバー検索機能のテスト', () => {
  test('「はなび」という名前のライバーを検索できること', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3000/');
    
    // タイトルの確認
    await expect(page).toHaveTitle('NijiViewer');
    
    // 検索ボックスに「はなび」と入力
    const searchBox = page.getByPlaceholder('Search Liver Name...');
    await expect(searchBox).toBeVisible();
    await searchBox.fill('はなび');
    
    // Enterキーを押して検索を実行
    await searchBox.press('Enter');
    
    // 検索結果ページに遷移したことを確認
    await expect(page).toHaveURL(/\/liver-search\?q=%E3%81%AF%E3%81%AA%E3%81%B3/);
    
    // 検索結果のタイトルを確認
    const searchResultTitle = page.getByRole('heading', { name: /Search Results for "はなび"/ });
    await expect(searchResultTitle).toBeVisible();
    
    // 蝶屋はなびのプロフィールが表示されていることを確認
    const choyaHanabi = page.getByRole('link', { name: /蝶屋はなび \/ Choya Hanabi/ });
    await expect(choyaHanabi).toBeVisible();
    
    // 雨街はなびのプロフィールが表示されていることを確認
    const amemachiHanabi = page.getByRole('link', { name: /Hanabi ch. 雨街はなび/ });
    await expect(amemachiHanabi).toBeVisible();
    
    // 蝶屋はなびのYouTubeチャンネルURLを確認
    await expect(choyaHanabi).toHaveAttribute('href', 'https://youtube.com/channel/UCL9hJsdk9eQa0IlWbFB2oRg');
    
    // 雨街はなびのYouTubeチャンネルURLを確認
    await expect(amemachiHanabi).toHaveAttribute('href', 'https://youtube.com/channel/UC8yXRB_jKDeapwQak2i30EA');
    
    // チャンネル情報が表示されていることを確認（サブスクライバー数、動画数など）
    const pageContent = await page.textContent('main');
    expect(pageContent).toContain('VSpo / Chou Musubi');
    expect(pageContent).toContain('Independents');
  });
});