import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = { id: number; name: string; email: string };
type Barang = { id: number; nama: string; harga: number; stock: number; gambar: string };

interface AppState {
  user: User | null;
  token: string | null;
  barang: Barang[];
  login: (user: User, token: string) => void;
  logout: () => void;
  setBarang: (items: Barang[]) => void;
}

const useStore = create(
  persist<AppState>(
    (set) => ({
      user: null,
      token: null,
      barang: [],
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setBarang: (items) => set({ barang: items }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useStore;
