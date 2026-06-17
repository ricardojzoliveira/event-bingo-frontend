import { test, expect } from '@playwright/test';

test('register', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('button', { name: 'Change Avatar' }).click();
    await page.getByRole('button', { name: 'avatar option' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('test');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('test');
    await page.getByRole('textbox', { name: 'name@example.com' }).click();
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('test@example.pt');
    await page.getByRole('textbox', { name: '••••••••' }).first().click();
    await page.getByRole('textbox', { name: '••••••••' }).first().fill('123456');
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).click();
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill('123456');
    await page.getByRole('checkbox', { name: 'I confirm I am 18+ years old.' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Welcome back test')).toBeVisible({ timeout: 10000 });
});