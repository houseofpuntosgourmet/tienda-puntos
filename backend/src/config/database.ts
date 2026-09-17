import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL: la base es Postgres (Neon), ver backend/.env.example');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

// Reusar una sola instancia: en dev evita conexiones duplicadas al recargar,
// y en Vercel la misma función atiende varios pedidos seguidos.
const prisma = global.prisma ?? new PrismaClient({ adapter });
global.prisma = prisma;

export default prisma;
