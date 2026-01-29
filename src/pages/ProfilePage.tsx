import React, { useState } from 'react';
import { Profile } from '../types';
import { updateProfile } from '../services/mockService';
import { signOut } from '../services/authService';
import { User, Shield, Phone, Save, LogOut } from 'lucide-react';

interface ProfilePageProps {
  profile: Profile;
  onUpdate: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    nama_lengkap: profile.nama_lengkap,
    nomor_darurat: profile.nomor_darurat,
    target_harian: profile.target_harian,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target_harian' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Gagal update profile", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-6">
        <div className="w-24 h-24 bg-brand-gray rounded-full mx-auto flex items-center justify-center border-4 border-brand-surface shadow-xl">
          <User size={48} className="text-brand-yellow" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-white">{profile.nama_lengkap}</h2>
        <p className="text-brand-yellow font-mono bg-brand-yellow/10 inline-block px-3 py-1 rounded mt-1">
          {profile.plat_nomor}
        </p>
      </div>

      <div className="bg-brand-surface rounded-2xl border border-brand-gray overflow-hidden">
        <div className="p-4 border-b border-brand-gray flex justify-between items-center">
          <h3 className="font-bold text-gray-200">Informasi Pribadi</h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors flex items-center ${
              isEditing 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-brand-gray text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isEditing ? <><Save size={14} className="mr-1"/> Simpan</> : 'Edit'}
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Nama Lengkap</label>
            {isEditing ? (
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-gray rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
              />
            ) : (
              <p className="text-white font-medium text-lg">{profile.nama_lengkap}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Target Harian (Rp)</label>
            {isEditing ? (
              <input
                type="number"
                name="target_harian"
                value={formData.target_harian}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-gray rounded-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
              />
            ) : (
              <p className="text-white font-medium text-lg">Rp {profile.target_harian?.toLocaleString('id-ID')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-brand-surface rounded-2xl border border-brand-gray overflow-hidden relative">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield size={100} />
         </div>
         <div className="p-4 border-b border-brand-gray">
          <h3 className="font-bold text-red-400 flex items-center">
            <Shield size={18} className="mr-2" />
            Keamanan (SOS)
          </h3>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Nomor ini akan dihubungi secara otomatis ketika Anda menekan tombol SOS di Dashboard.
          </p>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Nomor Darurat</label>
            {isEditing ? (
               <div className="flex items-center">
                 <span className="bg-brand-gray px-3 py-3 rounded-l-lg border border-brand-gray text-gray-400 border-r-0">
                   <Phone size={16} />
                 </span>
                 <input
                  type="text"
                  name="nomor_darurat"
                  value={formData.nomor_darurat}
                  onChange={handleChange}
                  className="w-full bg-brand-black border border-brand-gray rounded-r-lg p-3 text-white focus:border-brand-yellow focus:outline-none"
                />
               </div>
            ) : (
              <div className="flex items-center space-x-3 text-white bg-brand-black p-3 rounded-lg border border-brand-gray/50">
                 <Phone size={18} className="text-gray-500" />
                 <span className="font-mono text-lg">{profile.nomor_darurat}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button onClick={signOut} className="w-full py-4 rounded-xl border border-red-500/30 text-red-500 font-bold flex items-center justify-center hover:bg-red-500/10 transition-colors mt-8">
        <LogOut size={20} className="mr-2" />
        Keluar Aplikasi
      </button>
      
      <p className="text-center text-xs text-gray-600 pb-4">
        Versi Aplikasi 1.0.0 (Build 240)
      </p>
    </div>
  );
};

export default ProfilePage;
