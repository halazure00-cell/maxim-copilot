import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- BAGIAN PENTING (JANGAN DIHAPUS) ---

// 1. Import CSS Leaflet
// Wajib ada agar peta muncul rapi (tiles tersusun benar). 
// Jika ini hilang, peta akan terlihat pecah-pecah ke bawah.
import 'leaflet/dist/leaflet.css';

// 2. Import CSS Utama (Tailwind)
// Pastikan file 'index.css' ada di folder src Anda.
import './index.css'; 

// --- AKHIR BAGIAN PENTING ---

const rootElement = document.getElementById('root');

// Pengecekan keamanan (Safety Check) untuk TypeScript
if (!rootElement) {
  throw new Error("Fatal Error: Gagal menemukan elemen dengan ID 'root' di index.html");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);