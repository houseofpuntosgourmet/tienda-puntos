import jwt, { VerifyOptions } from 'jsonwebtoken';
import { JWTPayload } from '../models/types';
import logger from '../utils/logger';

// For HS256, we need the same key for both signing and verification
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_PRIVATE_KEY || 'dev-secret-key';

export function signToken(payload: JWTPayload, expiresIn = '24h'): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
  } catch (error) {
    logger.error('Error signing token', error);
    throw error;
  }
}

export function verifyToken(token: string): JWTPayload {
  try {
    const options: VerifyOptions = {
      algorithms: ['HS256'],
    };
    return jwt.verify(token, JWT_SECRET, options) as JWTPayload;
  } catch (error) {
    logger.error('Token verification failed', error);
    throw new Error('Invalid or expired token');
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload | null;
  } catch (error) {
    logger.error('Token decode failed', error);
    return null;
  }
}
