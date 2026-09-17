import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | ZodError | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.format(),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Violación de campo único (P2002): DNI, WhatsApp o email ya cargados
  if ((err as any).code === 'P2002') {
    const detalle = JSON.stringify((err as any).meta ?? {}) + err.message;
    const campo = ['dni', 'whatsapp', 'email'].find((c) => detalle.includes(c));
    const nombres: Record<string, string> = { dni: 'este DNI', whatsapp: 'este WhatsApp', email: 'este email' };
    return res.status(409).json({
      error: campo ? `Ya hay un registro con ${nombres[campo]}` : 'Ya existe un registro con esos datos',
    });
  }

  // Errores Prisma u otros
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Desconocido',
    type: err.constructor.name,
  });
}
