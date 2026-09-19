// La app de Express, sin app.listen: Vercel la toma de acá como función
// (detecta src/app.ts y usa el export default). Para correrla en local, src/index.ts.
import './config/env';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import clientesRoutes from './routes/clientes';
import transaccionesRoutes from './routes/transacciones';
import reglasRoutes from './routes/reglas';
import premiosRoutes from './routes/premios';
import canjesRoutes from './routes/canjes';
import reportesRoutes from './routes/reportes';
import usuariosRoutes from './routes/usuarios';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware, adminOnly } from './middleware/auth';

const app = express();

// Detrás del proxy de Vercel: sin esto el rate limiter ve a todos con la misma IP.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

const health = (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
};
app.get('/health', health);
// También bajo /api, para chequearlo a través del sitio público (que sólo reenvía /api/*).
app.get('/api/health', health);

// Diagnóstico de la base. Sólo admin: devuelve datos de un cliente.
app.get('/api/diag', authMiddleware, adminOnly, async (req, res) => {
  const prisma = require('./config/database').default;
  try {
    const clientCount = await prisma.cliente.count();
    const premioCount = await prisma.premio.count();
    const premiosActivos = await prisma.premio.count({ where: { activo: true } });
    const canjeCount = await prisma.canje.count();

    const primeraCliente = await prisma.cliente.findFirst();

    res.json({
      clientCount,
      premioCount,
      premiosActivos,
      canjeCount,
      primeraCliente: primeraCliente ? { id: primeraCliente.id, nombre: primeraCliente.nombre, puntosActuales: primeraCliente.puntosActuales } : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Admin canjes routes
app.use('/api/admin/canjes', canjesRoutes);

// Clientes routes
app.use('/api/clientes', clientesRoutes);

// Transacciones routes
app.use('/api/transacciones', transaccionesRoutes);

// Reglas routes
app.use('/api/reglas', reglasRoutes);

// Premios routes
app.use('/api/premios', premiosRoutes);

// Reportes routes
app.use('/api/reportes', reportesRoutes);

// Usuarios routes
app.use('/api/usuarios', usuariosRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
