import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { useAppStore } from './stores/useAppStore';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  // Auth state
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  // App data state
  const {
    currentView,
    setView,
    profile,
    transaksi,
    loading: isDataLoading,
    refresh,
  } = useAppStore();

  // Refresh data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  // Global loading state while checking session
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-maxim-black text-maxim-yellow">
        <div className="w-16 h-16 border-4 border-maxim-yellow border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-lg text-white">Memverifikasi Sesi...</p>
      </div>
    );
  }

  // If not authenticated, show the login page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Main app content renderer
  const renderContent = () => {
    if (isDataLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-maxim-yellow">
          <div className="w-12 h-12 border-4 border-maxim-yellow border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-lg text-white">Memuat Data...</p>
        </div>
      );
    }

    if (!profile) {
        // This can happen briefly after sign-up before profile is created by trigger
        return (
             <div className="flex flex-col items-center justify-center h-[60vh] text-maxim-yellow">
                <div className="w-12 h-12 border-4 border-maxim-yellow border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-lg text-white">Menyiapkan Profil Anda...</p>
            </div>
        );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard profile={profile} transaksi={transaksi} onRefresh={refresh} />;
      case 'transaksi':
        return <Transactions transaksi={transaksi} onRefresh={refresh} />;
      case 'profil':
        return <ProfilePage profile={profile} onUpdate={refresh} />;
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
            className: 'bg-[#1f1f1f] text-white font-bold border-green-500 shadow-lg',
            iconTheme: { primary: '#22c55e', secondary: '#1f1f1f' },
          },
          error: {
            className: 'bg-[#1f1f1f] text-white font-bold border-red-500 shadow-lg',
            iconTheme: { primary: '#ef4444', secondary: '#1f1f1f' },
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
