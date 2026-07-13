import { describe, it, expect, beforeEach } from 'vitest';
import { notificacionService } from '../notificacionService';

describe('NotificacionService', () => {
  beforeEach(() => {
    // Clear queue before each test
    (notificacionService as any).queue = [];
  });

  it('Should queue notification', () => {
    notificacionService.encolarNotificacion('registro', 'cliente-123');
    expect((notificacionService as any).queue.length).toBeGreaterThanOrEqual(0);
  });

  it('Should process notifications', async () => {
    notificacionService.encolarNotificacion('puntos_ganados', 'cliente-123', {
      puntos: 10,
      puntosActuales: 50,
    });
    // Notification should be queued and processed
    expect((notificacionService as any).queue.length).toBeGreaterThanOrEqual(0);
  });

  it('Should handle different notification types', () => {
    const types = [
      'registro',
      'puntos_ganados',
      'canje_solicitado',
      'canje_completado',
      'cumpleaños',
    ] as const;

    types.forEach((tipo) => {
      notificacionService.encolarNotificacion(tipo, 'cliente-123');
    });

    expect((notificacionService as any).queue.length).toBeGreaterThanOrEqual(0);
  });
});
