# Tienda Puntos API Documentation

## Base URL

```
http://localhost:3001  (development)
https://api.tienda-puntos.com  (production - example)
```

## Authentication

### JWT Token Flow

1. User registers or logs in
2. Receive JWT token in response
3. Include token in Authorization header for protected routes

```bash
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Default: 24 hours (configurable via JWT_EXPIRE env var)

## Endpoints

### Health Check

#### GET /health

No authentication required. Used for monitoring.

```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Authentication Routes

#### POST /auth/register

Register a new cliente.

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "whatsapp": "+5491234567890",
    "dni": "12345678"
  }'
```

**Request Body:**
```json
{
  "nombre": "string (required, 2-100 chars)",
  "whatsapp": "string (required, valid phone)",
  "dni": "string (required, 7-8 digits)"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cliente": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "whatsapp": "+5491234567890",
    "dni": "12345678",
    "puntosDisponibles": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "whatsapp",
      "message": "Invalid phone format"
    }
  ]
}
```

---

#### POST /auth/login

Login as cliente.

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "whatsapp": "+5491234567890"
  }'
```

**Request Body:**
```json
{
  "dni": "string (required)",
  "whatsapp": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cliente": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "whatsapp": "+5491234567890",
    "dni": "12345678",
    "puntosDisponibles": 150,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### POST /auth/admin-login

Login as admin.

```bash
curl -X POST http://localhost:3001/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "nombre": "Administrador",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

### Cliente Routes (Protected - Cliente)

#### GET /cliente/perfil

Get cliente profile. Requires valid JWT token.

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/cliente/perfil
```

**Response (200):**
```json
{
  "success": true,
  "cliente": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "whatsapp": "+5491234567890",
    "dni": "12345678",
    "puntosDisponibles": 150,
    "puntosUsados": 50,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### GET /cliente/historial

Get cliente transaction history.

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/cliente/historial?limit=20&offset=0"
```

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "total": 5,
  "historial": [
    {
      "id": "uuid",
      "tipo": "asignacion",
      "cantidad": 100,
      "saldo_anterior": 0,
      "saldo_nuevo": 100,
      "descripcion": "Compra en tienda",
      "fecha": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "tipo": "uso",
      "cantidad": -50,
      "saldo_anterior": 100,
      "saldo_nuevo": 50,
      "descripcion": "Canje de puntos",
      "fecha": "2024-01-16T15:45:00Z"
    }
  ]
}
```

---

### Admin Routes (Protected - Admin)

#### POST /admin/asignar-puntos

Assign points to a cliente.

```bash
curl -X POST -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteDni": "12345678",
    "cantidad": 100,
    "descripcion": "Compra en tienda"
  }' \
  http://localhost:3001/admin/asignar-puntos
```

**Request Body:**
```json
{
  "clienteDni": "string (required)",
  "cantidad": "number (required, > 0)",
  "descripcion": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "transaccion": {
    "id": "uuid",
    "clienteId": "uuid",
    "tipo": "asignacion",
    "cantidad": 100,
    "saldo_anterior": 50,
    "saldo_nuevo": 150,
    "descripcion": "Compra en tienda",
    "fecha": "2024-01-16T16:00:00Z"
  }
}
```

---

#### POST /admin/usar-puntos

Deduct points from a cliente.

```bash
curl -X POST -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteDni": "12345678",
    "cantidad": 50,
    "descripcion": "Canje de descuento"
  }' \
  http://localhost:3001/admin/usar-puntos
```

**Request Body:**
```json
{
  "clienteDni": "string (required)",
  "cantidad": "number (required, > 0)",
  "descripcion": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "transaccion": {
    "id": "uuid",
    "clienteId": "uuid",
    "tipo": "uso",
    "cantidad": -50,
    "saldo_anterior": 150,
    "saldo_nuevo": 100,
    "descripcion": "Canje de descuento",
    "fecha": "2024-01-16T16:05:00Z"
  }
}
```

---

#### GET /admin/clientes

Get all clientes with pagination.

```bash
curl -H "Authorization: Bearer <admin-token>" \
  "http://localhost:3001/admin/clientes?page=1&limit=50"
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 50, max: 100)
- `buscar`: Search by name or DNI (optional)

**Response (200):**
```json
{
  "success": true,
  "total": 100,
  "page": 1,
  "limit": 50,
  "clientes": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "whatsapp": "+5491234567890",
      "dni": "12345678",
      "puntosDisponibles": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### GET /admin/transacciones

Get all transactions.

```bash
curl -H "Authorization: Bearer <admin-token>" \
  "http://localhost:3001/admin/transacciones?tipo=asignacion&limit=100"
```

**Query Parameters:**
- `tipo`: Filter by type (asignacion, uso, or all)
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "total": 250,
  "transacciones": [
    {
      "id": "uuid",
      "clienteId": "uuid",
      "clienteNombre": "Juan Pérez",
      "tipo": "asignacion",
      "cantidad": 100,
      "saldo_anterior": 50,
      "saldo_nuevo": 150,
      "descripcion": "Compra en tienda",
      "fecha": "2024-01-16T16:00:00Z"
    }
  ]
}
```

---

#### GET /admin/estadisticas

Get system statistics.

```bash
curl -H "Authorization: Bearer <admin-token>" \
  http://localhost:3001/admin/estadisticas
```

**Response (200):**
```json
{
  "success": true,
  "estadisticas": {
    "totalClientes": 100,
    "puntosEnCirculacion": 5000,
    "puntosCanjeados": 2000,
    "transaccionesToday": 42,
    "totalTransacciones": 5000,
    "clientesActivos": 87
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "message": "Rate limit exceeded. Try again later.",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Rate limits applied to all endpoints:

- **Auth endpoints:** 5 requests per minute per IP
- **Other endpoints:** 100 requests per minute per IP

Rate limit info in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705417800
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit` or `size`: Number of results per page
- `offset` or `page`: Starting position or page number
- `sort`: Sort field and order (e.g., `createdAt:desc`)

**Response:**
```json
{
  "success": true,
  "total": 100,
  "limit": 20,
  "offset": 0,
  "data": [...]
}
```

---

## SMS Notifications

When points are assigned, cliente receives SMS:

```
Hola Juan! Recibiste 100 puntos. Tu saldo es de 150 puntos.
```

When points are used:

```
Hola Juan! Usaste 50 puntos. Tu saldo es de 100 puntos.
```

---

## Webhook Events (Future Implementation)

Planned webhook events:

- `cliente.created` - New cliente registered
- `puntos.assigned` - Points assigned to cliente
- `puntos.used` - Points used by cliente
- `cliente.updated` - Cliente profile updated

---

## Testing with cURL

### Full Login Flow Example

```bash
# 1. Register cliente
RESPONSE=$(curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "whatsapp": "+5491234567890",
    "dni": "12345678"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Get cliente profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/cliente/perfil

# 3. Get transaction history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/cliente/historial
```

---

## SDK/Library Support

**JavaScript/TypeScript:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
const response = await api.post('/auth/register', {
  nombre: 'Juan Pérez',
  whatsapp: '+5491234567890',
  dni: '12345678'
});
```

---

## Related Resources

- [API Reference](./API.md)
- [Setup Guide](./SETUP.md)
- [Deployment Guide](../deploy/DEPLOYMENT.md)
