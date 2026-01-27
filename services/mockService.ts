import { Profile, Transaksi } from '../types';

// Initial Mock Data
let mockProfile: Profile = {
  id: 'user-123',
  nama_lengkap: 'Budi Santoso',
  plat_nomor: 'B 1234 XYZ',
  nomor_darurat: '081234567890',
  target_harian: 500000,
  updated_at: new Date().toISOString()
};

let mockTransaksi: Transaksi[] = [
  {
    id: 1,
    user_id: 'user-123',
    tipe: 'masuk',
    jumlah: 150000,
    keterangan: 'Trip ke Bandara Soetta',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 2,
    user_id: 'user-123',
    tipe: 'masuk',
    jumlah: 25000,
    keterangan: 'Trip Jarak Dekat',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 3,
    user_id: 'user-123',
    tipe: 'keluar',
    jumlah: 15000,
    keterangan: 'Beli Bensin',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const getProfile = async (): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...mockProfile }), 500);
  });
};

export const updateProfile = async (data: Partial<Profile>): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProfile = { ...mockProfile, ...data };
      resolve({ ...mockProfile });
    }, 500);
  });
};

export const getTransaksi = async (): Promise<Transaksi[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockTransaksi].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )), 600);
  });
};

export const addTransaksi = async (transaksi: Omit<Transaksi, 'id' | 'created_at' | 'user_id'>): Promise<Transaksi> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTx: Transaksi = {
        id: Math.floor(Math.random() * 10000),
        user_id: 'user-123',
        created_at: new Date().toISOString(),
        ...transaksi
      };
      mockTransaksi = [newTx, ...mockTransaksi];
      resolve(newTx);
    }, 500);
  });
};
