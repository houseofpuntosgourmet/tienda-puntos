import { useState, useEffect } from 'react'
import axios from 'axios'

interface ReportesProps {
  token: string
}

interface ReportData {
  clientesActivos: number
  puntosAsignadosHoy: number
  premiosMasCanjeados: Array<{
    nombre: string
    canjes: number
  }>
  totalCanjes: number
  totalPuntosCanjeados: number
}

export default function Reportes({ token }: ReportesProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
  }, [token])

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/admin/reportes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReportData(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando reportes...</div>
  }

  if (!reportData) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error || 'Sin datos de reportes'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Clientes Activos</h3>
          <p className="text-3xl font-bold text-gray-900">{reportData.clientesActivos}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Puntos Hoy</h3>
          <p className="text-3xl font-bold text-green-600">
            {reportData.puntosAsignadosHoy}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">Canjes Totales</h3>
          <p className="text-3xl font-bold text-orange-600">{reportData.totalCanjes}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">Puntos Canjeados</h3>
          <p className="text-3xl font-bold text-purple-600">
            {reportData.totalPuntosCanjeados}
          </p>
        </div>
      </div>

      {/* Premios Más Canjeados */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Premios Más Canjeados</h2>
        </div>

        {reportData.premiosMasCanjeados.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No hay datos de canjes
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {reportData.premiosMasCanjeados.map((premio, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{premio.nombre}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 px-4 py-2 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">
                        {premio.canjes} canjes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumen General */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              El programa tiene {reportData.clientesActivos} clientes activos con una
              participación constante.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Hoy se asignaron {reportData.puntosAsignadosHoy} puntos y se realizaron
              {reportData.totalCanjes > 0 ? ` ${reportData.totalCanjes} canjes` : ' sin canjes'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
