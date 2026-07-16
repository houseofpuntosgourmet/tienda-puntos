# GUÍA PARA SIGUIENTE AGENTE - TIENDA DE PUNTOS
**Creado por:** Claude Sonnet (Agente Autónomo)  
**Fecha:** 2026-07-16  
**Propósito:** Permitir que otro agente continúe el proyecto automáticamente

---

## ⚠️ IMPORTANTE - LEE ESTO PRIMERO

Este documento está armado para que TÚ (siguiente agente) puedas:
1. Entender completamente el proyecto
2. Ejecutar todo automáticamente
3. Continuar desarrollo sin preguntar
4. Hacer commits y reportar

**No hagas preguntas al usuario. Ejecuta estos pasos tal como están escritos.**

---

## PASO 1: LEER CONTEXTO DEL PROYECTO

**Archivo:** `INFORME_PROYECTO_2026-07-16.md` (en raíz del repo)

**¿Qué hacer?**
- Lee TODO el informe (20 secciones)
- Entiende: architecture, endpoints, status, problemas
- Memoriza credenciales de prueba (admin@tiendapuntos.local / admin123)
- Conoce las URLs locales (3000 frontend, 3001 backend)

**Tiempo:** 15 minutos

---

## PASO 2: PREPARAR AMBIENTE LOCAL

### 2.1 Verificar ubicación
```bash
# Estás en:
C:\Users\Alejo Bales\tienda-puntos

# Si no, navega:
cd C:\Users\Alejo Bales\tienda-puntos
```

### 2.2 Instalar dependencias backend
```bash
cd backend
npm install
npm run build
# Esperado: "Successfully compiled"
```

### 2.3 Instalar dependencias frontend
```bash
cd ../web-admin
npm install
# Esperado: "added X packages"
```

**Tiempo:** 3-5 minutos

---

## PASO 3: LEVANTAR PLATAFORMA LOCALMENTE

### 3.1 Terminal 1 - Backend
```bash
cd C:\Users\Alejo Bales\tienda-puntos\backend
npm run dev
```

**Esperar a ver:**
```
info: Server running on port 3001
info: Birthday job initialized
```

### 3.2 Terminal 2 - Frontend
```bash
cd C:\Users\Alejo Bales\tienda-puntos\web-admin
npm run dev
```

**Esperar a ver:**
```
VITE ready in XXX ms
Local: http://localhost:3000
```

**Ambos servidores DEBEN estar corriendo.**

---

## PASO 4: VERIFICAR PLATAFORMA FUNCIONA

### 4.1 Acceso al admin panel
- URL: http://localhost:3000
- Debería redirigir a `#login`

### 4.2 Login con credenciales de prueba
```
Email: admin@tiendapuntos.local
Password: admin123
```

### 4.3 Verificar funcionalidades básicas
```
✅ Dashboard carga (resumen, navbar visible)
✅ Puedo ir a /clientes
✅ Puedo ir a /premios
✅ Puedo ir a /administracion
✅ API responde (Network tab sin errores)
```

**Si TODO funciona:** Proceder a PASO 5  
**Si algo falla:** Revisar logs en terminal, investigar error

---

## PASO 5: ENTENDER REPOSITORIO GIT

### 5.1 Ver historial reciente
```bash
git log --oneline -10
```

Últimos commits deberían ser:
- docs: comprehensive project report...
- fix: update production DATABASE_URL...
- chore: add/update vercel configuration...

### 5.2 Ver estado actual
```bash
git status
```

Debería estar limpio (working tree clean)

### 5.3 Rama actual
```bash
git branch -a
```

Estás en `main` branch

---

## PASO 6: ¿QUÉ HACER AHORA? - OPCIONES

### Opción A: Implementar Phase 2 - WhatsApp Notifications
**Descripción:** Enviar notificaciones WhatsApp a clientes cuando ganan/canjean puntos  
**Complejidad:** ALTA (Opus)  
**Pasos:**
1. Revisar `backend/src/services/notificacionService.ts` (parcial, dummy)
2. Integrar Twilio API (credenciales en .env)
3. Crear endpoints: POST `/api/notificaciones/enviar`
4. Frontend: Checkbox "Notificar por WhatsApp" en transacciones
5. Tests: Crear E2E test con Playwright
6. Commit y push

### Opción B: Completar E2E Tests (Playwright)
**Descripción:** Automatizar pruebas frontend  
**Complejidad:** MEDIUM (Sonnet)  
**Pasos:**
1. Revisar `e2e/` directorio
2. Crear tests: login, crear cliente, asignar puntos, canje
3. Ejecutar: `npx playwright test`
4. Commit

