// Config del CLI de Prisma (migrate, studio, generate).
import "dotenv/config";
import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Igual que src/config/env.ts: .env.local primero, porque es donde `vercel env pull`
// deja la DATABASE_URL de Neon. dotenv no pisa lo que ya esta en process.env.
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

// Las migraciones van por la conexion DIRECTA, no por el pooler de Neon: PgBouncer
// no soporta las sentencias que usa migrate (advisory locks, DDL en transaccion).
// En runtime la app si usa la pooled, que es la que necesita el serverless.
const urlMigraciones =
  process.env["DATABASE_URL_UNPOOLED"] ??
  process.env["POSTGRES_URL_NON_POOLING"] ??
  process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: urlMigraciones,
  },
});
