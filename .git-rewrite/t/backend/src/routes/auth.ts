import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import bcryptjs from 'bcryptjs';
import { signToken, verifyToken } from '../config/jwt';
import { loginAdminSchema, loginClienteSchema } from '../models/schemas';
import prisma from '../config/database';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Rate limiter: 5 attempts per 5 minutes
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/admin/login
router.post('/admin/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginAdminSchema.parse(req.body);

    // Find usuario by email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || !usuario.activo) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, usuario.password);
    if (!passwordMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate JWT
    const token = signToken({
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    logger.info(`Admin login successful: ${email}`);
    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/cliente/login
router.post('/cliente/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { whatsapp, dni } = loginClienteSchema.parse(req.body);

    // Find cliente by whatsapp and dni
    const cliente = await prisma.cliente.findFirst({
      where: {
        whatsapp,
        dni,
        estado: 'activo',
      },
    });

    if (!cliente) {
      throw new AppError(401, 'Invalid WhatsApp/DNI combination');
    }

    // Generate JWT for cliente
    const token = signToken({
      userId: cliente.id,
      email: cliente.email || `${cliente.whatsapp}@tienda.local`,
      rol: 'cliente',
    });

    logger.info(`Cliente login successful: ${cliente.whatsapp}`);
    res.json({
      token,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        whatsapp: cliente.whatsapp,
        puntosActuales: cliente.puntosActuales,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing authorization header');
    }

    const token = authHeader.substring(7);

    // Verify current token
    const decoded = verifyToken(token);

    // Generate new token
    const newToken = signToken(decoded);

    logger.info(`Token refreshed for user: ${decoded.userId}`);
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
});

export default router;
