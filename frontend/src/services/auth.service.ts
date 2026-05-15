import { AuthTokens } from '../types/api.types';
import { User } from '../types/user.types';
import { authApi } from './api';

export const authService = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const { data } = await authApi.post<AuthTokens>('/api/v1/auth/login', { email, password });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await authApi.get<User>('/api/v1/auth/me');
    return data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await authApi.post<AuthTokens>('/api/v1/auth/refresh', { refreshToken });
    return data;
  },
};
