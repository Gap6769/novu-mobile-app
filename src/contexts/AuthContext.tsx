import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLogin, useRegister, useLogout, useAuth } from '../api/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: registerMutation } = useRegister();
  const { mutateAsync: logoutMutation } = useLogout();
  const { data: authData } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (token && refreshToken) {
          // Verificar si el token está expirado
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenPayload.exp * 1000; // Convertir a milisegundos
          
          if (Date.now() >= expirationTime) {
            // Token expirado, intentar refresh
            try {
              const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });
              
              if (response.ok) {
                const { access_token, refresh_token } = await response.json();
                await AsyncStorage.setItem('token', access_token);
                await AsyncStorage.setItem('refreshToken', refresh_token);
                setIsAuthenticated(true);
              } else {
                // Si el refresh falla, hacer logout
                await logout();
              }
            } catch (error) {
              await logout();
            }
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authData]);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await loginMutation(credentials);
      await AsyncStorage.setItem('token', response.access_token);
      await AsyncStorage.setItem('refreshToken', response.refresh_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    try {
      await registerMutation(data);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 