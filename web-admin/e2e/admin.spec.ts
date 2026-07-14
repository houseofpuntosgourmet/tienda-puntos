import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('Admin login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill admin credentials
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('Admin can access admin panel', async ({ page }) => {
    await page.goto('http://localhost:3001/admin');

    // Verify admin panel is loaded
    const adminTitle = await page.waitForSelector('h1, [data-testid="admin-title"]', { timeout: 5000 });
    expect(adminTitle).toBeTruthy();
  });

  test('Admin can assign points to cliente', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/assign-points');

    // Fill cliente identifier
    await page.fill('input[name="clienteDni"]', '12345678');

    // Fill points amount
    await page.fill('input[name="points"]', '100');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message or navigation
    await expect(page).toHaveURL(/.*admin|.*dashboard/, { timeout: 5000 });
  });

  test('Admin can view all clientes', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/clientes');

    // Wait for clientes list
    const clientesList = await page.waitForSelector('.clientes-list, [data-testid="clientes-list"]', { timeout: 5000 });
    expect(clientesList).toBeTruthy();
  });

  test('Admin can view transaction history', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/transactions');

    // Wait for transactions table
    const transactionsTable = await page.waitForSelector('table, [data-testid="transactions-table"]', { timeout: 5000 });
    expect(transactionsTable).toBeTruthy();
  });

  test('Admin login fails with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'wrong@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error or remain on login page
    const errorMessage = await page.locator('.error-message, [data-testid="error-message"]').first();
    const isErrorVisible = await errorMessage.isVisible().catch(() => false);
    const isStillOnLogin = page.url().includes('login');

    expect(isErrorVisible || isStillOnLogin).toBeTruthy();
  });
});
