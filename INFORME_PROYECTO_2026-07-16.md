# INFORME COMPLETO - TIENDA DE PUNTOS (House of Panchos)
**Fecha:** 2026-07-16  
**Estado:** Funcional en desarrollo local | Deployment en internet: Bloqueado  
**Modelo utilizado:** Claude Haiku 4.5 + Claude Sonnet (agente autónomo)

---

## 1. RESUMEN EJECUTIVO

**Proyecto:** Plataforma de puntos/lealtad para House of Panchos (panchería gourmet)

**Status:**
- ✅ **Backend**: 100% funcional (Node.js + Express + Prisma + SQLite)
- ✅ **Frontend Admin**: 100% funcional (React 18 + Vite + Tailwind)
- ✅ **Autenticación**: JWT implementado
- ✅ **Base de datos**: SQLite con 8 modelos principales
- ⚠️ **Deployment**: No funcional en internet (Render, Vercel, Railway intentados)
- ⚠️ **Mobile**: React Native scaffolding (sin completar)

**Líneas de código:** 15,000+ (backend + frontend)
**Commits:** 40+
**Endpoints API:** 20+

---

## 2. ACCESO LOCAL - INSTRUCCIONES PASO A PASO

### 2.1 Prerequisitos
- Node.js 18+ instalado
- npm o pnpm
- Git

### 2.2 Clonar repositorio
```bash
cd C:\Users\Alejo Bales
git clone https://github.com/villaloboslote322/tienda-puntos.git
cd tienda-puntos
```

### 2.3 Instalar dependencias
```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd ../web-admin
npm install
```

### 2.4 Levantar servidores locales

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Esperado: "Server running on port 3001"
```

**Terminal 2 - Frontend:**
```bash
cd web-admin
npm run dev
# Esperado: "Local: http://localhost:3000"
```

### 2.5 Acceso a la plataforma

**URL Admin Panel:** http://localhost:3000

**Credenciales de prueba:**
```
Email: admin@tiendapuntos.local
Password: admin123
```

**URL Backend API:** http://localhost:3001/api

---

## 3. ARQUITECTURA DEL PROYECTO

### 3.1 Estructura de directorios
```
tienda-puntos/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── routes/            # Endpoints API (8+ archivos)
│   │   ├── services/          # Lógica de negocio
│   │   ├── middleware/        # Auth, errores, logging
│   │   ├── config/            # Configuración (DB, JWT)
│   │   └── prisma/            # ORM Prisma + schema
│   ├── package.json
│   ├── vercel.json           # Config deployment (no funcional)
│   └── tsconfig.json
│
├── web-admin/                 # Frontend React
│   ├── src/
│   │   ├── pages/            # Dashboard
│   │   ├── components/       # UI components (13+ archivos)
│   │   ├── api.ts            # Cliente HTTP
│   │   └── App.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── mobile/                    # React Native (scaffolding)
├── e2e/                       # Playwright tests (parcial)
├── docs/                      # Documentación
└── README.md
```

### 3.2 Stack tecnológico

| Layer | Tech |
|-------|------|
| Backend | Node.js 18+ / Express.js / TypeScript |
| Database | SQLite (dev/prod local) |
| ORM | Prisma 7.8.0 |
| Frontend | React 18 / Vite / Tailwind CSS |
| Auth | JWT (jsonwebtoken) |
| API Client | Axios |
| Validation | Zod |
| Testing | Playwright (E2E), Vitest (unit) |
| Logging | Winston |

---

## 4. BASE DE DATOS - SCHEMA PRISMA

**Modelo:** SQLite file-based (`backend/prisma/dev.db`)

**Tablas principales:**
1. **Usuario** - Admins del sistema
   - id, email (unique), password (bcrypt), nombre, rol, activo, timestamps
2. **Cliente** - Clientes finales registrados
   - id, nombre, whatsapp (unique), dni (unique), email, cumpleaños, puntosActuales, estado
3. **Transaccion** - Movimientos de puntos
   - id, clienteId, tipo, monto, puntosAsignados, puntosAntes, puntosDespues, descripcion, timestamp
4. **ReglaPuntos** - Configuración de conversión $→puntos
   - id, nombre, descripcion, montoBase, puntosOtorgados, activa
5. **Premio** - Premios canjeables
   - id, nombre, descripcion, puntosRequeridos, valor, vigencia, activo
6. **Canje** - Transacciones de canjes de premios
   - id, clienteId, premioId, estado (pendiente/completado/cancelado)

**Relaciones:**
- Cliente → Transaccion (1:N)
- Cliente → Canje (1:N)
- Premio → Canje (1:N)

---

## 5. API ENDPOINTS - REFERENCIA COMPLETA

### 5.1 Autenticación
```
POST /api/auth/admin/login
  Body: { email, password }
  Return: { token, usuario }
