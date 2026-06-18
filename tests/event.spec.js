import { test, expect } from '@playwright/test';

test('createEvent', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Admin Panel' }).click();
    await page.getByRole('link', { name: 'Events Management Create,' }).click();
    await page.getByRole('link', { name: 'New Event' }).click();
    await page.getByRole('button', { name: 'Basket' }).click();
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).click();
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).fill('Gaeiras');
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).click();
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).fill('Vau');
    await page.locator('input[type="date"]').fill('2026-06-19');
    await page.locator('input[type="time"]').fill('02:56');
    await page.getByRole('button', { name: 'Away Wins' }).click();
    await page.getByRole('button', { name: 'Create Event' }).click();
    await page.getByText('Gaeiras vs Vau').click({ timeout: 10000 });
});


test('updateStatus', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Admin Panel' }).click();
    await page.getByRole('link', { name: 'Events Management Create,' }).click();
    await page.getByRole('button').nth(1).click();
    await page.getByRole('button').nth(1).click();
    await page.getByText('Win').first().click();
});


test('deleteEvent', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Admin Panel' }).click();
    await page.getByRole('link', { name: 'Events Management Create,' }).click();
    page.once('dialog', async dialog => {
        await dialog.accept();
    });
    await page.getByRole('button').nth(5).click();
    await expect(page.getByText('dd vs cc')).not.toBeVisible({ timeout: 10000 });
});


test('updateEvent', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).click();
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
    await page.getByRole('textbox', { name: '••••••••' }).click();
    await page.getByRole('textbox', { name: '••••••••' }).fill('123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('link', { name: 'Admin Panel' }).click();
    await page.getByRole('link', { name: 'Events Management Create,' }).click();
    await page.getByRole('button').nth(4).click();
    await page.getByRole('button', { name: 'Tennis' }).click();
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).click();
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).fill('Sporting ');
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).fill('Sporting A');
    await page.getByRole('textbox', { name: 'Ex: FC Porto' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).click();
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).fill('Alverca ');
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).fill('Alverca B');
    await page.getByRole('textbox', { name: 'Ex: Benfica' }).press('CapsLock');
    await page.locator('input[type="date"]').fill('2026-06-26');
    await page.locator('input[type="time"]').fill('00:45');
    await page.getByRole('button', { name: 'Both teams score' }).click();
    await page.getByRole('button', { name: 'Save Changes' }).click({ timeout: 10000 });
    await expect(page.getByText('Sporting A vs Alverca B')).toBeVisible({ timeout: 10000 })
});