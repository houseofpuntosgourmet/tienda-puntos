import { useState, useEffect } from 'react'
import axios from 'axios'
import ClienteSearch from '../components/ClienteSearch'

interface DashboardProps {
  token: string
}

interface Stats {
  totalClientes: number
  puntosHoy: number
  canjesPendientes: number
}

export default function Dashboard({ token }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalClientes: 0,
    puntosHoy: 0,
    canjesPendientes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [token])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Clientes</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalClientes}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Puntos Hoy</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.puntosHoy}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Canjes Pendientes</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.canjesPendientes}</p>
        </div>
      </div>

      {/* Cliente Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Buscar Cliente</h2>
        <ClienteSearch token={token} />
      </div>
    </div>
  )
}
