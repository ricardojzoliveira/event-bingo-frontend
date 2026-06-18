import { test, expect } from '@playwright/test';

test('updateProfile', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob18');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('link', { name: 'Account Settings' }).click();
    await page.getByRole('button', { name: 'Change Avatar' }).click();
    await page.getByRole('button', { name: 'avatar' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('bob19');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('bob19');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('bob19@example.pt');
    await page.getByRole('textbox', { name: '••••••••' }).first().click();
    await page.getByRole('textbox', { name: '••••••••' }).first().fill('654321');
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).click();
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill('654321');
    await page.getByRole('button', { name: 'Save Settings' }).click({ timeout: 10000 });
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page.getByRole('heading', { name: 'bob19' })).toBeVisible({ timeout: 10000 });
});


test('selfExclude', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob17');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('link', { name: 'Account Settings' }).click();
    page.once('dialog', async dialog => {
        await dialog.accept();
    });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Request Self-Exclusion' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob17');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('User is Suspended')).toBeVisible({ timeout: 10000 });
});


test('deleteAccount', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob16');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('link', { name: 'Account Settings' }).click();
    page.once('dialog', async dialog => {
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('bob16');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('User not Found')).toBeVisible({ timeout: 10000 });
});



