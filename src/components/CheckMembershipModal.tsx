import { useState } from 'react';
import { X, Search, AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { Member } from '../types';

interface CheckMembershipModalProps {
  members: Member[];
  onClose: () => void;
  onOpenRegister: (type: 'monthly' | 'daily') => void;
}

export default function CheckMembershipModal({ members, onClose, onOpenRegister }: CheckMembershipModalProps) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Member[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.toLowerCase();
    const matched = members.filter(m => 
      m.name.toLowerCase().includes(q) || m.phone.includes(q)
    );

    setSearchResult(matched);
    setSearched(true);
  };

  const today = new Date();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl animate-fadeIn my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Sistem Notifikasi & Masa Aktif
          </span>
          <h3 className="text-2xl font-black mt-2">Cek Status Member Go Gym</h3>
          <p className="text-xs text-slate-400 mt-1">Masukkan nama atau nomor WhatsApp untuk melihat sisa masa aktif member Anda.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau no. HP (Contoh: Budi)"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-sm outline-none"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Cari
          </button>
        </form>

        {searched && searchResult && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {searchResult.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800">
                <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-2 opacity-80" />
                <p className="text-slate-300 text-sm font-semibold">Member tidak ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">Pastikan nama atau nomor HP terdaftar di Go Gym Rancaekek.</p>
              </div>
            ) : (
              searchResult.map((member) => {
                const expiry = new Date(member.expiryDate);
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
                const isExpired = diffDays < 0;

                return (
                  <div 
                    key={member.id}
                    className={`p-4 rounded-xl border ${isExpired ? 'bg-red-950/20 border-red-500/40' : isExpiringSoon ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950 border-slate-800'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{member.name}</h4>
                        <p className="text-xs text-slate-400">{member.phone}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${isExpired ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isExpiringSoon ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {isExpired ? 'Expired' : isExpiringSoon ? 'Segera Berakhir' : 'Active Member'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 mb-3 text-slate-300 pt-2 border-t border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paket:</span>
                        <span className="font-semibold text-white uppercase">{member.packageType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Terdaftar:</span>
                        <span>{member.registrationDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Berlaku Sampai:</span>
                        <span className={isExpired || isExpiringSoon ? 'text-red-400 font-bold' : 'text-green-400 font-semibold'}>{member.expiryDate}</span>
                      </div>
                    </div>

                    {/* Automated Notification Alert Banner */}
                    {isExpired && (
                      <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2 text-red-300 text-xs mb-3">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>Masa aktif Anda telah habis! Silakan perpanjang member untuk kembali berlatih.</span>
                      </div>
                    )}

                    {isExpiringSoon && !isExpired && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg flex items-center gap-2 text-amber-300 text-xs mb-3">
                        <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                        <span><strong>Notifikasi Sistem:</strong> Masa aktif member akan habis dalam {diffDays} hari lagi. Segera perpanjang!</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onOpenRegister('monthly');
                      }}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Perpanjang / Daftar Ulang Member
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
