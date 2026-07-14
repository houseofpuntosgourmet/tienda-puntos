import { useState, useEffect } from 'react'
import api from '../api'

interface PremioFormProps {
  token: string
  premio: any | null
  onSave: () => void
  onCancel: () => void
}

export default function PremioForm({ token, premio, onSave, onCancel }: PremioFormProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [puntosRequeridos, setPuntosRequeridos] = useState('')
  const [vigencia, setVigencia] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (premio) {
      setNombre(premio.nombre)
      setDescripcion(premio.descripcion || '')
      setPuntosRequeridos(premio.puntosRequeridos.toString())
      if (premio.vigencia) {
        setVigencia(new Date(premio.vigencia).toISOString().split('T')[0])
      }
    }
  }, [premio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data: any = {
        nombre,
        descripcion,
        puntosRequeridos: parseInt(puntosRequeridos),
      }

      if (vigencia) {
        data.vigencia = new Date(vigencia).toISOString()
      }

      if (premio) {
        // Edit
        await api.put(`/api/premios/${premio.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        // Create
        await api.post('/api/premios', data, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      onSave()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar premio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">
        {premio ? 'Editar Premio' : 'Nuevo Premio'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puntos Requeridos
            </label>
            <input
              type="number"
              value={puntosRequeridos}
              onChange={(e) => setPuntosRequeridos(e.target.value)}
              placeholder="Ej: 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vigencia (opcional)
            </label>
            <input
              type="date"
              value={vigencia}
              onChange={(e) => setVigencia(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
