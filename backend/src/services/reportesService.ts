import prisma from '../config/database';
import logger from '../utils/logger';

export class ReportesService {
  async obtenerReportesClientes() {
    const clientes = await prisma.cliente.findMany({
      include: {
        transacciones: {
          select: {
            id: true,
            tipo: true,
            monto: true,
            puntosAsignados: true,
            createdAt: true,
          },
        },
        canjes: {
          select: {
            id: true,
            estado: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reporte = clientes.map((cliente: any) => {
      // Monto consumido: suma de transacciones tipo "compra"
      const montoConsumido = cliente.transacciones
        .filter((t: any) => t.tipo === 'compra')
        .reduce((sum: number, t: any) => sum + (t.monto || 0), 0);

      // Puntos otorgados: suma de puntosAsignados en transacciones
      const puntosOtorgados = cliente.transacciones.reduce(
        (sum: number, t: any) => sum + t.puntosAsignados,
        0
      );

      // Cantidad de canjes
      const cantidadCanjes = cliente.canjes.length;

      // Fechas de transacciones (compras)
      const fechasConsumos = cliente.transacciones
        .filter((t: any) => t.tipo === 'compra')
        .map((t: any) => t.createdAt)
        .sort((a: Date, b: Date) => b.getTime() - a.getTime());

      // Fechas de canjes
      const fechasCanjes = cliente.canjes
        .map((c: any) => c.createdAt)
        .sort((a: Date, b: Date) => b.getTime() - a.getTime());

      return {
        id: cliente.id,
        nombre: cliente.nombre,
        whatsapp: cliente.whatsapp,
        dni: cliente.dni,
        email: cliente.email,
        montoConsumido,
        puntosOtorgados,
        saldoPuntos: cliente.puntosActuales,
        cantidadCanjes,
        fechasConsumos,
        fechasCanjes,
        estado: cliente.estado,
        cumpleaños: cliente.cumpleaños,
        createdAt: cliente.createdAt,
      };
    });

    logger.info(`Reportes generated for ${reporte.length} clientes`);
    return reporte;
  }

  async buscarClientesReporte(termino: string) {
    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { contains: termino } },
          { whatsapp: { contains: termino } },
          { dni: { contains: termino } },
          { email: { contains: termino } },
        ],
      },
      include: {
        transacciones: {
          select: {
            id: true,
            tipo: true,
            monto: true,
            puntosAsignados: true,
            createdAt: true,
          },
        },
        canjes: {
          select: {
            id: true,
            estado: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reporte = clientes.map((cliente: any) => {
      const montoConsumido = cliente.transacciones
        .filter((t: any) => t.tipo === 'compra')
        .reduce((sum: number, t: any) => sum + (t.monto || 0), 0);

      const puntosOtorgados = cliente.transacciones.reduce(
        (sum: number, t: any) => sum + t.puntosAsignados,
        0
      );

      const cantidadCanjes = cliente.canjes.length;

      const fechasConsumos = cliente.transacciones
        .filter((t: any) => t.tipo === 'compra')
        .map((t: any) => t.createdAt)
        .sort((a: Date, b: Date) => b.getTime() - a.getTime());

      const fechasCanjes = cliente.canjes
        .map((c: any) => c.createdAt)
        .sort((a: Date, b: Date) => b.getTime() - a.getTime());

      return {
        id: cliente.id,
        nombre: cliente.nombre,
        whatsapp: cliente.whatsapp,
        dni: cliente.dni,
        email: cliente.email,
        montoConsumido,
        puntosOtorgados,
        saldoPuntos: cliente.puntosActuales,
        cantidadCanjes,
        fechasConsumos,
        fechasCanjes,
        estado: cliente.estado,
        cumpleaños: cliente.cumpleaños,
        createdAt: cliente.createdAt,
      };
    });

    logger.info(`Reportes search returned ${reporte.length} clientes for term: ${termino}`);
    return reporte;
  }
}

export const reportesService = new ReportesService();
