export type ViewState = 'dashboard' | 'transaksi' | 'profil';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  balance: number;
}

export interface Transaksi {
  id: string;
  created_at: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}
