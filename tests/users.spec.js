import { test, expect } from '@playwright/test';

test('deposit', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Wallet' }).click();

  const balanceLocator = page.locator('h2:has-text("€")').first();
  const balanceTextBefore = await balanceLocator.innerText();
  const balanceBefore = parseFloat(balanceTextBefore.replace(/[^0-9.]/g, '')) || 0;

  await page.getByRole('button', { name: 'Deposit', exact: true }).click();
  await page.getByPlaceholder('0.00').fill('50');
  await page.getByPlaceholder('Card Holder Name').fill('Ricardo Oliveira');
  await page.getByPlaceholder('0000 0000 0000 0000').fill('3284 5555 5555 5555');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('CVC').fill('354');
  
  await page.getByRole('button', { name: 'Confirm deposit' }).click();

  const expectedValue = balanceBefore + 50;
  await expect(balanceLocator).toContainText(`€${expectedValue.toFixed(2)}`, { timeout: 10000 });
});

test('withdraw', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('ricardo');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Wallet' }).click();

  const balanceLocator = page.locator('h2:has-text("€")').first();
  const balanceTextBefore = await balanceLocator.innerText();
  const balanceBefore = parseFloat(balanceTextBefore.replace(/[^0-9.]/g, '')) || 0;

  await page.getByRole('button', { name: 'Withdraw', exact: true }).click();

  const confirmButton = page.getByRole('button', { name: 'Confirm withdraw' });
  await expect(confirmButton).toBeVisible();

  await page.getByPlaceholder('0.00').fill('50');
  await page.getByPlaceholder('Card Holder Name').fill('Ricardo Oliveira');
  await page.getByPlaceholder('0000 0000 0000 0000').fill('3284 5555 5555 5555');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('CVC').fill('354');
  
  await confirmButton.click();

  const expectedValue = balanceBefore - 50;
  await expect(balanceLocator).toContainText(`€${expectedValue.toFixed(2)}`, { timeout: 10000 });
});


test('buy-card', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.getByRole('link', { name: 'Event Bingo' }).click();
  const firstCard = page.locator('section > div').first();

  await firstCard.getByRole('link', { name: /Get Card/i }).click();

  await page.getByRole('button', { name: 'Confirm Purchase' }).click();

  const successMessage = page.getByText('Card purchased successfully! Good luck.');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
});
