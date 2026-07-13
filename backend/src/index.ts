import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
