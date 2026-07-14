import { test, expect } from '@playwright/test';

test.describe('Cliente Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('Register cliente with valid data', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:3001/auth/register');

    // Fill registration form
    await page.fill('input[name="nombre"]', 'Test Cliente');
    await page.fill('input[name="whatsapp"]', '+1234567890');
    await page.fill('input[name="dni"]', '12345678');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('Cliente login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill login form
    await page.fill('input[name="dni"]', '12345678');
    await page.fill('input[name="whatsapp"]', '+1234567890');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('Cliente can view points balance', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');

    // Wait for points display
    const pointsElement = await page.waitForSelector('.points-balance, [data-testid="points-balance"]', { timeout: 5000 });
    expect(pointsElement).toBeTruthy();
  });

  test('Cliente registration fails with invalid data', async ({ page }) => {
    await page.goto('http://localhost:3001/auth/register');

    // Fill with invalid data
    await page.fill('input[name="nombre"]', '');
    await page.fill('input[name="whatsapp"]', 'invalid');
    await page.fill('input[name="dni"]', '123'); // Too short

    // Submit form
    await page.click('button[type="submit"]');

    // Should remain on register page
    await expect(page).toHaveURL(/.*register/);
  });
});
