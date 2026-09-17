import axios from 'axios'

// En producción el backend se llama por el mismo dominio: web-admin/vercel.json
// reenvía /api/* al proyecto del backend. Así no depende de variables del build
// (el VITE_API_URL viejo apuntaba a una app de Railway que ya no existe).
// En local, sin VITE_API_URL, el proxy de vite.config.ts manda /api al backend.
const API_URL = import.meta.env.DEV ? import.meta.env.VITE_API_URL || '' : ''

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
