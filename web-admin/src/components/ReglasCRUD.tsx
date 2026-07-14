import { useState, useEffect } from 'react'
import api from '../api'

interface ReglasCRUDProps {
  token: string
}

interface Regla {
  id: string
  nombre: string
  descripcion?: string
  montoBase: number
  puntosOtorgados: number
  activa: boolean
  createdAt: string
}

export default function ReglasCRUD({ token }: ReglasCRUDProps) {
  const [reglas, setReglas] = useState<Regla[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [reglaSeleccionada, setReglaSeleccionada] = useState<Regla | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    montoBase: '',
    puntosOtorgados: '',
  })

  useEffect(() => {
    fetchReglas()
  }, [token])

  const fetchReglas = async () => {
    try {
      const response = await api.get('/api/admin/reglas', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const reglasList = Array.isArray(response.data) ? response.data : response.data.data || []
      setReglas(reglasList)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reglas')
      setReglas([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.nombre || !formData.montoBase || !formData.puntosOtorgados) {
      setError('Completa los campos requeridos')
      return
    }

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        montoBase: parseFloat(formData.montoBase),
        puntosOtorgados: parseInt(formData.puntosOtorgados),
      }

      if (reglaSeleccionada) {
        await api.put(`/api/admin/reglas/${reglaSeleccionada.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await api.post('/api/admin/reglas', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      setFormData({ nombre: '', descripcion: '', montoBase: '', puntosOtorgados: '' })
      setReglaSeleccionada(null)
      setShowForm(false)
      await fetchReglas()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar regla')
    }
  }

  const handleActivar = async (id: string) => {
    try {
      await api.post(
        `/api/admin/reglas/${id}/activar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchReglas()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al activar regla')
    }
  }

  const handleDesactivar = async (id: string) => {
    try {
      await api.delete(`/api/admin/reglas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchReglas()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al desactivar regla')
    }
  }

  const handleEditar = (regla: Regla) => {
    setReglaSeleccionada(regla)
    setFormData({
      nombre: regla.nombre,
      descripcion: regla.descripcion || '',
      montoBase: regla.montoBase.toString(),
      puntosOtorgados: regla.puntosOtorgados.toString(),
    })
    setShowForm(true)
  }

  const handleNuevo = () => {
    setReglaSeleccionada(null)
    setFormData({ nombre: '', descripcion: '', montoBase: '', puntosOtorgados: '' })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setReglaSeleccionada(null)
    setFormData({ nombre: '', descripcion: '', montoBase: '', puntosOtorgados: '' })
    setError('')
  }

  if (loading) {
    return <div className="text-center py-8">Cargando reglas...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">
            {reglaSeleccionada ? 'Editar Regla' : 'Nueva Regla'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Regla Estándar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Ej: Aplicada de forma general"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Base ($)
                </label>
                <input
                  type="number"
                  value={formData.montoBase}
                  onChange={(e) => setFormData({ ...formData, montoBase: e.target.value })}
                  placeholder="Ej: 1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puntos Otorgados
                </label>
                <input
                  type="number"
                  value={formData.puntosOtorgados}
                  onChange={(e) => setFormData({ ...formData, puntosOtorgados: e.target.value })}
                  placeholder="Ej: 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                📊 Por cada <strong>${formData.montoBase || '?'}</strong> gastados se otorgan{' '}
                <strong>{formData.puntosOtorgados || '?'} puntos</strong>
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <button
            onClick={handleNuevo}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            + Nueva Regla
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
                    Monto Base
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Puntos
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
                {reglas.map((regla) => (
                  <tr key={regla.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{regla.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {regla.descripcion || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">${regla.montoBase}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {regla.puntosOtorgados}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          regla.activa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {regla.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEditar(regla)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-xs"
                      >
                        Editar
                      </button>
                      {regla.activa ? (
                        <button
                          onClick={() => handleDesactivar(regla.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-xs"
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivar(regla.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-xs"
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reglas.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay reglas configuradas. Crea una nueva para empezar.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
