import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProfilePage from './pages/ProfilePage';
import { useAppStore } from './stores/useAppStore';

function App() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const profile = useAppStore((s) => s.profile);
  const transaksi = useAppStore((s) => s.transaksi);
  const loading = useAppStore((s) => s.loading);
  const refresh = useAppStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
            onRefresh={refresh}
          />
        );
      case 'transaksi':
        return (
          <Transactions 
            transaksi={transaksi} 
            onRefresh={refresh} 
          />
        );
      case 'profil':
        return (
          <ProfilePage 
            profile={profile} 
            onUpdate={refresh} 
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
          className: 'bg-[#1f1f1f] text-white font-bold border border-zinc-600 shadow-lg',
          success: {
            className: 'bg-[#1f1f1f] text-white font-bold border border-green-500 shadow-lg',
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1f1f1f',
            },
          },
          error: {
            className: 'bg-[#1f1f1f] text-white font-bold border border-red-500 shadow-lg',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f1f1f',
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
