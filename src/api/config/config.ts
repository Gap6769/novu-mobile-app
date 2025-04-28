import { Platform } from 'react-native';
import { API_URL } from '@env';

console.log('API_URL', API_URL);
// Configuración de la API
const API_BASE_URL = API_URL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
};

export const API_ENDPOINTS = {
  NOVELS: '/api/v1/novels',
  CHAPTERS: '/api/v1/novels/:novelId/chapters',
  LOGIN: '/api/v1/auth/token',
  REGISTER: '/api/v1/users/register',
  SOURCES: '/api/v1/sources'
}; 