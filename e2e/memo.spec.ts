import { test, expect } from '@playwright/test';

test.skip('should allow a user to create, edit, and see a memo', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');

  // Perform a local login
  await page.getByLabel('Username').fill('testuser');
  await page.getByRole('button', { name: 'Login as Local User' }).click();

  // Wait for navigation to the home page
  await expect(page).toHaveURL('/');

  // Create a new memo
  await page.getByRole('button', { name: 'Create Memo' }).click();

  // Wait for navigation to the edit page
  await page.waitForURL(/\/edit\/.*/);
  await expect(page).toHaveURL(/\/edit\/.*/);

  // Edit the memo
  const editor = page.getByRole('textbox');
  await editor.fill('# My First Memo\n\nThis is my first memo.');

  // Save the memo
  await page.getByRole('button', { name: 'Save' }).click();

  // Go back to the home page
  await page.goto('/');

  // Check if the memo is listed
  await expect(page.getByText('My First Memo')).toBeVisible();
});
