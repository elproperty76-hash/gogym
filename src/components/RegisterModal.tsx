import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, CreditCard, Smartphone } from 'lucide-react';
import { Member, NonMemberPass, Transaction } from '../types';
import { addMember, addNonMember, addTransaction } from '../services/firebaseService';

interface RegisterModalProps {
  initialType: 'monthly' | 'daily';
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ initialType, onClose, onSuccess }: RegisterModalProps) {
  const [type, setType] = useState<'monthly' | 'daily'>(initialType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [packageType, setPackageType] = useState<'monthly' | '3_months' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState('QRIS (Midtrans)');
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const calculateAmount = () => {
    if (type === 'daily') return 20000;
    if (packageType === 'monthly') return 150000;
    if (packageType === '3_months') return 400000;
    if (packageType === 'yearly') return 1500000;
    return 150000;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Mohon isi nama dan nomor WhatsApp terlebih dahulu.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const amount = calculateAmount();

    try {
      if (type === 'monthly') {
        // Calculate expiry date
        const expiryDateObj = new Date();
        if (packageType === 'monthly') expiryDateObj.setMonth(expiryDateObj.getMonth() + 1);
        else if (packageType === '3_months') expiryDateObj.setMonth(expiryDateObj.getMonth() + 3);
        else if (packageType === 'yearly') expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);
        
        const expiryDate = expiryDateObj.toISOString().split('T')[0];

        const newMember: Omit<Member, 'id'> = {
          name,
          phone,
          email: email || `${phone}@gogym.id`,
          packageType,
          registrationDate: today,
          expiryDate,
          status: 'active',
          amountPaid: amount,
          paymentMethod
        };

        const saved = await addMember(newMember);
        await addTransaction({
          type: 'member_registration',
          customerName: name,
          amount,
          date: today,
          paymentMethod,
          status: 'success'
        });

        setSuccessData({ ...saved, type: 'monthly' });
      } else {
        const newPass: Omit<NonMemberPass, 'id'> = {
          name,
          phone,
          visitDate: today,
          amountPaid: amount,
          paymentMethod,
          status: 'completed'
        };

        const saved = await addNonMember(newPass);
        await addTransaction({
          type: 'daily_pass',
          customerName: name,
          amount,
          date: today,
          paymentMethod,
          status: 'success'
        });

        setSuccessData({ ...saved, type: 'daily' });
      }

      setStep('success');
      onSuccess();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl animate-fadeIn my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                Go Gym Rancaekek
              </span>
              <h3 className="text-2xl font-black mt-2">
                {type === 'monthly' ? 'Pendaftaran Member Bulanan' : 'Beli Pass Latihan Harian'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Bumi Pesona Asri Blok A3 No.9, Rancaekek Bandung</p>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setType('monthly')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all ${type === 'monthly' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Member Bulanan
              </button>
              <button
                type="button"
                onClick={() => setType('daily')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all ${type === 'daily' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Latihan Harian (Rp 20rb)
              </button>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">No. WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Opsional untuk Notifikasi)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: budi@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-sm outline-none"
                />
              </div>

              {type === 'monthly' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Durasi Paket</label>
                  <select
                    value={packageType}
                    onChange={(e: any) => setPackageType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-orange-500 text-white text-sm outline-none"
                  >
                    <option value="monthly">1 Bulan - Rp 150.000</option>
                    <option value="3_months">3 Bulan - Rp 400.000 (Hemat Rp 50rb)</option>
                    <option value="yearly">1 Tahun - Rp 1.500.000 (VIP Best Value)</option>
                  </select>
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-300 font-medium">Total Pembayaran:</span>
                <span className="text-xl font-black text-orange-400">
                  Rp {calculateAmount().toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all mt-2"
              >
                Lanjutkan ke Pembayaran Aman
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Secure Payment Gateway
              </span>
              <h3 className="text-2xl font-black mt-2">Pilih Metode Pembayaran</h3>
              <p className="text-xs text-slate-400 mt-1">Didukung oleh Midtrans & QRIS Instant</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { id: 'QRIS (Midtrans)', label: 'QRIS (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri)', icon: QrCode },
                { id: 'Transfer BCA', label: 'Transfer Bank BCA (4370128899 an. Go Gym)', icon: CreditCard },
                { id: 'Transfer Mandiri', label: 'Transfer Bank Mandiri (131001992881 an. Go Gym)', icon: CreditCard },
                { id: 'Cash di Loket Gym', label: 'Bayar Tunai / Cash Langsung di Loket Gym', icon: Smartphone }
              ].map((m) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === m.id ? 'bg-orange-500/10 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                  >
                    <IconComponent className={`w-5 h-5 ${paymentMethod === m.id ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold">{m.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Nama:</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>No. WhatsApp:</span>
                <span className="text-white font-medium">{phone}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Tagihan:</span>
                <span className="text-orange-400 font-bold">Rp {calculateAmount().toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmPayment}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && successData && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-white mb-1">PEMBAYARAN BERHASIL!</h3>
            <p className="text-xs text-slate-300 mb-6">
              Terima kasih <strong className="text-white">{successData.name}</strong>. Pendaftaran Go Gym Rancaekek berhasil dicatat ke sistem database.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">ID Transaksi:</span>
                <span className="text-orange-400 font-mono font-bold">{successData.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Metode Bayar:</span>
                <span className="text-white font-medium">{successData.paymentMethod}</span>
              </div>
              {successData.type === 'monthly' ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Masa Berlaku:</span>
                    <span className="text-green-400 font-semibold">{successData.registrationDate} s/d {successData.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-green-400 font-bold uppercase">Active Member</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Tanggal Kunjungan:</span>
                  <span className="text-green-400 font-semibold">{successData.visitDate} (Daily Pass)</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Screenshot atau simpan bukti ini dan tunjukkan kepada petugas di lokasi: <br />
              <strong className="text-orange-400">Bumi Pesona Asri Blok A3 No.9 Rancaekek Bandung</strong>
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow"
            >
              Tutup & Selesai
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
