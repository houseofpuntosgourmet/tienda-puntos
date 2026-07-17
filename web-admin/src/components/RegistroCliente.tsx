import { useState, useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import api from '../api'

export default function RegistroCliente() {
  // URL absoluta de registro basada en el origen actual (funciona en dev y en producción)
  const registroUrl = `${window.location.origin}/#registro`

  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '549',
    dni: '',
    email: '',
    cumpleaños: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clienteRegistrado, setClienteRegistrado] = useState<any>(null)
  const [mostraQR, setMostraQR] = useState(false)
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<any>(null)

  // Generar QR
  useEffect(() => {
    if (mostraQR && qrContainerRef.current && !qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 256,
        height: 256,
        data: registroUrl,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'H',
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
        },
        dotsOptions: {
          color: '#222222',
          type: 'rounded',
        },
        cornersSquareOptions: {
          color: '#2563eb',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#2563eb',
          type: 'dot',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      })
      qrCodeRef.current.append(qrContainerRef.current)
    }
  }, [mostraQR])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const descargarQR = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: 'qr-registro-tienda-puntos', extension: 'png' })
    }
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

    // Limpiar whatsapp (quitar espacios)
    const whatsappLimpio = formData.whatsapp.replace(/\s/g, '')

    // Validar que empiece con 549 y tenga 12-15 dígitos totales
    if (!/^549\d{9,12}$/.test(whatsappLimpio)) {
      setError('WhatsApp inválido. Debe ser: 549 + código de área + número (sin espacios en la validación)')
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
        whatsapp: whatsappLimpio,
        dni: formData.dni,
      }

      if (formData.email) payload.email = formData.email
      if (formData.cumpleaños) payload.cumpleaños = new Date(formData.cumpleaños).toISOString()

      const response = await api.post('/api/clientes/registro', payload)

      setClienteRegistrado(response.data)
      setSuccess(response.data.mensaje || 'Registro completado exitosamente')
      setFormData({
        nombre: '',
        whatsapp: '549',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white rounded-b-lg shadow-sm max-w-md w-full overflow-hidden">
        {/* Header - fondo NEGRO con logo dorado */}
        <div className="bg-black px-6 py-8 text-center rounded-t-lg border-2 border-black">
          {/*
            LOGO: coloca el archivo en web-admin/public/logo-hp-v2.png
            Se carga automáticamente desde /logo-hp-v2.png (raíz del sitio).
            El PNG ya tiene fondo NEGRO (sin bordes blancos) para fundirse con el header.
            Nombre versionado (-v2) para invalidar el cache del CDN/navegador.
            Si el archivo no existe, se oculta la imagen.
          */}
          <img
            src="/logo-hp-v2.png"
            alt="House of Panchos - Tienda de Puntos"
            className="mx-auto mb-4 block max-h-40 w-auto object-contain shadow-none outline-none"
            onError={(e) => {
              // Si el logo aún no fue subido, ocultar la imagen rota
              e.currentTarget.style.display = 'none'
            }}
          />
          <h1
            className="text-4xl font-extrabold tracking-wide mb-2"
            style={{ color: '#FFD700' }}
          >
            Tienda de Puntos
          </h1>
          <p className="text-sm" style={{ color: '#F5D98B' }}>
            Sumá puntos con cada compra y canjealos por premios exclusivos
          </p>
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
                    WhatsApp * (Argentina)
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="549 11 12345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Empieza con 549. Ej: 549 11 12345678 o 54911234567</p>
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

        {/* Sección QR */}
        <div className="bg-blue-50 px-6 py-4 border-t">
          <button
            onClick={() => setMostraQR(!mostraQR)}
            className="w-full text-center text-blue-600 hover:text-blue-800 font-semibold text-sm mb-3"
          >
            {mostraQR ? '▼ Ocultar' : '▶ Ver'} Código QR para Compartir
          </button>

          {mostraQR && (
            <div className="bg-white p-4 rounded-lg border border-blue-200 text-center space-y-3">
              <p className="text-sm text-gray-600">Escanea este código para registrarte</p>
              <div
                ref={qrContainerRef}
                className="flex justify-center py-4"
              />
              <p className="text-xs text-gray-500 break-all">
                URL: {registroUrl}
              </p>
              <button
                onClick={descargarQR}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded text-sm"
              >
                📥 Descargar QR
              </button>
            </div>
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
