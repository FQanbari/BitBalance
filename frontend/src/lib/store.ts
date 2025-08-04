
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types';
import { configureStore } from "@reduxjs/toolkit";
import priceReducer from "./priceSlice";
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        setToken: (token) => set({ token, isAuthenticated: !!token }),
        setUser: (user) => set({ user }),
        login: (token, user) => set({ token, user, isAuthenticated: true }),
        logout: () => set({ token: null, user: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' }
    )
  )
);

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrency: (currency: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        currency: 'USD',
        setTheme: (theme) => set({ theme }),
        setCurrency: (currency) => set({ currency }),
      }),
      { name: 'settings-storage' }
    )
  )
);


export const store = configureStore({
    reducer: {
        prices: priceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
