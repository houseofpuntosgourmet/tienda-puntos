# Setup Guide - Tienda Puntos

## Prerequisites

Before starting, ensure you have:

- **Node.js:** v18.0.0 or higher
  - Download: https://nodejs.org/

- **npm:** v9.0.0 or higher
  - Comes with Node.js

- **PostgreSQL:** v14.0 or higher (for production)
  - Download: https://www.postgresql.org/download/
  - Or use Docker: See [Docker Setup](#docker-setup-local) section

- **Git:** For version control
  - Download: https://git-scm.com/

- **Docker & Docker Compose:** (Optional, for containerized setup)
  - Download: https://www.docker.com/products/docker-desktop

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/tienda-puntos.git
cd tienda-puntos
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install web-admin dependencies
cd ../web-admin
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Return to project root
cd ..
```

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb tienda_puntos

# Set connection string in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/tienda_puntos"
```

#### Option B: Docker (Recommended)

```bash
# Start PostgreSQL container
docker run -d \
  --name tienda-puntos-db \
  -e POSTGRES_DB=tienda_puntos \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Environment Variables

Create `.env.local` in project root:

```bash
# Backend Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tienda_puntos
NODE_ENV=development
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h

# Twilio (SMS Gateway)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Logging
LOG_LEVEL=debug
```

**Get Twilio Credentials:**
1. Sign up at https://www.twilio.com/
2. Verify phone number
3. Get Account SID from Dashboard
4. Generate Auth Token
5. Get phone number from phone numbers section

### 5. Database Migrations

```bash
cd backend

# Install Prisma CLI (if not already installed)
npm install -g prisma

# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 6. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Web Admin:**
```bash
cd web-admin
npm run dev
# Web Admin runs on http://localhost:5173
```

**Terminal 3 - Mobile (Optional):**
```bash
cd mobile
npm start
# Expo runs on http://localhost:8081
```

### 7. Verify Setup

```bash
# Check backend health
curl http://localhost:3001/health

# Should return:
# {"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

### 8. Create Admin User

```bash
# Using backend API
curl -X POST http://localhost:3001/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'

# Or through database directly
cd backend
npx prisma studio  # Opens GUI for database management
```

## Docker Setup (Local)

### Quick Start

```bash
# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f
```

### Services

- **Backend:** http://localhost:3001
- **Web Admin:** http://localhost:5173
- **PostgreSQL:** localhost:5432

### Common Docker Commands

```bash
# Stop all services
docker-compose down

# View logs for specific service
docker-compose logs -f backend

# Rebuild images
docker-compose up -d --build

# Remove volumes (reset database)
docker-compose down -v
```

## Production Setup

### Prerequisites

- Docker and Docker Compose installed
- Server with at least 2GB RAM
- Stable internet connection
- Domain name (optional but recommended)

### Steps

1. **Prepare Environment:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build Production Images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Run Production Stack:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Verify Deployment:**
   ```bash
   curl http://your-server:3001/health
   ```

5. **Configure Reverse Proxy (Optional):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:3001;
       }

       location / {
           proxy_pass http://localhost:80;
       }
   }
   ```

### See Also

For detailed deployment instructions, see:
- [Deployment Guide](../deploy/DEPLOYMENT.md)
- [Render Deployment](../deploy/render/render.md)
- [Railway Deployment](../deploy/railway/railway.md)

## Troubleshooting

### Database Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
# Local: Check Database app is running
# Docker: Check container
docker ps | grep postgres

# Verify DATABASE_URL in .env.local
# Default: postgresql://postgres:postgres@localhost:5432/tienda_puntos
```

### Port Already in Use

**Error:** `listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Prisma Migration Errors

**Error:** `Error: P1002 There is a unique constraint violation on the fields: ...`

**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
cd backend
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

### Node Modules Issues

**Error:** Module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For all packages
rm -rf backend/node_modules web-admin/node_modules mobile/node_modules
npm install --workspaces
```

### Twilio SMS Not Sending

1. Verify Twilio credentials in .env.local
2. Check phone number is verified in Twilio
3. Check Twilio account has credits
4. Look at backend logs for error messages

```bash
# View backend logs
docker-compose logs backend | grep -i twilio
```

## Development Best Practices

### Code Formatting

```bash
# Format code with Prettier
npm run format

# Check linting
npm run lint
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test with UI
npm run test:e2e:ui
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: describe your feature"

# Push and create PR
git push origin feature/my-feature
```

### Environment Variables

- Never commit .env files
- Add to .gitignore: `.env`, `.env.local`, `.env.*.local`
- Share .env.example template with actual values removed

## Project Structure

```
tienda-puntos/
├── backend/                 # Express.js API
│   ├── src/
│   ├── prisma/             # Database schema
│   ├── Dockerfile
│   └── package.json
├── web-admin/              # React + Vite admin dashboard
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── mobile/                 # React Native + Expo mobile app
│   ├── app/
│   ├── package.json
│   └── app.json
├── docs/                   # Documentation
│   ├── API.md
│   └── SETUP.md
├── deploy/                 # Deployment configs
│   ├── render/
│   └── railway/
├── docker-compose.yml      # Development stack
├── docker-compose.prod.yml # Production stack
└── .env.local              # Local environment (git-ignored)
```

## Next Steps

1. **Explore API:** See [API.md](./API.md) for endpoint documentation
2. **Create Admin User:** Set up admin credentials
3. **Test Registration:** Try cliente registration flow
4. **Deploy:** Follow [Deployment Guide](../deploy/DEPLOYMENT.md)
5. **Customize:** Modify business logic in backend/src/

## Getting Help

- **Issues:** Check GitHub Issues
- **API Questions:** See [API.md](./API.md)
- **Deployment:** See [Deployment Guide](../deploy/DEPLOYMENT.md)
- **Code:** Check `/backend`, `/web-admin`, `/mobile` directories

## Quick Commands Reference

```bash
# Development
npm run dev           # Start all services
npm run build         # Build for production
npm run test          # Run tests
npm run test:e2e      # Run E2E tests

# Database
npx prisma migrate dev      # Create and apply migrations
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema to database

# Docker
docker-compose up -d       # Start containers
docker-compose down        # Stop containers
docker-compose logs -f     # View logs

# Deployment
docker-compose -f docker-compose.prod.yml up -d  # Start production
```

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Guide](https://docs.docker.com/)
