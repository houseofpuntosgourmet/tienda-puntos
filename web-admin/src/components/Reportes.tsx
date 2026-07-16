import { useState, useEffect } from 'react'
import api from '../api'

interface ReportesProps {
  token: string
}

interface ClienteReporte {
  id: string
  nombre: string
  whatsapp: string
  dni: string
  email?: string
  montoConsumido: number
  puntosOtorgados: number
  saldoPuntos: number
  cantidadCanjes: number
  fechasConsumos: string[]
  fechasCanjes: string[]
  estado: string
  createdAt: string
}

export default function Reportes({ token }: ReportesProps) {
  const [clientes, setClientes] = useState<ClienteReporte[]>([])
  const [filtrados, setFiltrados] = useState<ClienteReporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => {
    fetchReportes()
  }, [token])

  useEffect(() => {
    if (!busqueda.trim()) {
      setFiltrados(clientes)
      return
    }

    const termino = busqueda.toLowerCase()
    const filtrados = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(termino) ||
        c.whatsapp.includes(termino) ||
        c.dni.includes(termino) ||
        c.email?.toLowerCase().includes(termino)
    )
    setFiltrados(filtrados)
  }, [busqueda, clientes])

  const fetchReportes = async () => {
    try {
      const response = await api.get('/api/reportes/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClientes(response.data)
      setFiltrados(response.data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-AR') + ' ' + date.toLocaleTimeString('es-AR')
  }

  if (loading) {
    return <div className="text-center py-8">Cargando reportes...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar cliente (por nombre, teléfono, DNI o email)
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ingresa nombre, WhatsApp, DNI o email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {busqueda && (
            <div className="text-sm text-gray-600">
              Mostrando {filtrados.length} de {clientes.length} cliente
              {clientes.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Total Clientes</h3>
          <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Monto Total</h3>
          <p className="text-2xl font-bold text-green-600">
            ${clientes.reduce((sum, c) => sum + c.montoConsumido, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Total Canjes</h3>
          <p className="text-2xl font-bold text-orange-600">
            {clientes.reduce((sum, c) => sum + c.cantidadCanjes, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Puntos Activos</h3>
          <p className="text-2xl font-bold text-purple-600">
            {clientes.reduce((sum, c) => sum + c.saldoPuntos, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Listado de Clientes */}
      <div className="space-y-4">
        {filtrados.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </div>
        ) : (
          filtrados.map((cliente) => (
            <div key={cliente.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header del Cliente */}
              <div
                className="px-6 py-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setExpandido(expandido === cliente.id ? null : cliente.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                    <p className="text-xs text-gray-500">{cliente.dni}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">${cliente.montoConsumido.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Monto consumido</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{cliente.puntosOtorgados}</p>
                    <p className="text-xs text-gray-500">Puntos otorgados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{cliente.saldoPuntos}</p>
                    <p className="text-xs text-gray-500">Saldo puntos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{cliente.cantidadCanjes}</p>
                    <p className="text-xs text-gray-500">Canjes realizados</p>
                  </div>
                </div>
              </div>

              {/* Detalle expandido */}
              {expandido === cliente.id && (
                <div className="px-6 py-4 border-t bg-blue-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contacto */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Información de Contacto</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">WhatsApp:</span> {cliente.whatsapp}
                        </p>
                        <p>
                          <span className="text-gray-600">Email:</span> {cliente.email || '—'}
                        </p>
                        <p>
                          <span className="text-gray-600">Estado:</span>{' '}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              cliente.estado === 'activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {cliente.estado}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Miembro desde:</span>{' '}
                          {formatDate(cliente.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Historial de Consumos */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Últimos Consumos ({cliente.fechasConsumos.length})
                      </h4>
                      {cliente.fechasConsumos.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin consumos registrados</p>
                      ) : (
                        <div className="space-y-2">
                          {cliente.fechasConsumos.slice(0, 3).map((fecha, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              📅 {formatDate(fecha)}
                            </p>
                          ))}
                          {cliente.fechasConsumos.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              +{cliente.fechasConsumos.length - 3} más
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Historial de Canjes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Últimos Canjes ({cliente.cantidadCanjes})
                      </h4>
                      {cliente.fechasCanjes.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin canjes realizados</p>
                      ) : (
                        <div className="space-y-2">
                          {cliente.fechasCanjes.slice(0, 3).map((fecha, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              🎁 {formatDate(fecha)}
                            </p>
                          ))}
                          {cliente.fechasCanjes.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              +{cliente.fechasCanjes.length - 3} más
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Estadísticas */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Estadísticas</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Promedio por compra:</span>{' '}
                          <strong>
                            $
                            {cliente.fechasConsumos.length > 0
                              ? (cliente.montoConsumido / cliente.fechasConsumos.length).toFixed(0)
                              : 0}
                          </strong>
                        </p>
                        <p>
                          <span className="text-gray-600">Promedio puntos por compra:</span>{' '}
                          <strong>
                            {cliente.fechasConsumos.length > 0
                              ? (cliente.puntosOtorgados / cliente.fechasConsumos.length).toFixed(1)
                              : 0}
                          </strong>
                        </p>
                        <p>
                          <span className="text-gray-600">Tasa de canje:</span>{' '}
                          <strong>
                            {cliente.puntosOtorgados > 0
                              ? (
                                  (cliente.cantidadCanjes / cliente.puntosOtorgados) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
