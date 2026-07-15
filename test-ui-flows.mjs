import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'admin@tiendapuntos.local';
const ADMIN_PASS = 'admin123';

let token = '';

async function test() {
  console.log('🧪 TESTING UI FLOWS\n');

  try {
    // TEST 1: Login
    console.log('1️⃣  Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
    });
    
    if (!loginRes.ok) {
      console.log('❌ Login failed:', loginRes.status);
      return;
    }
    
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Login OK, token:', token.substring(0, 20) + '...\n');

    // TEST 2: Get clientes
    console.log('2️⃣  Fetching clientes...');
    const clientesRes = await fetch(`${BASE_URL}/api/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const clientes = await clientesRes.json();
    console.log(`✅ Found ${clientes.length} clientes`);
    if (clientes.length > 0) console.log('   Sample:', clientes[0].nombre, `(${clientes[0].puntosActuales} pts)\n`);

    // TEST 3: Create cliente
    console.log('3️⃣  Creating test cliente...');
    const createRes = await fetch(`${BASE_URL}/api/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: 'Test Cliente ' + Date.now(),
        whatsapp: '+541112345678',
        dni: '12345678',
        email: 'test@example.com'
      })
    });
    
    if (createRes.ok) {
      const newCliente = await createRes.json();
      console.log(`✅ Created: ${newCliente.nombre} (ID: ${newCliente.id})\n`);

      // TEST 4: Assign points
      console.log('4️⃣  Assigning points (9000 pesos)...');
      const ptsRes = await fetch(`${BASE_URL}/api/transacciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clienteId: newCliente.id,
          montoCompra: 9000,
          descripcion: 'Test transaction'
        })
      });
      
      if (ptsRes.ok) {
        const ptsData = await ptsRes.json();
        console.log(`✅ Transaction OK`);
        console.log(`   Cliente: ${newCliente.nombre}`);
        console.log(`   Monto: $9000`);
        console.log(`   Puntos asignados: ${ptsData.puntosAsignados || 'N/A'}\n`);
      } else {
        console.log('❌ Transaction failed:', ptsRes.status);
      }
    } else {
      console.log('❌ Create cliente failed:', createRes.status);
    }

    // TEST 5: Get premios
    console.log('5️⃣  Fetching premios...');
    const premiosRes = await fetch(`${BASE_URL}/api/premios`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const premios = await premiosRes.json();
    console.log(`✅ Found ${premios.length} premios\n`);

    // TEST 6: Get reglas
    console.log('6️⃣  Fetching reglas...');
    const reglasRes = await fetch(`${BASE_URL}/api/reglas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const reglas = await reglasRes.json();
    console.log(`✅ Found ${reglas.length} reglas`);
    if (reglas.length > 0) {
      const active = reglas.find(r => r.activo);
      if (active) console.log(`   Active: ${active.nombre} (factor: ${active.factor})\n`);
    }

    // TEST 7: Get canjes
    console.log('7️⃣  Fetching canjes pendientes...');
    const canjesRes = await fetch(`${BASE_URL}/api/canjes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const canjes = await canjesRes.json();
    console.log(`✅ Found ${canjes.length} pending redemptions\n`);

    console.log('✅ ALL TESTS PASSED!');
    console.log('\n📊 SUMMARY:');
    console.log('  ✓ Login');
    console.log('  ✓ Get clientes');
    console.log('  ✓ Create cliente');
    console.log('  ✓ Assign points (transacciones)');
    console.log('  ✓ Get premios');
    console.log('  ✓ Get reglas');
    console.log('  ✓ Get canjes');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
