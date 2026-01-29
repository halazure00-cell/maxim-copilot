import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, signUp } from '../services/authService';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

type AuthMode = 'signIn' | 'signUp';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      if (mode === 'signIn') {
        await signIn({ email: formData.email, password: formData.password });
        // State global akan menangani redirect otomatis.
      } else {
        await signUp({ 
          email: formData.email, 
          password: formData.password, 
          fullName: formData.fullName 
        });
        // Setelah sign up berhasil, user auto-login. State global akan redirect.
      }
    } catch (error) {
      // Notifikasi toast untuk error sudah dihandle di dalam authService.
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    reset(); // Reset form state saat berganti mode
    setMode(prev => prev === 'signIn' ? 'signUp' : 'signIn');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-16 h-16 mx-auto text-maxim-yellow" />
          <h1 className="text-3xl font-bold text-white mt-4">HybridPilot 2026</h1>
          <p className="text-zinc-400">{mode === 'signIn' ? 'Masuk untuk melanjutkan' : 'Buat akun baru'}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'signUp' && (
            <div>
              <input 
                {...register('fullName', { required: 'Nama lengkap tidak boleh kosong' })} 
                type="text" 
                placeholder="Nama Lengkap"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-maxim-yellow"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>}
            </div>
          )}
          <div>
            <input 
              {...register('email', { required: 'Email tidak boleh kosong' })} 
              type="email" 
              placeholder="Email"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-maxim-yellow"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <input 
              {...register('password', { required: 'Password tidak boleh kosong', minLength: { value: 6, message: 'Password minimal 6 karakter' }})} 
              type="password" 
              placeholder="Password"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-maxim-yellow"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-maxim-yellow text-maxim-black font-bold rounded-lg hover:bg-yellow-400 disabled:bg-zinc-600 transition-colors duration-300"
          >
            {isLoading 
              ? <><div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div> Memproses...</> 
              : (mode === 'signIn' ? <><LogIn size={18} /> Masuk</> : <><UserPlus size={18} /> Daftar</>)
            }
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          {mode === 'signIn' ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button onClick={toggleMode} className="font-semibold text-maxim-yellow hover:underline ml-2">
            {mode === 'signIn' ? 'Daftar Sekarang' : 'Masuk di Sini'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
