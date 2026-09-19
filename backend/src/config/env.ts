// Carga las variables locales. En Vercel no existen los archivos .env y las variables
// reales ya vienen en process.env: dotenv no pisa lo que ya está definido, así que
// importar esto en producción no hace nada.
//
// El orden importa: .env.local primero, porque es el archivo que escribe
// `vercel env pull` (ahí cae la DATABASE_URL de Neon). .env queda como fallback.
import dotenv from 'dotenv';
import path from 'path';

const raizBackend = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(raizBackend, '.env.local') });
dotenv.config({ path: path.join(raizBackend, '.env') });
