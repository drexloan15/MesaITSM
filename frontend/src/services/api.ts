import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

function createInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(err);
    },
  );

  return instance;
}

export const authApi = createInstance(
  import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:3001',
);

export const incidentsApi = createInstance(
  import.meta.env.VITE_INCIDENTS_API_URL ?? 'http://localhost:3002',
);
