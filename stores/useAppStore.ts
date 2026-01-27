import { create } from 'zustand';
import type { Profile, Transaksi, ViewState } from '../types';
import { getProfile, getTransaksi } from '../services/mockService';

type AppState = {
  currentView: ViewState;
  profile: Profile | null;
  transaksi: Transaksi[];
  loading: boolean;
  setView: (view: ViewState) => void;
  refresh: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  profile: null,
  transaksi: [],
  loading: true,
  setView: (view) => set({ currentView: view }),
  refresh: async () => {
    set({ loading: true });
    try {
      const [profileData, transaksiData] = await Promise.all([
        getProfile(),
        getTransaksi()
      ]);
      set({ profile: profileData, transaksi: transaksiData });
    } catch (error) {
      console.error('Gagal memuat data', error);
    } finally {
      set({ loading: false });
    }
  }
}));
