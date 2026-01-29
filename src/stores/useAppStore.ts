import { create } from 'zustand';
import type { Profile, Transaksi } from '../types'; // SALAH
import { getProfile, getTransaksi } from '../services/mockService';

type AppState = {
  profile: Profile | null;
  transaksi: Transaksi[];
  loading: boolean;
  refresh: () => Promise<void>;
};

let refreshSeq = 0;

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  transaksi: [],
  loading: true,
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
