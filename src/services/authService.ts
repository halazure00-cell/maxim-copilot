import { supabase } from './supabaseClient';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Tipe kustom untuk sign-up agar bisa menyertakan nama lengkap
type CustomSignUpCredentials = SignUpWithPasswordCredentials & {
  fullName: string;
};

/**
 * Melakukan sign-in pengguna menggunakan email dan password.
 */
export const signIn = async (credentials: SignInWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    toast.error(error.message || 'Email atau password salah.');
    console.error('Sign-in error:', error);
    throw error;
  }

  toast.success('Login berhasil, selamat datang kembali!');
  return data;
};

/**
 * Mendaftarkan pengguna baru dan langsung login.
 */
export const signUp = async ({ email, password, fullName }: CustomSignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Mengirim metadata ke Supabase, yang akan digunakan oleh trigger
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    toast.error(error.message || 'Gagal membuat akun.');
    console.error('Sign-up error:', error);
    throw error;
  }
  
  // Karena 'Confirm Email' dinonaktifkan, user akan langsung login.
  // State auth akan otomatis diperbarui oleh onAuthStateChange.
  toast.success(`Pendaftaran berhasil! Selamat datang, ${fullName}!`);
  return data;
};

/**
 * Melakukan sign-out untuk sesi pengguna saat ini.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error('Gagal melakukan logout.');
    console.error('Sign-out error:', error);
    throw error;
  }
  
  toast.success('Anda telah berhasil logout.');
};

/**
 * Mendengarkan perubahan status autentikasi (login/logout).
 */
export const onAuthStateChange = (callback: (session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return subscription;
};
