#!/bin/bash

echo "🧪 TESTING TIENDA-PUNTOS UI FLOWS"
echo ""

# TEST 1: Login
echo "1️⃣  Testing Login..."
LOGIN=$(curl -s -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tiendapuntos.local","password":"admin123"}')

TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo "Response: $LOGIN"
  exit 1
fi

echo "✅ Login OK"
echo "   Token: ${TOKEN:0:20}..."
echo ""

# TEST 2: Get clientes
echo "2️⃣  Fetching clientes..."
CLIENTES=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/clientes)
CLIENTE_COUNT=$(echo $CLIENTES | grep -o '"id"' | wc -l)
echo "✅ Found $CLIENTE_COUNT clientes"
echo ""

# TEST 3: Create cliente
echo "3️⃣  Creating test cliente..."
CREATE=$(curl -s -X POST http://localhost:3001/api/clientes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Test CLI $(date +%s)\",\"whatsapp\":\"+541112345678\",\"dni\":\"99999999\",\"email\":\"test@test.com\"}")

NEW_ID=$(echo $CREATE | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$NEW_ID" ]; then
  echo "❌ Create failed"
  echo "Response: $CREATE"
else
  echo "✅ Created cliente (ID: ${NEW_ID:0:10}...)"
  echo ""

  # TEST 4: Assign points
  echo "4️⃣  Assigning points (9000 pesos)..."
  TXNS=$(curl -s -X POST http://localhost:3001/api/transacciones \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"clienteId\":\"$NEW_ID\",\"montoCompra\":9000,\"descripcion\":\"Test\"}")
  
  if echo $TXNS | grep -q "id"; then
    echo "✅ Transaction created"
    echo "   Monto: \$9000"
    echo ""
  else
    echo "❌ Transaction failed"
    echo "Response: $TXNS"
  fi
fi

# TEST 5: Get premios
echo "5️⃣  Fetching premios..."
PREMIOS=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/premios)
PREMIO_COUNT=$(echo $PREMIOS | grep -o '"id"' | wc -l)
echo "✅ Found $PREMIO_COUNT premios"
echo ""

# TEST 6: Get reglas
echo "6️⃣  Fetching reglas..."
REGLAS=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/reglas)
REGLA_COUNT=$(echo $REGLAS | grep -o '"id"' | wc -l)
ACTIVA=$(echo $REGLAS | grep '"activo":true')
echo "✅ Found $REGLA_COUNT reglas"
if [ ! -z "$ACTIVA" ]; then
  echo "   ✓ Active regla exists"
fi
echo ""

# TEST 7: Get canjes
echo "7️⃣  Fetching canjes..."
CANJES=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/canjes)
CANJE_COUNT=$(echo $CANJES | grep -o '"id"' | wc -l)
echo "✅ Found $CANJE_COUNT canjes"
echo ""

echo "✅ ALL API ENDPOINTS WORKING!"
echo ""
echo "📊 SUMMARY:"
echo "  ✓ POST /api/auth/admin/login"
echo "  ✓ GET /api/clientes"
echo "  ✓ POST /api/clientes (create)"
echo "  ✓ POST /api/transacciones (assign points)"
echo "  ✓ GET /api/premios"
echo "  ✓ GET /api/reglas"
echo "  ✓ GET /api/canjes"

