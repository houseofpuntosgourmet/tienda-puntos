import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin user...");
  
  const hashedPassword = bcryptjs.hashSync("admin123", 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@tiendapuntos.local" },
    update: {
      password: hashedPassword,
      rol: "admin",
      activo: true
    },
    create: {
      email: "admin@tiendapuntos.local",
      password: hashedPassword,
      nombre: "Admin",
      rol: "admin",
      activo: true
    }
  });

  console.log("✅ Admin user:", admin.email);
  await prisma.$disconnect();
}

main().catch(console.error);
