import React, { useState } from 'react';
import { Transaksi } from '../types';
import { addTransaksi } from '../services/mockService';
import { PlusCircle, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';

interface TransactionsProps {
  transaksi: Transaksi[];
  onRefresh: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transaksi, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'masuk' | 'keluar'>('all');

  // Form State
  const [tipe, setTipe] = useState<'masuk' | 'keluar'>('masuk');
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumlah || !keterangan) return;

    setIsSubmitting(true);
    try {
      await addTransaksi({
        tipe,
        jumlah: parseInt(jumlah),
        keterangan
      });
      // Reset form
      setJumlah('');
      setKeterangan('');
      setShowForm(false);
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransaksi = transaksi.filter(t => {
    if (filter === 'all') return true;
    return t.tipe === filter;
  });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="space-y-4 animate-fade-in relative min-h-[80vh]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Riwayat</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-yellow text-brand-black px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg active:scale-95 transition-transform"
        >
          <PlusCircle size={18} className="mr-2" />
          Catat Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 bg-brand-surface rounded-xl border border-brand-gray">
        {(['all', 'masuk', 'keluar'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f 
                ? 'bg-brand-gray text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'masok' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3 pb-20">
        {filteredTransaksi.length > 0 ? filteredTransaksi.map((t) => (
          <div key={t.id} className="bg-brand-surface p-4 rounded-xl border border-brand-gray shadow-sm flex justify-between items-center group">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                t.tipe === 'masuk' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {t.tipe === 'masuk' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <p className="font-bold text-gray-200">{t.keterangan}</p>
                <p className="text-xs text-gray-500">
                  {new Date(t.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <span className={`font-mono font-bold ${
              t.tipe === 'masuk' ? 'text-green-400' : 'text-gray-400'
            }`}>
              {t.tipe === 'masuk' ? '+' : '-'}{formatRupiah(t.jumlah)}
            </span>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 opacity-50">
            <Filter size={48} className="mb-2" />
            <p>Tidak ada transaksi ditemukan</p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal / Bottom Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-brand-surface w-full max-w-md rounded-2xl p-6 border border-brand-gray shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">Catat Transaksi</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipe('masuk')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    tipe === 'masuk' 
                      ? 'border-green-500 bg-green-500/20 text-green-500' 
                      : 'border-brand-gray text-gray-500'
                  }`}
                >
                  <ArrowDownLeft size={24} className="mb-1" />
                  <span className="font-bold text-sm">Pemasukan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipe('keluar')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    tipe === 'keluar' 
                      ? 'border-red-500 bg-red-500/20 text-red-500' 
                      : 'border-brand-gray text-gray-500'
                  }`}
                >
                  <ArrowUpRight size={24} className="mb-1" />
                  <span className="font-bold text-sm">Pengeluaran</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-3 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-3 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
                  placeholder="Contoh: Trip Bandara, Bensin"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-brand-gray text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-brand-yellow text-brand-black rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
