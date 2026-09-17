// Servidor para correr en local (npm run dev). En Vercel no se usa: la función sale de src/app.ts.
import 'dotenv/config';

import app from './app';
import logger from './utils/logger';
import { initCumpleañosJob } from './jobs/cumpleañosJob';

const PORT = parseInt(process.env.PORT || '3001', 10);

logger.info(`About to listen on port ${PORT}`);
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info('Server is ready to accept requests');
});

server.on('error', (err) => {
  logger.error(`Server error: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});

// Initialize scheduled jobs
// TODO: Fix Prisma initialization before enabling
// initCumpleañosJob();

export default app;