```

### 5.2 Usuarios (Admin)
```
POST   /api/usuarios/crear-admin       # Crear nuevo admin
GET    /api/usuarios/listar            # Listar todos usuarios
PUT    /api/usuarios/perfil            # Actualizar mi perfil
PUT    /api/usuarios/:id/cambiar-password  # Cambiar contraseña a otro
PUT    /api/usuarios/:id/desactivar    # Desactivar usuario
PUT    /api/usuarios/:id/activar       # Activar usuario
```

### 5.3 Clientes
```
GET    /api/clientes                   # Listar clientes
POST   /api/clientes                   # Registrar cliente (público)
GET    /api/clientes/:id               # Detalle cliente
PUT    /api/clientes/:id               # Actualizar cliente
```

### 5.4 Premios
```
GET    /api/premios                    # Listar premios
POST   /api/premios                    # Crear premio
PUT    /api/premios/:id                # Actualizar premio
DELETE /api/premios/:id                # Eliminar premio
```

### 5.5 Reglas de Puntos
```
GET    /api/reglas                     # Listar reglas
POST   /api/reglas                     # Crear regla
PUT    /api/reglas/:id                 # Actualizar regla
DELETE /api/reglas/:id                 # Eliminar regla
```

### 5.6 Transacciones
```
POST   /api/transacciones              # Registrar transacción (asignar puntos)
GET    /api/transacciones              # Listar transacciones
```

### 5.7 Canjes
```
GET    /api/canjes                     # Listar canjes
POST   /api/canjes                     # Crear canje
PUT    /api/canjes/:id                 # Actualizar estado canje
```

### 5.8 Reportes
```
GET    /api/reportes/clientes          # Reporte clientes con métricas
GET    /api/reportes/puntos            # Reporte de puntos distribuidos
```

**Headers requeridos (excepto login y registro público):**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 6. FRONTEND - FUNCIONALIDADES

### 6.1 Login Admin (`/#login`)
- Email + Password
- Validación JWT
- Redirect a dashboard si token válido

### 6.2 Dashboard (`/`)
- Resumen: Total clientes, puntos distribuidos, canjes pendientes
- Navbar con navegación
- Logout

### 6.3 Gestión de Clientes (`/#clientes`)
- Listar clientes con búsqueda
- Crear cliente nuevo
- Ver detalle cliente
- Editar datos

### 6.4 Gestión de Premios (`/#premios`)
- Listar premios activos/inactivos
- Crear nuevo premio
- Editar premio (nombre, puntos requeridos, vigencia)
- Eliminar premio

### 6.5 Asignar Puntos (`/#asignar-puntos`)
- Seleccionar cliente
- Ingresar monto transacción ($)
- Sistema calcula puntos automáticamente según reglas
- Genera transacción en BD

### 6.6 Reglas de Puntos (`/#reglas`)
- Configurar tasas de conversión (ej: $100 = 10 puntos)
- Activar/desactivar reglas
- Ver histórico

### 6.7 Canjes Pendientes (`/#canjes`)
- Listar premios canjeables por cada cliente
- Completar/cancelar canje
- Historial de canjes

