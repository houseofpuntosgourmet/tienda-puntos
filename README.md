# Tienda Puntos

A comprehensive loyalty points management system for retail businesses. Manage customer points, track transactions, and enable seamless redemptions across multiple channels.

## Features

### For Customers
- **Mobile App** (iOS/Android) - Easy registration and points tracking
- **Real-time Balance** - View available points instantly
- **Transaction History** - Track all points earned and redeemed
- **SMS Notifications** - Receive updates on points changes via WhatsApp/SMS
- **Quick Registration** - Register with name, phone, and DNI only

### For Admins
- **Web Dashboard** - Manage customers and points
- **Assign Points** - Award points for purchases manually
- **Transaction Reports** - Track all customer transactions
- **Customer Management** - View and search customer database
- **Analytics & Stats** - Monitor system metrics and KPIs

### Technical Features
- **Scalable API** - RESTful Express.js backend
- **Real-time Updates** - WebSocket-ready architecture
- **Secure Authentication** - JWT-based auth with role-based access
- **Rate Limiting** - Built-in protection against abuse
- **Multi-platform** - Web, mobile, and admin interfaces
- **Docker Ready** - Production-grade containerization
- **E2E Testing** - Playwright test suite included
- **Comprehensive Docs** - Full API and setup documentation

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **SMS Gateway:** Twilio
- **Validation:** Zod
- **Logging:** Winston

### Frontend (Web Admin)
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **API Client:** Axios
- **Language:** TypeScript

### Mobile
- **Framework:** React Native 0.86
- **Platform:** Expo (iOS/Android)
- **Routing:** Expo Router
- **Storage:** AsyncStorage & Secure Store

### DevOps
- **Containerization:** Docker & Docker Compose
- **Testing:** Playwright, Vitest
- **Version Control:** Git
- **CI/CD Ready:** Deploy to Render, Railway, or self-hosted

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+ (or use Docker)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/tienda-puntos.git
cd tienda-puntos
npm install --workspaces
```

### 2. Environment Setup
```bash
# Create .env.local with your configuration
# See docs/SETUP.md for full configuration
cp .env.example .env.local

# Set required variables:
# - DATABASE_URL
# - JWT_SECRET
# - TWILIO credentials
```

### 3. Database Setup
```bash
cd backend
npx prisma migrate dev
npx prisma db seed  # Optional: seed with test data
```

### 4. Start Development
```bash
# Terminal 1 - Backend API
cd backend && npm run dev

# Terminal 2 - Web Admin
cd web-admin && npm run dev

# Terminal 3 - Mobile (optional)
cd mobile && npm start
```

### 5. Verify
```bash
curl http://localhost:3001/health
# {"status":"ok","timestamp":"..."}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Clients & Users                       │
│         (Mobile App + Web Admin + API Consumers)        │
└──────────┬─────────────────────────────────┬────────────┘
           │                                 │
           ▼                                 ▼
    ┌──────────────┐            ┌──────────────────┐
    │ Web Admin    │            │ Mobile App       │
    │ (React/Vite)│            │ (React Native)   │
    └──────┬───────┘            └────────┬─────────┘
           │                             │
           └──────────────┬──────────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │  Backend API   │
                  │  (Express.js)  │
                  │  Port: 3001    │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ PostgreSQL DB  │
                  │  Port: 5432    │
                  └────────────────┘
```

## Documentation

- **[API Reference](./docs/API.md)** - Complete endpoint documentation
- **[Setup Guide](./docs/SETUP.md)** - Local and production setup
- **[Deployment](./deploy/DEPLOYMENT.md)** - Deploy to Render, Railway, or Docker
- **[Render Setup](./deploy/render/render.md)** - Render.com deployment
- **[Railway Setup](./deploy/railway/railway.md)** - Railway.app deployment

## Project Structure

```
tienda-puntos/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── index.ts        # Entry point
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, etc.
│   │   └── services/       # Business logic
│   ├── prisma/             # Database schema & migrations
│   ├── Dockerfile          # Production image
│   └── package.json
├── web-admin/              # React admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   ├── Dockerfile          # Nginx production image
│   ├── nginx.conf
│   └── package.json
├── mobile/                 # React Native mobile app
│   ├── app/                # Expo Router
│   ├── app.json            # Expo config
│   └── package.json
├── docs/                   # Documentation
│   ├── API.md
│   └── SETUP.md
├── deploy/                 # Deployment configs
│   ├── render/
│   └── railway/
└── docker-compose*.yml     # Container orchestration
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new cliente
- `POST /auth/login` - Login as cliente
- `POST /auth/admin-login` - Login as admin

### Cliente (Protected)
- `GET /cliente/perfil` - Get profile
- `GET /cliente/historial` - Get transaction history

### Admin (Protected)
- `POST /admin/asignar-puntos` - Assign points
- `POST /admin/usar-puntos` - Deduct points
- `GET /admin/clientes` - List customers
- `GET /admin/transacciones` - List all transactions
- `GET /admin/estadisticas` - System statistics

See [API.md](./docs/API.md) for complete documentation with examples.

## Testing

### Unit & Integration Tests
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### E2E Tests
```bash
npm run test:e2e         # Run Playwright tests
npm run test:e2e:ui      # Interactive UI
```

## Deployment

### Option 1: Render (Easiest)
```bash
# Push to GitHub and connect Render Blueprint
# render.yaml automatically deploys all services
# See deploy/render/render.md
```

### Option 2: Railway
```bash
npm install -g @railway/cli
railway login
railway up
# See deploy/railway/railway.md
```

### Option 3: Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

See [Deployment Guide](./deploy/DEPLOYMENT.md) for detailed instructions.

## Configuration

### Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/tienda_puntos

# API
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=24h

# SMS Gateway (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Logging
LOG_LEVEL=debug
```

## Security

- JWT authentication with 24-hour expiration
- Password hashing with bcryptjs
- Rate limiting (5/min for auth, 100/min for others)
- CORS protection
- Input validation with Zod
- SQL injection protection via Prisma ORM
- Secure headers via Helmet
- Environment variable isolation

## Performance

- Connection pooling for database
- Gzip compression on responses
- Nginx caching for static assets
- Rate limiting to prevent abuse
- Query optimization with Prisma
- Indexed database fields

## Monitoring & Logging

- Winston logging to console and files
- Health check endpoint: `GET /health`
- Transaction audit trail
- Admin action logging
- Error tracking (Sentry-ready)

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push: `git push origin feature/my-feature`
4. Create Pull Request

## Roadmap

- [ ] WhatsApp integration (beyond SMS)
- [ ] Points expiration rules
- [ ] Redemption catalog
- [ ] Customer loyalty tiers
- [ ] Marketing campaigns
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] Webhook integrations

## Troubleshooting

### Backend won't start
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check port 3001 is available

### Frontend can't reach API
- Verify `VITE_API_URL` is correct
- Check backend is running on port 3001
- Check CORS is enabled

### Database issues
- Run migrations: `npx prisma migrate dev`
- Check database exists and user has permissions
- View logs: `docker-compose logs postgres`

See [SETUP.md](./docs/SETUP.md) for more troubleshooting.

## License

MIT License - See LICENSE file for details

## Support

- **Documentation:** See `/docs` directory
- **Issues:** Report on GitHub
- **Questions:** Check API and Setup guides first

## Related Links

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Docker Docs](https://docs.docker.com/)

---

Built with ❤️ for modern retail loyalty management.
