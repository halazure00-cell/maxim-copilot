import { createClient } from '@supabase/supabase-js';

// Fix TS error: Property 'env' does not exist on type 'ImportMeta'
// We cast import.meta to any to support Vite environment variables without specific type definitions
const viteEnv = (import.meta as any).env;

// Menggunakan import.meta.env untuk Vite/Client-side environment
// Jika menggunakan Next.js asli, gunakan process.env.NEXT_PUBLIC_...
const supabaseUrl = viteEnv?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = viteEnv?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL atau Anon Key belum diset. Pastikan .env file sudah dikonfigurasi.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);