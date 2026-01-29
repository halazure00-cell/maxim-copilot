import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 ${isActive ? 'text-maxim-yellow' : 'text-gray-400 hover:text-white'}`;
  };

  return (
    <div className="min-h-screen bg-maxim-black">
      <main className="pb-20">{children}</main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-maxim-black border-t border-zinc-700 shadow-lg">
        <div className="grid grid-cols-3 h-16 max-w-lg mx-auto">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <Home className="w-6 h-6 mb-1" />
            <span>Beranda</span>
          </Link>
          <Link to="/transaksi" className={getLinkClass('/transaksi')}>
            <List className="w-6 h-6 mb-1" />
            <span>Transaksi</span>
          </Link>
          <Link to="/profil" className={getLinkClass('/profil')}>
            <User className="w-6 h-6 mb-1" />
            <span>Profil</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};
