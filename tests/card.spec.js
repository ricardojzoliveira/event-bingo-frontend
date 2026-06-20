import { test, expect } from '@playwright/test';

test('create-card', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.getByRole('link', { name: 'Admin Panel' }).click();
  await page.getByRole('link', { name: 'Cards Management' }).click();
  await page.getByRole('link', { name: 'Create Card' }).click();
  
  await page.getByRole('textbox', { name: 'Ex: Weekend Specials' }).fill('Test Card');
  await page.getByPlaceholder('10.00').fill('10');
  await page.getByPlaceholder('50', { exact: true }).fill('100');
  await page.getByPlaceholder('500').fill('1000');

  // Garante tempo para a lista de eventos pendentes do seeder carregar via React
  await page.waitForLoadState('networkidle');

  for (let i = 0; i < 9; i++) {
    const availabeEvent = page.locator('.cursor-grab').first();
    const goalCell = page.locator('div.aspect-square').nth(i);

    await availabeEvent.dragTo(goalCell);
    await expect(goalCell.getByText('VS')).toBeVisible({ timeout: 2000 });
  }

  await page.getByRole('button', { name: 'Publish Card' }).click();

  await expect(page).toHaveURL('http://localhost:5173/admin/cards');

  const newCard = page.getByRole('heading', { name: 'Test Card' }).first();
  await expect(newCard).toBeVisible({ timeout: 5000 });
});

test('edit-card', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.getByRole('link', { name: 'Admin Panel' }).click();
  await page.getByRole('link', { name: 'Cards Management' }).click();
  
  // 🟢 CORREÇÃO: Foca exatamente no cartão dedicado do seeder
  const targetCardItem = page.locator('div.group.relative', { hasText: 'Edit Card Test' }).first();
  await expect(targetCardItem).toBeVisible({ timeout: 5000 });
  
  await targetCardItem.locator('a[href*="/admin/cards/edit/"]').click();
  
  await page.getByRole('textbox', { name: 'Ex: Weekend Specials' }).fill('Test Edited');
  await page.getByPlaceholder('10.00').fill('15');
  await page.getByPlaceholder('50', { exact: true }).fill('150');
  await page.getByPlaceholder('500').fill('1500');
  
  await page.getByRole('button', { name: 'Update Card' }).click();
  
  await expect(page).toHaveURL('http://localhost:5173/admin/cards');
  await expect(page.getByRole('heading', { level: 3, name: 'Test Edited' }).first()).toBeVisible({ timeout: 5000 });
});

test('delete-card', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: '••••••••' }).fill('123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.getByRole('link', { name: 'Admin Panel' }).click();
  await page.getByRole('link', { name: 'Cards Management' }).click();
  
  // 🟢 CORREÇÃO: Foca exatamente no cartão do seeder feito para ser apagado
  const targetCardItem = page.locator('div.group.relative', { hasText: 'Delete Card Test' }).first();
  await expect(targetCardItem).toBeVisible({ timeout: 5000 });
  
  page.once('dialog', async (dialog) => {
    console.log(`Delete Card: ${dialog.message()}`);
    await dialog.accept();
  });
  
  // Clica no botão de apagar desse cartão específico
  await targetCardItem.locator('button').last().click();
  
  const cardApagadoHeading = page.getByRole('heading', { level: 3, name: 'Delete Card Test' });
  await expect(cardApagadoHeading).not.toBeVisible({ timeout: 5000 });
});