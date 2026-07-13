// Must load dotenv FIRST before importing anything that uses environment variables
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
