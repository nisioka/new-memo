import { test, expect } from '@playwright/test';

test.describe('Component Visual Regression', () => {
  test('ErrorNotification should match screenshot', async ({ page }) => {
    await page.goto('/test/error-notification');
    
    // エラーメッセージが表示されている状態
    const errorNotificationVisible = page.locator('[data-testid="error-notification"]');
    await expect(errorNotificationVisible).toBeVisible();
    await expect(errorNotificationVisible).toHaveScreenshot('error-notification-visible.png');
  });

  test('OfflineIndicator should match screenshot', async ({ page }) => {
    await page.goto('/test/offline-indicator');
    const offlineIndicator = page.locator('[data-testid="offline-indicator"]').first();
    await expect(offlineIndicator).toBeVisible();
    await expect(offlineIndicator).toHaveScreenshot('offline-indicator-visible.png');
  });
});