### 6.8 Reportes (`/#reportes`)
- Reporte clientes: nombre, puntos actuales, transacciones, estado
- Búsqueda avanzada por nombre/DNI
- Filtros por fecha

### 6.9 Administración (`/#administracion`)
- Crear nuevos admins
- Cambiar contraseña de usuarios
- Activar/desactivar usuarios
- Listar todos usuarios

### 6.10 Registro Público (`/#registro`)
- Formulario sin auth para registrar clientes
- Genera QR con URL de registro (descargable)
- Pre-llena +549 (código Argentina)
- Validaciones: email, whatsapp único

---

## 7. FRONTEND - COMPONENTES REACT

**Componentes principales:**
- `Login.tsx` - Formulario login
- `Dashboard.tsx` - Página principal
- `ClienteSearch.tsx` - Búsqueda/listado clientes
- `PremiosCRUD.tsx` - CRUD premios
- `PremioForm.tsx` - Formulario premios
- `AsignarPuntos.tsx` - Interfaz asignación
- `ReglasCRUD.tsx` - Gestión reglas
- `CanjesPendientes.tsx` - Canjes pendientes
- `Reportes.tsx` - Reportes clientes
- `Administracion.tsx` - Gestión usuarios
- `RegistroCliente.tsx` - Registro público con QR

**UI Framework:** Tailwind CSS (estilos pre-configurados)

---

## 8. QR GENERATION - ESTADO ACTUAL

**Status:** ✅ Funcional

**Librería:** qr-code-styling (v0.1.10)
- Reemplazó qrcode.react (incompatible con Vite)
- Genera PNG de alta calidad
- Canvas customizado

**URL generada:** `http://localhost:3000/#registro`
- Descargable como PNG
- Scaneable con cualquier QR reader

**Problema histórico:** qrcode.react → MISSING_EXPORT error en Vite (RESUELTO)

---

## 9. AUTENTICACIÓN Y SEGURIDAD

### 9.1 Flow de autenticación
1. Admin login con email/password
2. Backend valida contra BD + hash bcryptjs
3. Genera JWT (HS256)
4. Frontend almacena token en state (no localStorage = seguro)
5. Requests incluyen `Authorization: Bearer <token>`

### 9.2 Middleware
- `authMiddleware` - Valida JWT en rutas protegidas
- `adminOnly` - Solo admins pueden acceder
- `errorHandler` - Captura excepciones

### 9.3 Password hashing
- bcryptjs v3.0.3 (salt 10 rounds)
- Almacenado en BD (nunca plaintext)

### 9.4 Validación
- Zod schemas en todas las rutas
- Previene inyección SQL (Prisma ORM)
- Validación front + back

---

## 10. INTENTOS DE DEPLOYMENT

### 10.1 Render.io
**Status:** ❌ Falló
- Config: render.yaml con PostgreSQL
- Error: Database connection refused
- Razón: PostgreSQL setup requerido (complexity)

### 10.2 Vercel
**Status:** ❌ Falló (x3 intentos)
- Config: vercel.json
- Error: API retorna 500 (backend no levanta)
- Razón: Monorepo routing no detectado correctamente

### 10.3 Railway
**Status:** ❌ Falló (build error)
- Config: railway up
- Error: Build failed (logs no accesibles)
- Razón: Probablemente mismo issue que Vercel

**Conclusión:** Proyectos tipo monorepo (backend + frontend separados) requieren configuración específica en cada plataforma. SQLite local funciona en dev pero no escalable a prod.

---

## 11. CONOCIDOS PROBLEMAS / LIMITACIONES

