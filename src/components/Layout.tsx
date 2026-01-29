import React from 'react';
import { Home, List, User, Car } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen h-screen bg-brand-black text-gray-100 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-brand-surface border-b border-brand-gray/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="bg-brand-yellow p-1.5 rounded-lg text-brand-black">
            <Car size={20} strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            <span className="text-brand-yellow">MAXIM</span> DRIVER
          </h1>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4 pb-24">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-gray/50 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === 'dashboard' ? 'text-brand-yellow' : 'text-gray-500'
            }`}
          >
            <Home size={24} strokeWidth={currentView === 'dashboard' ? 3 : 2} />
            <span className="text-xs mt-1 font-medium">Beranda</span>
          </button>
          
          <button
            onClick={() => setView('transaksi')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === 'transaksi' ? 'text-brand-yellow' : 'text-gray-500'
            }`}
          >
            <List size={24} strokeWidth={currentView === 'transaksi' ? 3 : 2} />
            <span className="text-xs mt-1 font-medium">Transaksi</span>
          </button>
          
          <button
            onClick={() => setView('profil')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === 'profil' ? 'text-brand-yellow' : 'text-gray-500'
            }`}
          >
            <User size={24} strokeWidth={currentView === 'profil' ? 3 : 2} />
            <span className="text-xs mt-1 font-medium">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
