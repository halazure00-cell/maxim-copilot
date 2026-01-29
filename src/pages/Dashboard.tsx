import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { Profile, Transaksi } from '../types'; // SALAH
import { TrendingUp, Wallet, AlertTriangle, ChevronRight, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getCurrentStrategy, STRATEGY_LABELS } from '../services/schedule';

const ZoneMap = lazy(() => import('../components/ZoneMap'));

interface DashboardProps {
  profile: Profile;
  transaksi: Transaksi[];
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, transaksi }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todayKey = useMemo(() => now.toDateString(), [now]);

  const pendapatanHariIni = useMemo(() => {
    return transaksi
      .filter(t => t.tipe === 'masuk' && new Date(t.created_at).toDateString() === todayKey)
      .reduce((acc, curr) => acc + curr.jumlah, 0);
  }, [transaksi, todayKey]);

  const persentaseTarget = useMemo(() => {
    return profile.target_harian > 0 
      ? Math.min(100, Math.round((pendapatanHariIni / profile.target_harian) * 100))
      : 0;
  }, [pendapatanHariIni, profile.target_harian]);

  const dataChart = useMemo(() => ([
    { name: 'Selesai', value: pendapatanHariIni },
    { name: 'Sisa', value: Math.max(0, profile.target_harian - pendapatanHariIni) },
  ]), [pendapatanHariIni, profile.target_harian]);

  const currentStrategy = useMemo(() => getCurrentStrategy(now), [now]);
  const strategyLabel = STRATEGY_LABELS[currentStrategy];

  const CHART_COLORS = ['#FFCC00', '#2A2A2A'];

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-brand-surface to-brand-gray p-5 rounded-2xl border border-brand-gray shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MapPin size={80} />
        </div>
        <h2 className="text-gray-400 text-sm font-medium">Halo, Driver Tangguh</h2>
        <h1 className="text-2xl font-bold text-white mt-1">{profile.nama_lengkap}</h1>
        <div className="mt-4 flex items-center space-x-2">
          <span className="bg-brand-yellow text-brand-black px-2 py-1 rounded font-bold text-sm">
            {profile.plat_nomor}
          </span>
          <span className="text-xs text-green-400 flex items-center bg-green-900/30 px-2 py-1 rounded">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Aktif
          </span>
        </div>
      </div>

      <div className="bg-brand-surface p-5 rounded-2xl border border-brand-gray shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold flex items-center">
            <TrendingUp className="text-brand-yellow mr-2" size={20} />
            Target Harian
          </h3>
          <span className="text-sm text-gray-400">{persentaseTarget}% Tercapai</span>
        </div>

        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-brand-gray px-2 py-1 text-[10px] font-semibold text-gray-200">
            Strategi Aktif: {strategyLabel}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {dataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-300">{persentaseTarget}%</span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Pendapatan Hari Ini</p>
            <p className="text-2xl font-bold text-white">{formatRupiah(pendapatanHariIni)}</p>
            <div className="w-full bg-brand-gray h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-brand-yellow h-full rounded-full transition-all duration-1000"
                style={{ width: `${persentaseTarget}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {formatRupiah(profile.target_harian)}</p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full rounded-2xl overflow-hidden border border-brand-gray shadow-lg relative">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-brand-surface">
              <div className="flex items-center gap-3 text-brand-yellow" role="status" aria-live="polite">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent"
                  aria-hidden="true"
                ></div>
                <span className="text-sm font-semibold text-white">Memuat peta...</span>
              </div>
            </div>
          }
        >
          <ZoneMap />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-surface p-4 rounded-xl border border-brand-gray shadow-md">
           <div className="flex items-start justify-between">
             <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
               <Wallet size={24} />
             </div>
             <ChevronRight size={16} className="text-gray-600" />
           </div>
           <p className="text-gray-400 text-xs mt-3">Saldo Dompet</p>
           <p className="text-xl font-bold text-white">Rp 250.000</p>
        </div>
        
        <button 
          onClick={() => toast.success(`SOS Dikirim ke ${profile.nomor_darurat}`, { duration: 4000 })}
          className="bg-red-500/10 p-4 rounded-xl border border-red-500/30 shadow-md active:bg-red-500/20 transition-colors text-left"
        >
           <div className="flex items-start justify-between">
             <div className="bg-red-500/20 p-2 rounded-lg text-red-500 animate-pulse">
               <AlertTriangle size={24} />
             </div>
             <span className="text-red-500 text-xs font-bold border border-red-500 rounded px-1">DARURAT</span>
           </div>
           <p className="text-red-400 text-xs mt-3">Butuh Bantuan?</p>
           <p className="text-xl font-bold text-red-500">SOS</p>
        </button>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-200">Aktivitas Terakhir</h3>
          <span className="text-xs text-brand-yellow">Lihat Semua</span>
        </div>
        <div className="space-y-3">
          {transaksi.slice(0, 3).map((t) => (
             <div key={t.id} className="bg-brand-surface p-3 rounded-xl flex justify-between items-center border border-brand-gray">
               <div className="flex items-center space-x-3">
                 <div className={`w-2 h-10 rounded-full ${t.tipe === 'masuk' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <div>
                   <p className="font-medium text-sm text-gray-200">{t.keterangan}</p>
                   <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
               </div>
               <span className={`font-bold ${t.tipe === 'masuk' ? 'text-green-400' : 'text-gray-400'}`}>
                 {t.tipe === 'masuk' ? '+' : '-'}{formatRupiah(t.jumlah)}
               </span>
             </div>
          ))}
          {transaksi.length === 0 && (
            <p className="text-gray-500 text-center text-sm py-4">Belum ada aktivitas hari ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
