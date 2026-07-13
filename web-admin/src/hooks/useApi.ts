import axios, { AxiosInstance } from 'axios'

export const useApi = (token?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api',
  })

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired - redirect to login
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_usuario')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return instance
}
