import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import logger from '../utils/logger';
import { AuthRequest } from '../models/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequest;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    (req as AuthRequest & Request).user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthRequest & Request).user;
    if (!user || (user.rol !== 'admin' && user.rol !== 'super_admin')) {
      return res.status(403).json({ error: 'Admin role required' });
    }
    next();
  } catch (error) {
    logger.error('Admin check error', error);
    res.status(403).json({ error: 'Forbidden' });
  }
}
