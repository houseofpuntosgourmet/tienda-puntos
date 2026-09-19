import axios from 'axios'

// En producción el backend se llama por el mismo dominio: el vercel.json de la raíz
// —el que usa el proyecto tienda-puntos, con Root Directory "."— reenvía /api/* al
// proyecto tienda-puntos-backend. Así no depende de variables del build
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
