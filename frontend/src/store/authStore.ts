import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user?: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (tokens, user) =>
        set({ ...tokens, isAuthenticated: true, user: user ?? null }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: 'comutel-auth' },
  ),
);
