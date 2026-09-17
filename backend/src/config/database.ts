import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL: la base es Postgres (Neon), ver backend/.env.example');
}

function crearCliente() {
  const pool = new Pool({ connectionString: databaseUrl });
  // En Vercel suelta las conexiones ociosas antes de que la función se suspenda;
  // sin esto, al despertar puede usar una conexión que Neon ya cerró.
  attachDatabasePool(pool);
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

// Reusar una sola instancia: en dev evita conexiones duplicadas al recargar,
// y en Vercel la misma función atiende varios pedidos seguidos.
const prisma = global.prisma ?? crearCliente();
global.prisma = prisma;

export default prisma;
