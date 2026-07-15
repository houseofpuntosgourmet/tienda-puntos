const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("📸 Capturando Login Page...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/login-page.png' });
  console.log("✅ Login page: /tmp/login-page.png");

  // Login
  console.log("🔑 Login automático...");
  await page.fill('input[type="email"]', 'admin@tiendapuntos.local');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/localhost:3000/**', { timeout: 5000 }).catch(() => {});
  
  console.log("📸 Capturando Dashboard...");
  await page.screenshot({ path: '/tmp/dashboard-page.png' });
  console.log("✅ Dashboard: /tmp/dashboard-page.png");

  await browser.close();
  console.log("✨ Done");
})();
