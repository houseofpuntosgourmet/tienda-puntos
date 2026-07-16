import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { reportesService } from '../services/reportesService';
import { authMiddleware, adminOnly } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

const busquedaSchema = z.object({
  termino: z.string().min(1),
});

// GET /api/reportes/clientes - get all clients with detailed reports
router.get(
  '/clientes',
  authMiddleware,
  adminOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportes = await reportesService.obtenerReportesClientes();
      res.json(reportes);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/reportes/clientes/buscar/:termino - search clients in reports
router.get(
  '/clientes/buscar/:termino',
  authMiddleware,
  adminOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const termino = String(req.params.termino);
      const reportes = await reportesService.buscarClientesReporte(termino);
      res.json(reportes);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
