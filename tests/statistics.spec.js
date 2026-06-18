import { test, expect } from '@playwright/test';

test('adminStatistics', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Admin Panel' }).click();
  await page.getByRole('link', { name: 'Statistics Statistics Event' }).click();
  await page.getByRole('heading', { name: 'Admin Statistics' }).click();
});