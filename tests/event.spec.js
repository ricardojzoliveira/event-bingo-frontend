import { test, expect } from "@playwright/test";

test("createEvent", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter your username" }).fill("admin");
  await page.getByRole("textbox", { name: "••••••••" }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.getByRole("link", { name: "Admin Panel" }).click();
  await page.getByRole("link", { name: "Events Management" }).click();
  await page.getByRole("link", { name: "New Event" }).click();

  await page.getByRole("button", { name: "Basket" }).click();
  await page.getByPlaceholder("Ex: FC Porto").fill("Gaeiras");
  await page.getByPlaceholder("Ex: Benfica").fill("Vau");
  await page.locator('input[type="date"]').fill("2026-06-19");
  await page.locator('input[type="time"]').fill("02:56");
  await page.getByRole("button", { name: "Away Wins" }).click();
  await page.getByRole("button", { name: "Create Event" }).click();

  await expect(page.getByText("Gaeiras vs Vau").first()).toBeVisible({ timeout: 10000 });
});

test("updateStatus", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter your username" }).fill("admin");
  await page.getByRole("textbox", { name: "••••••••" }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.getByRole("link", { name: "Admin Panel" }).click();
  await page.getByRole("link", { name: "Events Management" }).click();

  await page.waitForTimeout(1000);

  const gameToSearch = "PSG"; 
  await page.getByPlaceholder("Searching Events").fill(gameToSearch);
  await page.waitForTimeout(500); 

  const openEventLine = page.locator("tbody tr").first();
  await expect(openEventLine).toBeVisible({ timeout: 5000 });

  const cellStatus = openEventLine.locator("td").nth(3);

  await cellStatus.locator("button").first().dispatchEvent("click");
  await page.waitForTimeout(500);

  await cellStatus.locator("button").first().dispatchEvent("click");

  await expect(cellStatus.getByText(/Confirm/i)).not.toBeVisible({ timeout: 5000 });
});

test("updateEvent", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter your username" }).fill("admin");
  await page.getByRole("textbox", { name: "••••••••" }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.getByRole("link", { name: "Admin Panel" }).click();
  await page.getByRole("link", { name: "Events Management" }).click();

  const editableEventLine = page.locator("tbody tr", { hasNotText: "Read Only" }).first();
  await expect(editableEventLine).toBeVisible({ timeout: 5000 });

  await editableEventLine.locator("td").last().locator("a").first().click();

  await page.getByRole("button", { name: "Tennis" }).click();
  await page.getByPlaceholder("Ex: FC Porto").fill("Sporting A");
  await page.getByPlaceholder("Ex: Benfica").fill("Alverca B");
  await page.locator('input[type="date"]').fill("2026-06-26");
  await page.locator('input[type="time"]').fill("00:45");
  await page.getByRole("button", { name: "Both teams score" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page.getByText("Sporting A vs Alverca B").first()).toBeVisible({ timeout: 10000 });
});

test("deleteEvent", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter your username" }).fill("admin");
  await page.getByRole("textbox", { name: "••••••••" }).fill("123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.getByRole("link", { name: "Admin Panel" }).click();
  await page.getByRole("link", { name: "Events Management" }).click();

  const deletableEventLine = page.locator("tbody tr", { hasNotText: "Read Only" }).first();
  await expect(deletableEventLine).toBeVisible({ timeout: 5000 });

  const gameToDelete = await deletableEventLine.locator("td span.font-bold").last().innerText();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await deletableEventLine.locator("td").last().getByRole("button").last().click();
  
  await expect(page.getByText(gameToDelete)).not.toBeVisible({ timeout: 10000 });
});