import { useState, useEffect } from 'react'
import axios from 'axios'
import PremioForm from './PremioForm'

interface PremiosCRUDProps {
  token: string
}

interface Premio {
  id: string
  nombre: string
  descripcion: string
  puntosRequeridos: number
  valor: number
  activo: boolean
}

export default function PremiosCRUD({ token }: PremiosCRUDProps) {
  const [premios, setPremios] = useState<Premio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [premioSeleccionado, setPremioSeleccionado] = useState<Premio | null>(null)

  useEffect(() => {
    fetchPremios()
  }, [token])

  const fetchPremios = async () => {
    try {
      const response = await axios.get('/api/premios', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPremios(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar premios')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    await fetchPremios()
    setShowForm(false)
    setPremioSeleccionado(null)
  }

  const handleDesactivar = async (id: string) => {
    try {
      await axios.patch(
        `/api/premios/${id}`,
        { activo: false },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchPremios()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al desactivar premio')
    }
  }

  const handleEditar = (premio: Premio) => {
    setPremioSeleccionado(premio)
    setShowForm(true)
  }

  const handleNuevo = () => {
    setPremioSeleccionado(null)
    setShowForm(true)
  }

  if (loading) {
    return <div className="text-center py-8">Cargando premios...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm ? (
        <PremioForm
          token={token}
          premio={premioSeleccionado}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setPremioSeleccionado(null)
          }}
        />
      ) : (
        <>
          <button
            onClick={handleNuevo}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            + Nuevo Premio
          </button>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Puntos Requeridos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {premios.map((premio) => (
                  <tr key={premio.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {premio.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {premio.descripcion}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {premio.puntosRequeridos}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${premio.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          premio.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {premio.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEditar(premio)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-xs"
                      >
                        Editar
                      </button>
                      {premio.activo && (
                        <button
                          onClick={() => handleDesactivar(premio.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-xs"
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
