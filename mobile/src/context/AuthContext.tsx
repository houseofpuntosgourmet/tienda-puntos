import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface Cliente {
  id: string;
  nombre: string;
  whatsapp: string;
  dni: string;
  email?: string;
  cumpleaños?: string;
  puntosActuales: number;
}

export interface AuthContextType {
  token: string | null;
  usuario: Cliente | null;
  loading: boolean;
  login: (whatsapp: string, dni: string) => Promise<void>;
  register: (nombre: string, whatsapp: string, dni: string, cumpleaños?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (usuario: Cliente) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from secure storage on app start
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          setToken(storedToken);
          // Try to load user data if we have a token
          const storedUser = await SecureStore.getItemAsync('userData');
          if (storedUser) {
            setUsuario(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error loading stored token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const login = async (whatsapp: string, dni: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/cliente/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ whatsapp, dni }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUsuario(data.cliente);

      // Store securely
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(data.cliente));
    } catch (error) {
      throw error;
    }
  };

  const register = async (nombre: string, whatsapp: string, dni: string, cumpleaños?: string, email?: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, whatsapp, dni, cumpleaños, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      setUsuario(data);

      // Auto-login after registration
      await login(whatsapp, dni);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
      setToken(null);
      setUsuario(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = (updatedUser: Cliente) => {
    setUsuario(updatedUser);
    SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ token, usuario, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
