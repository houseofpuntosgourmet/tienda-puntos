import { useState } from 'react'
import api from '../api'

interface ClienteSearchProps {
  token: string
}

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  dni: string
  puntosActuales: number
  fechaRegistro: string
}

export default function ClienteSearch({ token }: ClienteSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/api/clientes', {
        params: { search: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      })
      setResults(response.data)
      setSearched(true)
    } catch (err) {
      setResults([])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por teléfono, nombre o DNI..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {searched && results.length === 0 && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          No se encontraron clientes
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">DNI</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Puntos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registro</th>
              </tr>
            </thead>
            <tbody>
              {results.map((cliente) => (
                <tr key={cliente.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{cliente.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefono}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cliente.dni}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{cliente.puntosActuales}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(cliente.fechaRegistro).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
