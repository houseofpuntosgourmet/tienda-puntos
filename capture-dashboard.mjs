import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("📸 Accediendo a login...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: '/tmp/01-login.png', fullPage: true });
    console.log("✅ Login captured: /tmp/01-login.png");

    console.log("🔑 Login automático...");
    await page.fill('input[type="email"]', 'admin@tiendapuntos.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    console.log("⏳ Esperando dashboard...");
    await page.waitForTimeout(3000);
    
    console.log("📸 Capturando dashboard...");
    await page.screenshot({ path: '/tmp/02-dashboard.png', fullPage: true });
    console.log("✅ Dashboard captured: /tmp/02-dashboard.png");

    // Get dashboard HTML structure
    const html = await page.content();
    fs.writeFileSync('/tmp/dashboard-html.txt', html);
    console.log("✅ HTML saved: /tmp/dashboard-html.txt");

    // Get page title and visible text
    const title = await page.title();
    console.log(`\nPage title: ${title}`);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await browser.close();
  }
})();
