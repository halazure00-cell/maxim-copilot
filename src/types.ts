export interface Profile {
  id: string;
  nama_lengkap: string;
  plat_nomor: string;
  nomor_darurat: string;
  target_harian: number;
  updated_at?: string;
}

export interface Transaksi {
  id: number;
  user_id: string;
  tipe: 'masuk' | 'keluar';
  jumlah: number;
  keterangan: string;
  created_at: string;
}

export type ViewState = 'dashboard' | 'transaksi' | 'profil';

// Mock data types for development without backend connection
export interface MockDatabase {
  profile: Profile;
  transaksi: Transaksi[];
}
