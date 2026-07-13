import { twilioService } from '../config/twilio';
import { clienteService } from './clienteService';
import logger from '../utils/logger';

export type NotificacionTipo =
  | 'registro'
  | 'puntos_ganados'
  | 'canje_solicitado'
  | 'canje_completado'
  | 'cumpleaños';

export class NotificacionService {
  private queue: Array<{
    tipo: NotificacionTipo;
    clienteId: string;
    datos?: any;
  }> = [];

  encolarNotificacion(
    tipo: NotificacionTipo,
    clienteId: string,
    datos?: any
  ): void {
    this.queue.push({ tipo, clienteId, datos });
    logger.info(`Notification queued: ${tipo} for cliente ${clienteId}`);
    // Process immediately in dev mode
    this.procesarCola();
  }

  private async procesarCola(): Promise<void> {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      try {
        const cliente = await clienteService.buscarCliente(item.clienteId);
        if (!cliente) continue;

        let mensaje = '';
        switch (item.tipo) {
          case 'registro':
            mensaje = `¡Bienvenido a Tienda de Puntos! Tu registro fue exitoso.`;
            break;
          case 'puntos_ganados':
            mensaje = `🎉 Ganaste ${item.datos?.puntos || 0} puntos. Total actual: ${item.datos?.puntosActuales || 0}`;
            break;
          case 'canje_solicitado':
            mensaje = `Tu solicitud de canje fue recibida. Pendiente de aprobación del admin.`;
            break;
          case 'canje_completado':
            mensaje = `¡Tu canje fue aprobado y completado! Pasa a retirar tu premio.`;
            break;
          case 'cumpleaños':
            mensaje = `¡Feliz cumpleaños! 🎂 Recibiste 10 puntos bonus como regalo.`;
            break;
        }

        if (mensaje && cliente.whatsapp) {
          await twilioService.sendWhatsApp(cliente.whatsapp, mensaje);
          logger.info(`Notification sent: ${item.tipo} to ${cliente.whatsapp}`);
        }
      } catch (error) {
        logger.error(`Error processing notification: ${error}`);
      }
    }
  }
}

export const notificacionService = new NotificacionService();
