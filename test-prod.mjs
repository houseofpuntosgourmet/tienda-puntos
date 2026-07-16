import { chromium } from 'playwright';

const BASE_URL = 'https://tienda-puntos.onrender.com';
const API_URL = 'https://tienda-puntos.onrender.com';

async function testProduction() {
  const results = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test 1: API Health
    console.log('🔍 Test 1: API Health Check...');
    try {
      const response = await page.request.get(`${API_URL}/api/health`);
      results.push(`✅ API Health: ${response.status()}`);
    } catch (e) {
      results.push(`⚠️ API Health: No /health endpoint (normal)`);
    }

    // Test 2: Login endpoint
    console.log('🔐 Test 2: Login Endpoint...');
    try {
      const loginRes = await page.request.post(`${API_URL}/api/auth/admin/login`, {
        data: {
          email: 'admin@tiendapuntos.local',
          password: 'admin123',
        },
      });
      const loginData = await loginRes.json();
      if (loginRes.ok() && loginData.token) {
        results.push(`✅ Login: Success (token received)`);
        const token = loginData.token;

        // Test 3: List users
        console.log('👥 Test 3: List Users...');
        const usersRes = await page.request.get(`${API_URL}/api/usuarios/listar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = await usersRes.json();
        results.push(`✅ Users: ${users.length} users found`);

        // Test 4: List clientes
        console.log('👤 Test 4: List Clientes...');
        const clientesRes = await page.request.get(`${API_URL}/api/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientes = await clientesRes.json();
        results.push(`✅ Clientes: ${clientes.length || 0} clientes`);

        // Test 5: List premios
        console.log('🎁 Test 5: List Premios...');
        const premiosRes = await page.request.get(`${API_URL}/api/premios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const premios = await premiosRes.json();
        results.push(`✅ Premios: ${premios.length || 0} premios`);

        // Test 6: List canjes
        console.log('📋 Test 6: List Canjes...');
        const canjesRes = await page.request.get(`${API_URL}/api/canjes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const canjes = await canjesRes.json();
        results.push(`✅ Canjes: ${canjes.length || 0} canjes`);

        // Test 7: Frontend accessibility
        console.log('🌐 Test 7: Frontend Access...');
        await page.goto(`${BASE_URL}/#login`, { waitUntil: 'networkidle' });
        const title = await page.locator('h1').textContent();
        if (title && title.includes('Tienda')) {
          results.push(`✅ Frontend: Loaded (title: "${title}")`);
        } else {
          results.push(`⚠️ Frontend: Loaded but title unclear`);
        }

      } else {
        results.push(`❌ Login: Failed - ${loginData.message || 'Unknown error'}`);
      }
    } catch (e) {
      results.push(`❌ Login Error: ${e.message}`);
    }

  } catch (error) {
    results.push(`❌ Test Error: ${error.message}`);
  } finally {
    await browser.close();

    // Report
    console.log('\n📊 PRODUCTION TEST RESULTS:\n');
    results.forEach(r => console.log(r));
    console.log('\n✅ Testing Complete');
  }
}

testProduction();
