import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { ViewState, Profile, Transaksi } from './types';
import { getProfile, getTransaksi } from './services/mockService';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, transaksiData] = await Promise.all([
        getProfile(),
        getTransaksi()
      ]);
      setProfile(profileData);
      setTransaksi(transaksiData);
    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-maxim-yellow">
          <div className="w-12 h-12 border-4 border-maxim-yellow border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-lg text-white">Memuat Data...</p>
        </div>
      );
    }

    if (!profile) return <div className="text-center p-8 text-white">Gagal memuat profil.</div>;

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            transaksi={transaksi} 
            onRefresh={refreshData}
          />
        );
      case 'transaksi':
        return (
          <Transactions 
            transaksi={transaksi} 
            onRefresh={refreshData} 
          />
        );
      case 'profil':
        return (
          <ProfilePage 
            profile={profile} 
            onUpdate={refreshData} 
          />
        );
      default:
        return <div className="text-white">Halaman tidak ditemukan</div>;
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#FEEC00', // Maxim Yellow
              secondary: '#121212',
            },
          },
        }}
      />
      <Layout currentView={currentView} setView={setView}>
        {renderContent()}
      </Layout>
    </>
  );
}

export default App;
