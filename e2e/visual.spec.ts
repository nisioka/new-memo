import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('should match the homepage screenshot', async ({ page }) => {
    // ログインページに移動してログインを実行
    await page.goto('/login');
    await page.getByLabel('Username').fill('testuser');
    await page.getByRole('button', { name: 'Login as Local User' }).click();

    // これでホームページにいるはずなので、UIが安定するのを待つ
    await expect(page.getByRole('heading', { name: 'Memos' })).toBeVisible();
    
    // スクリーンショットを撮って比較
    await expect(page).toHaveScreenshot('homepage.png');
  });
});
