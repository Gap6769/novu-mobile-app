import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../config/axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: 'user' | 'admin';
  is_active?: boolean;
  preferences?: {
    default_language: string;
    reading_font_size: number;
    reading_line_height: number;
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeAuthToken = async () => {
  await AsyncStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('grant_type', 'password');

      const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      await setAuthToken(response.data.access_token);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post(API_ENDPOINTS.REGISTER, data);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await removeAuthToken();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { isAuthenticated: true, token };
      }
      return { isAuthenticated: false, token: null };
    },
    staleTime: Infinity, // No revalidar automáticamente
  });
}; 