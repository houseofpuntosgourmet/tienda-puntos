import { useState, useCallback } from 'react'

interface AuthState {
  token: string | null
  usuario: any | null
  loading: boolean
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('admin_token'),
    usuario: localStorage.getItem('admin_usuario')
      ? JSON.parse(localStorage.getItem('admin_usuario') || '{}')
      : null,
    loading: false,
  })

  const login = useCallback(async (email: string, password: string) => {
    // Implementation handled in Login component
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_usuario')
    setAuth({ token: null, usuario: null, loading: false })
  }, [])

  const refreshToken = useCallback(async () => {
    // Implementation for token refresh if needed
  }, [])

  return { ...auth, login, logout, refreshToken }
}
