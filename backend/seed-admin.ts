// Crea (o actualiza) el usuario admin sobre la base a la que apunte DATABASE_URL:
// en local la de .env.local, en produccion la de Neon.
//
//   npx ts-node seed-admin.ts
//
// La contrasena sale de ADMIN_PASSWORD. Si no esta definida, genera una al azar y la
// deja en .env.admin.local en vez de imprimirla, para que no quede en el historial de
// la terminal ni en los logs. Ese archivo lo tapa el .env* del .gitignore.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcryptjs from 'bcryptjs';
import prisma from './src/config/database';

const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@tiendapuntos.local';
const ARCHIVO = path.join(__dirname, '.env.admin.local');

async function main() {
  const generada = !process.env.ADMIN_PASSWORD;
  const password = process.env.ADMIN_PASSWORD ?? crypto.randomBytes(12).toString('base64url');
  const hash = bcryptjs.hashSync(password, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: EMAIL },
    update: { password: hash, rol: 'admin', activo: true },
    create: { email: EMAIL, password: hash, nombre: 'Admin', rol: 'admin', activo: true },
  });

  console.log(`Admin listo: ${admin.email}`);

  if (generada) {
    fs.writeFileSync(ARCHIVO, `ADMIN_EMAIL=${EMAIL}\nADMIN_PASSWORD=${password}\n`);
    console.log(`Contrasena generada al azar, guardada en backend/${path.basename(ARCHIVO)} (no se commitea).`);
  } else {
    console.log('Contrasena tomada de ADMIN_PASSWORD.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
