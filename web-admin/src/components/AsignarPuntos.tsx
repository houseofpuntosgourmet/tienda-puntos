import { useState } from 'react'
import axios from 'axios'
import ClienteSearch from './ClienteSearch'

interface AsignarPuntosProps {
  token: string
}

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  puntosActuales: number
}

interface ReglaActiva {
  id: string
  nombre: string
  factor: number
}

export default function AsignarPuntos({ token }: AsignarPuntosProps) {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [monto, setMonto] = useState('')
  const [puntosCalculados, setPuntosCalculados] = useState(0)
  const [reglaActiva, setReglaActiva] = useState<ReglaActiva | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleMontoChange = async (value: string) => {
    setMonto(value)
    if (!value || !clienteSeleccionado) return

    try {
      const response = await axios.post(
        '/api/transacciones/calcular-puntos',
        { monto: parseFloat(value) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPuntosCalculados(response.data.data.puntosCalculados)
      setReglaActiva(response.data.data.regla)
    } catch (err) {
      setPuntosCalculados(0)
    }
  }

  const handleAsignar = async () => {
    if (!clienteSeleccionado || !monto) {
      setError('Por favor selecciona un cliente e ingresa un monto')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post(
        '/api/transacciones',
        {
          clienteId: clienteSeleccionado.id,
          monto: parseFloat(monto),
          tipo: 'compra',
          descripcion: 'Asignación manual de puntos',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSuccess(`Se asignaron ${puntosCalculados} puntos a ${clienteSeleccionado.nombre}`)
      setClienteSeleccionado(null)
      setMonto('')
      setPuntosCalculados(0)
      setReglaActiva(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar puntos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Asignar Puntos</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Cliente Selection */}
        <div className="mb-6 pb-6 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Paso 1: Selecciona Cliente</h3>
          <ClienteSearch token={token} />

          {clienteSeleccionado && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">
                <strong>Cliente:</strong> {clienteSeleccionado.nombre}
              </p>
              <p className="text-sm">
                <strong>Puntos actuales:</strong> {clienteSeleccionado.puntosActuales}
              </p>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-6 pb-6 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Paso 2: Ingresa Monto</h3>
          <input
            type="number"
            value={monto}
            onChange={(e) => handleMontoChange(e.target.value)}
            placeholder="Ingresa el monto..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            step="0.01"
            disabled={!clienteSeleccionado}
          />
        </div>

        {/* Calculation Summary */}
        {monto && puntosCalculados > 0 && (
          <div className="mb-6 pb-6 border-b bg-gray-50 p-4 rounded">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resumen de Cálculo</h3>
            {reglaActiva && (
              <>
                <p className="text-sm mb-2">
                  <strong>Regla Activa:</strong> {reglaActiva.nombre}
                </p>
                <p className="text-sm mb-2">
                  <strong>Factor:</strong> {reglaActiva.factor}x
                </p>
              </>
            )}
            <p className="text-lg font-bold text-blue-600">
              Puntos a asignar: {puntosCalculados}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAsignar}
          disabled={!clienteSeleccionado || !monto || loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Asignar Puntos'}
        </button>
      </div>
    </div>
  )
}
