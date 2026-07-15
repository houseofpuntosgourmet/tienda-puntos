import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = bcryptjs.hashSync("admin123", 10);
  await prisma.usuario.create({
    data: {
      email: "admin@tiendapuntos.local",
      password: adminHash,
      nombre: "Admin",
      rol: "admin",
      activo: true
    }
  });

  await prisma.reglaPuntos.create({
    data: {
      nombre: "Standard",
      montoBase: 9000,
      puntosOtorgados: 10,
      activa: true
    }
  });

  await prisma.premio.create({
    data: {
      nombre: "Wine Bottle",
      puntosRequeridos: 100,
      activo: true
    }
  });

  await prisma.premio.create({
    data: {
      nombre: "20% Discount",
      puntosRequeridos: 50,
      activo: true
    }
  });

  await prisma.cliente.create({
    data: {
      nombre: "Test Client",
      whatsapp: "+541112345678",
      dni: "12345678",
      email: "test@example.com",
      puntosActuales: 150
    }
  });

  console.log("✅ Seed complete!");
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
