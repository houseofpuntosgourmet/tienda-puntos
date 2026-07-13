import cron from 'node-cron';
import prisma from '../config/database';
import { puntosService } from '../services/puntosService';
import { notificacionService } from '../services/notificacionService';
import logger from '../utils/logger';

export function initCumpleañosJob(): void {
  // Run at 9:00 AM every day
  const job = cron.schedule('0 9 * * *', async () => {
    try {
      logger.info('Running birthday job...');

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find clientes with birthday today
      const clientes = await prisma.cliente.findMany({
        where: {
          cumpleaños: {
            gte: today,
            lt: tomorrow,
          },
          estado: 'activo',
        },
      });

      logger.info(`Found ${clientes.length} clientes with birthday today`);

      // Assign bonus points
      for (const cliente of clientes) {
        try {
          // Create bonus transaction
          await prisma.transaccion.create({
            data: {
              clienteId: cliente.id,
              tipo: 'bonus',
              puntosAsignados: 10,
              puntosAntes: cliente.puntosActuales,
              puntosDespues: cliente.puntosActuales + 10,
              descripcion: 'Bonus de cumpleaños',
            },
          });

          // Update cliente points
          await prisma.cliente.update({
            where: { id: cliente.id },
            data: { puntosActuales: cliente.puntosActuales + 10 },
          });

          // Send notification
          notificacionService.encolarNotificacion('cumpleaños', cliente.id);

          logger.info(`Birthday bonus assigned to ${cliente.id}`);
        } catch (error) {
          logger.error(`Error assigning birthday bonus to ${cliente.id}: ${error}`);
        }
      }

      logger.info('Birthday job completed');
    } catch (error) {
      logger.error(`Error in birthday job: ${error}`);
    }
  });

  logger.info('Birthday job initialized (9:00 AM daily)');
}
