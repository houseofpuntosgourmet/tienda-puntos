import { useState } from 'react'
import api from '../api'
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
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [puntosCalculados, setPuntosCalculados] = useState(0)
  const [reglaActiva, setReglaActiva] = useState<ReglaActiva | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const handleAsignar = async () => {
    if (!clienteSeleccionado) {
      setError('Por favor selecciona un cliente')
      return
    }

    if (!monto || monto === '.' || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
      setError('Ingresa un monto válido (número mayor a 0)')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const montoNumero = parseFloat(monto)
      const response = await api.post(
        '/api/transacciones',
        {
          clienteId: clienteSeleccionado.id,
          montoCompra: montoNumero,
          descripcion: 'Asignación manual de puntos',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { puntosAntes, puntosDespues } = response.data
      setSuccess(`✓ Puntos actualizados: ${puntosAntes} → ${puntosDespues}`)
      setClienteSeleccionado({
        ...clienteSeleccionado,
        puntosActuales: puntosDespues
      })
      setMonto('')
      setFecha(new Date().toISOString().split('T')[0])
      setPuntosCalculados(0)
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
          <ClienteSearch token={token} onSelectCliente={setClienteSeleccionado} />

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

        {/* Date and Amount Input */}
        <div className="mb-6 pb-6 border-b space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Paso 2: Ingresa Fecha y Monto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                disabled={!clienteSeleccionado}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Monto Consumido ($)</label>
              <input
                type="text"
                inputMode="decimal"
                value={monto}
                onChange={(e) => {
                  const valor = e.target.value
                  // Solo permitir dígitos y un punto
                  if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                    // Evitar múltiples puntos
                    const puntoCount = (valor.match(/\./g) || []).length
                    if (puntoCount <= 1) {
                      setMonto(valor)
                    }
                  }
                }}
                placeholder="0.00"
                disabled={!clienteSeleccionado}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

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