| Problema | Descripción | Solución |
|----------|-------------|----------|
| Deployment | API falla en Vercel/Railway/Render | Usar local o serverless DB |
| Database | SQLite no escalable para prod | Migrar a PostgreSQL + Railway/Heroku |
| Frontend routing | Hash routing (#) en lugar de clean URLs | Necesita SPA fallback en prod |
| WhatsApp | Twilio integración (dummy values) | Configurar credenciales reales |
| Mobile | React Native scaffolding sin completar | Implementar después de estabilizar web |
| E2E tests | Playwright tests parciales | Completar suite |

---

## 12. PRÓXIMOS PASOS / ROADMAP

### Fase 1: Completado ✅
- [x] Auth JWT
- [x] CRUD clientes, premios, transacciones
- [x] Reportes
- [x] Admin management
- [x] QR generation
- [x] Registro público

### Fase 2: En progreso 🔧
- [ ] Notificaciones WhatsApp (Twilio)
- [ ] Push notifications
- [ ] Dashboard móvil
- [ ] Reportes gráficos (charts)

### Fase 3: Pendiente ⏳
- [ ] Mobile app (React Native)
- [ ] E2E test coverage 100%
- [ ] Deployment estable en prod
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)

---

## 13. COMANDOS ÚTILES

### Backend
```bash
cd backend

# Desarrollo
npm run dev          # Levanta servidor + watch mode

# Producción
npm run build        # Compila TypeScript
npm run start        # Ejecuta build compilado

# Base de datos
npx prisma migrate dev      # Crea/aplica migrations
npx prisma studio          # GUI para inspeccionar BD
npx prisma db seed         # Seed datos iniciales

# Testing
npm test             # Ejecuta tests con Vitest
```

### Frontend
```bash
cd web-admin

# Desarrollo
npm run dev          # Levanta Vite dev server

# Producción
npm run build        # Build optimizado (dist/)
npm run preview      # Preview del build

# Linting
npm run lint         # ESLint check
```

### Git
```bash
git log --oneline -10     # Últimos 10 commits
git status                # Estado actual
git diff                  # Ver cambios
```

---

## 14. ARCHIVOS IMPORTANTES

| Archivo | Descripción |
|---------|-------------|
| `backend/src/index.ts` | Entry point API |
| `backend/prisma/schema.prisma` | Schema BD |
| `web-admin/src/App.tsx` | Root component frontend |
| `backend/.env.production` | Env vars producción |
| `.gitignore` | Archivos excluidos git |
| `render.yaml` | Config Render (no funcional) |
| `CLAUDE.md` | Instrucciones agente autónomo |

---

## 15. PARA AGENTES FUTUROS

### Cómo continuar el proyecto:

1. **Clonar y levantar localmente** (ver sección 2)
2. **Revisar memory en Obsidian** - contexto previo disponible
3. **Leer CLAUDE.md** - instrucciones agente autónomo tienda-puntos-agent
4. **Próximos pasos recomendados:**
   - Implementar Fase 2 (WhatsApp notifications)
   - Arreglar deployment (considerar Railway con PostgreSQL)
   - Completar E2E tests con Playwright
   - Containerizar con Docker

### Git Workflow:
```bash
# Crear rama feature
git checkout -b feature/nombre

# Después de cambios
git add .
git commit -m "feat: descripción"
git push origin feature/nombre

# Crear PR o mergear a main
git pull origin main
git merge feature/nombre
git push origin main
```

### Agente autónomo disponible:
```bash
# En Claude Code:
/tienda-puntos-agent: [descripción tarea]
```

---

## 16. CONTACTO / REFERENCIAS

**Usuario:** Alejo Bales (villaloboslote322)  
**Email:** balesalejo@gmail.com  
**GitHub:** https://github.com/villaloboslote322/tienda-puntos  
**Proyecto físico:** House of Panchos (panchería gourmet)

**Documentación:**
- `README.md` - Proyecto overview
- `INSTALACION_LOCAL.md` - Setup guía
- `DEPLOYMENT.md` - Deployment approaches
- `API.md` - API reference

---

**Documento creado:** 2026-07-16 17:30 UTC  
**Agente:** Claude Sonnet (Tienda de Puntos Agent)  
**Status:** Listo para continuar desarrollo | Bloqueado en deployment a internet

