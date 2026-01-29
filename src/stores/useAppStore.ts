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

let refreshSeq = 0;

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  profile: null,
  transaksi: [],
  loading: true,
  setView: (view) => set({ currentView: view }),
  refresh: async () => {
    const seq = ++refreshSeq;
    set({ loading: true });
    try {
      const [profileData, transaksiData] = await Promise.all([
        getProfile(),
        getTransaksi()
      ]);
      if (seq !== refreshSeq) return;
      set({ profile: profileData, transaksi: transaksiData });
    } catch (error) {
      if (seq !== refreshSeq) return;
      console.error('Gagal memuat data', error);
    } finally {
      if (seq === refreshSeq) set({ loading: false });
    }
  }
}));
