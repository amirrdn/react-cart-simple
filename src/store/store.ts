import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

interface Barang {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  gambar: string;
}

interface AppState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  barang: Barang[];
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUser: (user: User | null) => void;
  setBarang: (barang: Barang[]) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useStore = create(
  persist<AppState>(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      barang: [],
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUser: (user) => set({ user }),
      setBarang: (barang) => set({ barang }),
      login: (user, token, refreshToken) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 