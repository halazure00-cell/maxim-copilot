import { supabase } from './supabaseClient';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

/**
 * Melakukan sign-in pengguna menggunakan email dan password.
 * @param credentials - Email dan password pengguna.
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
 * Mendaftarkan pengguna baru.
 * @param credentials - Email dan password untuk akun baru.
 */
export const signUp = async (credentials: SignUpWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    toast.error(error.message || 'Gagal membuat akun.');
    console.error('Sign-up error:', error);
    throw error;
  }
  
  // Catatan: Trigger di database akan otomatis membuat profil kosong.
  toast.success('Pendaftaran berhasil! Silakan login untuk melanjutkan.');
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
 * @param callback - Fungsi yang akan dipanggil dengan sesi baru atau null.
 * @returns Subscription object yang bisa digunakan untuk unsubscribe.
 */
export const onAuthStateChange = (callback: (session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return subscription;
};
