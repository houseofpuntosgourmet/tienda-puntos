import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../config/database';
import bcryptjs from 'bcryptjs';

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Create test admin user
    const hashedPassword = await bcryptjs.hash('password123', 10);
    await prisma.usuario.create({
      data: {
        email: 'test@admin.com',
        password: hashedPassword,
        nombre: 'Test Admin',
        rol: 'admin',
      },
    });

    // Create test cliente
    await prisma.cliente.create({
      data: {
        nombre: 'Test Cliente',
        whatsapp: '+5491234567890',
        dni: '12345678',
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.usuario.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.$disconnect();
  });

  it('POST /api/auth/admin/login - success', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({
        email: 'test@admin.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.usuario.email).toBe('test@admin.com');
  });

  it('POST /api/auth/admin/login - invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({
        email: 'test@admin.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/admin/login - missing user', async () => {
    const response = await request(app)
      .post('/api/auth/admin/login')
      .send({
        email: 'nonexistent@admin.com',
        password: 'password123',
      });

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/cliente/login - success', async () => {
    const response = await request(app)
      .post('/api/auth/cliente/login')
      .send({
        whatsapp: '+5491234567890',
        dni: '12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.cliente.nombre).toBe('Test Cliente');
  });

  it('POST /api/auth/cliente/login - invalid combination', async () => {
    const response = await request(app)
      .post('/api/auth/cliente/login')
      .send({
        whatsapp: '+5491234567890',
        dni: 'wrongdni',
      });

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/refresh - success', async () => {
    // First get a token
    const loginResponse = await request(app)
      .post('/api/auth/admin/login')
      .send({
        email: 'test@admin.com',
        password: 'password123',
      });

    const token = loginResponse.body.token;

    // Then refresh it
    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${token}`);

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.token).toBeDefined();
  });

  it('POST /api/auth/refresh - missing token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh');

    expect(response.status).toBe(401);
  });
});
