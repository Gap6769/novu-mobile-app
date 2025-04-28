import axios from 'axios';
import { API_CONFIG } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../../contexts';

export const api = axios.create({
  ...API_CONFIG,
  timeout: 30000,
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (no autorizado) y no es una petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
          const { access_token, refresh_token } = response.data;
          
          // Guardar los nuevos tokens
          await AsyncStorage.setItem('token', access_token);
          await AsyncStorage.setItem('refreshToken', refresh_token);
          
          // Actualizar el header de la petición original
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Reintentar la petición original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, hacer logout
        const { logout } = useAuthContext();
        await logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
); 