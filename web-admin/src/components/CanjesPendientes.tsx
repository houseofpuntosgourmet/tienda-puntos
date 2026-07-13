import { useState, useEffect } from 'react'
import axios from 'axios'

interface CanjesPendientesProps {
  token: string
}

interface Canje {
  id: string
  clienteNombre: string
  premioNombre: string
  fecha: string
  estado: 'pendiente' | 'completado' | 'cancelado'
  puntosCanjeados: number
}

export default function CanjesPendientes({ token }: CanjesPendientesProps) {
  const [canjes, setCanjes] = useState<Canje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completando, setCompletando] = useState<string | null>(null)

  useEffect(() => {
    fetchCanjes()
  }, [token])

  const fetchCanjes = async () => {
    try {
      const response = await axios.get('/api/admin/canjes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCanjes(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar canjes')
    } finally {
      setLoading(false)
    }
  }

  const handleCompletar = async (canjeId: string) => {
    setCompletando(canjeId)
    try {
      await axios.post(
        `/api/admin/canjes/${canjeId}/completar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchCanjes()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al completar canje')
    } finally {
      setCompletando(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando canjes pendientes...</div>
  }

  const canjesPendientes = canjes.filter((c) => c.estado === 'pendiente')
  const canjesCompletados = canjes.filter((c) => c.estado === 'completado')

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Canjes Pendientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            Canjes Pendientes ({canjesPendientes.length})
          </h2>
        </div>

        {canjesPendientes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No hay canjes pendientes
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Premio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {canjesPendientes.map((canje) => (
                  <tr key={canje.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{canje.clienteNombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{canje.premioNombre}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {canje.puntosCanjeados}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(canje.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleCompletar(canje.id)}
                        disabled={completando === canje.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-xs disabled:bg-gray-400"
                      >
                        {completando === canje.id ? 'Procesando...' : 'Completar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Canjes Completados */}
      {canjesCompletados.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">
              Canjes Completados ({canjesCompletados.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Premio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Puntos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {canjesCompletados.map((canje) => (
                  <tr key={canje.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{canje.clienteNombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{canje.premioNombre}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {canje.puntosCanjeados}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(canje.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
