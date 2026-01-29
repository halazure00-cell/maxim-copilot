import { create } from 'zustand';
import { onAuthStateChange } from '../services/authService';
import type { Session } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState>((set) => {
  // Inisialisasi state
  set({ isLoading: true });

  // Dengarkan perubahan status autentikasi dari Supabase
  const subscription = onAuthStateChange((session) => {
    set({ 
      session, 
      isAuthenticated: !!session,
      isLoading: false 
    });
  });

  // Awalnya set state isLoading jadi true sampai onAuthStateChange selesai
  return {
    session: null,
    isLoading: true,
    isAuthenticated: false,
    setSession: (session) => set({ session, isAuthenticated: !!session }),
  };
});
