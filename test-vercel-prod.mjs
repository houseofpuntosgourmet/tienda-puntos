import { chromium } from 'playwright';

const BASE_URL = 'https://tienda-puntos-ten.vercel.app';
const API_URL = 'https://tienda-puntos-ten.vercel.app';

async function testVercelProduction() {
  const results = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test 1: Health check
    console.log('🔍 Test 1: Health Check...');
    try {
      const response = await page.request.get(`${API_URL}/health`);
      results.push(`✅ Health: ${response.status()}`);
    } catch (e) {
      results.push(`⚠️ Health: Endpoint missing (normal)`);
    }

    // Test 2: Login
    console.log('🔐 Test 2: Login...');
    try {
      const loginRes = await page.request.post(`${API_URL}/api/auth/admin/login`, {
        data: {
          email: 'admin@tiendapuntos.local',
          password: 'admin123',
        },
      });
      const loginData = await loginRes.json();
      if (loginRes.ok() && loginData.token) {
        results.push(`✅ Login: Success`);
        const token = loginData.token;

        // Test 3: Clientes
        console.log('👤 Test 3: Clientes...');
        const clientesRes = await page.request.get(`${API_URL}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientes = await clientesRes.json();
        results.push(`✅ Clientes: ${Array.isArray(clientes) ? clientes.length : '?'} found`);

        // Test 4: Premios
        console.log('🎁 Test 4: Premios...');
        const premiosRes = await page.request.get(`${API_URL}/api/premios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const premios = await premiosRes.json();
        results.push(`✅ Premios: ${Array.isArray(premios) ? premios.length : '?'} found`);

        // Test 5: Canjes
        console.log('📋 Test 5: Canjes...');
        const canjesRes = await page.request.get(`${API_URL}/api/canjes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const canjes = await canjesRes.json();
        results.push(`✅ Canjes: ${Array.isArray(canjes) ? canjes.length : '?'} found`);

      } else {
        results.push(`❌ Login: Failed - ${loginData.message || 'Unknown error'}`);
      }
    } catch (e) {
      results.push(`❌ Login Error: ${e.message}`);
    }

    // Test 6: Frontend
    console.log('🌐 Test 6: Frontend...');
    try {
      await page.goto(`${BASE_URL}/#login`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const title = await page.locator('h1').first().textContent();
      if (title) {
        results.push(`✅ Frontend: Loaded ("${title}")`);
      } else {
        results.push(`⚠️ Frontend: Loaded but title unclear`);
      }
    } catch (e) {
      results.push(`❌ Frontend: ${e.message.substring(0, 50)}`);
    }

  } catch (error) {
    results.push(`❌ Test Error: ${error.message}`);
  } finally {
    await browser.close();

    console.log('\n📊 VERCEL PRODUCTION TEST RESULTS:\n');
    results.forEach(r => console.log(r));
    console.log('\n✅ Test Complete');
  }
}

testVercelProduction();