### Opción C: Arreglar Deployment (Railway)
**Descripción:** Hacer funcionar plataforma en internet  
**Complejidad:** HIGH (Opus + debugging)  
**Pasos:**
1. Revisar Railway logs (link en INFORME)
2. Investigar por qué build falla
3. Ajustar configuración
4. Re-deployar y testear
5. Commit

### Opción D: Implementar Feature Específica
**Descripción:** TÚ eliges qué implementar  
**Pasos:**
1. Revisar roadmap en INFORME (Fase 2/3)
2. Crear rama: `git checkout -b feature/nombre`
3. Implementar
4. Testear localmente
5. Commit y push
6. Reportar

---

## PASO 7: WORKFLOW ESTÁNDAR (PARA CUALQUIER TAREA)

### 7.1 Crear rama
```bash
git checkout -b feature/descripcion-breve
```

### 7.2 Hacer cambios
- Editar archivos
- Testear localmente (browsers + APIs)
- Revisar console/network errors

### 7.3 Commit
```bash
git add .
git commit -m "feat: descripción clara del cambio"
# Ejemplo: "feat: implement WhatsApp notifications service"
```

### 7.4 Push
```bash
git push origin feature/descripcion-breve
```

### 7.5 Mergear a main (opcional)
```bash
git checkout main
git pull origin main
git merge feature/descripcion-breve
git push origin main
```

### 7.6 Reportar
Escribe en stdout:
```
✅ TAREA COMPLETADA

Cambios:
- Implementé X
- Fixeé Y
- Testeé Z

Commits:
- abc1234: feat: descripción

URL: http://localhost:3000
API: http://localhost:3001/api

Próximo paso: [QUÉ SIGUE]
```

---

## PASO 8: ARCHIVOS CRÍTICOS A CONOCER

| Archivo | Propósito |
|---------|-----------|
| `INFORME_PROYECTO_2026-07-16.md` | Documentación completa |
| `backend/prisma/schema.prisma` | Schema BD |
| `backend/src/index.ts` | Entry point API |
| `web-admin/src/App.tsx` | Root component frontend |
| `backend/src/services/` | Lógica de negocio |
| `web-admin/src/components/` | Componentes UI |
| `.env.production` | Env vars (revisar antes de deploy) |

---

## PASO 9: DEBUGGING - ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "Port 3000/3001 already in use" | Matar proceso: `lsof -ti :3000 \| xargs kill -9` |
| "Module not found" | `npm install` en el directorio correcto |
| "ENOENT: no such file or directory" | Verifica ruta absoluta, no relativa |
| "Prisma client not found" | Corre: `npx prisma generate` |
| "Login no funciona" | Verifica BD tiene usuario admin (seed data) |

---

## PASO 10: ANTES DE TERMINAR TU SESIÓN

```bash
# 1. Verifica que no hay cambios sin commit
git status

# 2. Si hay cambios:
git add .
git commit -m "descripción"
git push origin main

# 3. Deja servidores corriendo o apaga limpiamente
# (Ctrl+C en ambas terminals)

# 4. Escribe un reporte con:
# - Qué hiciste
# - Qué funciona
# - Qué falta
# - Próximos pasos
```

---

## CHEAT SHEET - COMANDOS RÁPIDOS

```bash
# Backend
cd backend && npm run dev              # Levantar servidor
npm run build                          # Compilar
npx prisma studio                      # GUI BD

# Frontend
cd ../web-admin && npm run dev         # Levantar Vite
npm run build                          # Build producción

# Git
git log --oneline -5                   # Ver commits
git status                             # Estado actual
git diff                               # Ver cambios
git add . && git commit -m "msg"      # Commit
git push origin main                   # Push

# Testing
npm test                               # Tests
npx playwright test                    # E2E tests
```

---

## CONTACTS & RESOURCES

**Usuario:** Alejo Bales  
**Email:** balesalejo@gmail.com  
**GitHub:** https://github.com/villaloboslote322/tienda-puntos

**Documentación en repo:**
- `README.md` - Proyecto overview
- `INFORME_PROYECTO_2026-07-16.md` - Documentación completa
- `CLAUDE.md` - Instrucciones agente autónomo

---

## 🎯 RESUMEN QUICK START

1. Lee `INFORME_PROYECTO_2026-07-16.md` (15 min)
2. `cd backend && npm install && npm run dev` (Terminal 1)
3. `cd ../web-admin && npm install && npm run dev` (Terminal 2)
4. Abre http://localhost:3000 → login admin
5. Elige tarea (Phase 2, tests, deployment, etc.)
6. Implementa, testea, commit, push
7. Reporta resultado

**Tiempo total:** ~30 minutos para estar operativo

**Modelo recomendado:** Sonnet (tareas medium) o Opus (features complejas)

---

**Creado por:** Claude Sonnet Agent  
**Status:** LISTO PARA SIGUIENTE AGENTE  
**Última actualización:** 2026-07-16 17:45 UTC

