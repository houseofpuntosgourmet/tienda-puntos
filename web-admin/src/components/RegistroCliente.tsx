import { useState } from 'react'
import axios from 'axios'

export default function RegistroCliente() {
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    dni: '',
    email: '',
    cumpleaños: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clienteRegistrado, setClienteRegistrado] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validación básica
    if (!formData.nombre || !formData.whatsapp || !formData.dni) {
      setError('Por favor completa los campos requeridos: Nombre, WhatsApp y DNI')
      return
    }

    // Validar formato WhatsApp (7-15 dígitos)
    if (!/^\d{7,15}$/.test(formData.whatsapp)) {
      setError('WhatsApp inválido. Debe contener entre 7 y 15 dígitos')
      return
    }

    // Validar formato DNI (6-8 dígitos)
    if (!/^\d{6,8}$/.test(formData.dni)) {
      setError('DNI inválido. Debe contener entre 6 y 8 dígitos')
      return
    }

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido')
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        nombre: formData.nombre,
        whatsapp: formData.whatsapp,
        dni: formData.dni,
      }

      if (formData.email) payload.email = formData.email
      if (formData.cumpleaños) payload.cumpleaños = new Date(formData.cumpleaños).toISOString()

      const response = await axios.post('http://localhost:3001/api/clientes/registro', payload)

      setClienteRegistrado(response.data)
      setSuccess(response.data.mensaje || 'Registro completado exitosamente')
      setFormData({
        nombre: '',
        whatsapp: '',
        dni: '',
        email: '',
        cumpleaños: '',
      })
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Error al registrarse'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Tienda de Puntos</h1>
          <p className="text-blue-100">Únete y empieza a ganar puntos</p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {clienteRegistrado ? (
            // Éxito
            <div className="text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold text-green-600">¡Bienvenido!</h2>
              <p className="text-gray-600">
                Hola <strong>{clienteRegistrado.nombre}</strong>, tu registro fue exitoso.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">ID Cliente:</span> {clienteRegistrado.id.substring(0, 12)}...
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Contacto:</span> {clienteRegistrado.whatsapp}
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ya estás registrado en nuestra tienda de puntos. Cada compra te permitirá acumular puntos que
                podrás canjear por premios. ¡Gracias por tu confianza!
              </p>
              <button
                onClick={() => setClienteRegistrado(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg mt-4"
              >
                Registrar Otro Cliente
              </button>
            </div>
          ) : (
            // Formulario
            <>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="1141817703"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Sin espacios ni caracteres especiales</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">6-8 dígitos</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cumpleaños (opcional)
                  </label>
                  <input
                    type="date"
                    name="cumpleaños"
                    value={formData.cumpleaños}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                * Campos requeridos
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t text-center text-sm text-gray-600">
          <p>¿Preguntas? Contacta al equipo de soporte</p>
        </div>
      </div>
    </div>
  )
}
