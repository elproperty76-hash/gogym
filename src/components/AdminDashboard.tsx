import { useState } from 'react';
import { 
  Users, UserCheck, Calendar, Bell, DollarSign, LogOut, Plus, Edit, Trash2, 
  FileSpreadsheet, FileText, CheckCircle2, X, Tag, Image as ImageIcon, Camera, Upload 
} from 'lucide-react';
import { Member, NonMemberPass, Announcement, Instructor, BoxingSchedule, Transaction, GymPricing, GalleryItem, AppSettings } from '../types';
import * as firebaseService from '../services/firebaseService';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

interface AdminDashboardProps {
  members: Member[];
  nonMembers: NonMemberPass[];
  announcements: Announcement[];
  instructors: Instructor[];
  schedules: BoxingSchedule[];
  transactions: Transaction[];
  pricings: GymPricing[];
  gallery: GalleryItem[];
  appSettings: AppSettings | null;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  members,
  nonMembers,
  announcements,
  instructors,
  schedules,
  transactions,
  pricings,
  gallery,
  appSettings,
  onRefresh,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'nonMembers' | 'pricing' | 'gallery' | 'settings' | 'announcements' | 'instructors' | 'boxing' | 'finance'>('members');

  // Modal State for Add / Edit
  const [modalType, setModalType] = useState<'member' | 'nonMember' | 'announcement' | 'instructor' | 'schedule' | 'pricing' | 'gallery' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState<any>({});
  const [featuresInput, setFeaturesInput] = useState('');
  const [heroForm, setHeroForm] = useState<AppSettings>(appSettings || {
    id: 'main_settings',
    heroImageUrl: '',
    heroTitle: '',
    heroSubtitle: ''
  });

  // Open Add Modal
  const handleOpenAdd = (type: 'member' | 'nonMember' | 'announcement' | 'instructor' | 'schedule' | 'pricing' | 'gallery') => {
    setModalType(type);
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (type === 'member') {
      setFormData({ name: '', phone: '', email: '', packageType: 'monthly', registrationDate: today, expiryDate: expiry, status: 'active', amountPaid: 150000, paymentMethod: 'Cash' });
    } else if (type === 'nonMember') {
      setFormData({ name: '', phone: '', visitDate: today, amountPaid: 20000, paymentMethod: 'Cash', status: 'completed' });
    } else if (type === 'announcement') {
      setFormData({ title: '', content: '', date: today, tag: 'Promo' });
    } else if (type === 'instructor') {
      setFormData({ name: '', specialty: '', experience: '5 Tahun', photoUrl: '', bio: '' });
    } else if (type === 'schedule') {
      setFormData({ day: 'Senin', time: '16:00 - 17:30 WIB', coach: 'Coach Siti Aminah', level: 'Semua Level', quota: 15 });
    } else if (type === 'pricing') {
      setFormData({ title: '', category: 'monthly', price: 150000, period: '/ bulan', description: '', isPopular: false });
      setFeaturesInput('Full Access Alat Fitness, Ruang Gym Ber-AC, Free Air Mineral');
    } else if (type === 'gallery') {
      setFormData({ title: '', category: 'Fasilitas Utama', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', description: '' });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (type: 'member' | 'nonMember' | 'announcement' | 'instructor' | 'schedule' | 'pricing' | 'gallery', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
    if (type === 'pricing' && item.features) {
      setFeaturesInput(item.features.join(', '));
    }
  };

  // Image File / Camera Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (modalType === 'gallery' || modalType === 'instructor' || modalType === 'announcement') {
          setFormData(prev => ({ ...prev, [fieldName]: result }));
        } else if (activeTab === 'settings') {
          setHeroForm(prev => ({ ...prev, [fieldName]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Handler
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'member') {
        if (editingItem) {
          await firebaseService.updateMember(editingItem.id, formData);
        } else {
          await firebaseService.addMember(formData);
          await firebaseService.addTransaction({
            type: 'member_registration',
            customerName: formData.name,
            amount: Number(formData.amountPaid),
            date: formData.registrationDate,
            paymentMethod: formData.paymentMethod,
            status: 'success'
          });
        }
      } else if (modalType === 'nonMember') {
        if (editingItem) {
          await firebaseService.updateNonMember(editingItem.id, formData);
        } else {
          await firebaseService.addNonMember(formData);
          await firebaseService.addTransaction({
            type: 'daily_pass',
            customerName: formData.name,
            amount: Number(formData.amountPaid),
            date: formData.visitDate,
            paymentMethod: formData.paymentMethod,
            status: 'success'
          });
        }
      } else if (modalType === 'announcement') {
        if (editingItem) {
          await firebaseService.updateAnnouncement(editingItem.id, formData);
        } else {
          await firebaseService.addAnnouncement(formData);
        }
      } else if (modalType === 'instructor') {
        if (editingItem) {
          await firebaseService.updateInstructor(editingItem.id, formData);
        } else {
          await firebaseService.addInstructor(formData);
        }
      } else if (modalType === 'schedule') {
        if (editingItem) {
          await firebaseService.updateBoxingSchedule(editingItem.id, formData);
        } else {
          await firebaseService.addBoxingSchedule(formData);
        }
      } else if (modalType === 'pricing') {
        const featuresArray = featuresInput.split(',').map(s => s.trim()).filter(Boolean);
        const pricingData = {
          ...formData,
          price: Number(formData.price),
          features: featuresArray
        };
        if (editingItem) {
          await firebaseService.updatePricing(editingItem.id, pricingData);
        } else {
          await firebaseService.addPricing(pricingData);
        }
      } else if (modalType === 'gallery') {
        if (editingItem) {
          await firebaseService.updateGalleryItem(editingItem.id, formData);
        } else {
          await firebaseService.addGalleryItem(formData);
        }
      }

      setModalType(null);
      setEditingItem(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan data.');
    }
  };

  // Save Hero Settings
  const handleSaveHeroSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await firebaseService.updateAppSettings(heroForm);
      alert('Pengaturan Beranda & Hero berhasil disimpan!');
      onRefresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan beranda.');
    }
  };

  // Delete Handlers
  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      if (type === 'member') await firebaseService.deleteMember(id);
      else if (type === 'nonMember') await firebaseService.deleteNonMember(id);
      else if (type === 'announcement') await firebaseService.deleteAnnouncement(id);
      else if (type === 'instructor') await firebaseService.deleteInstructor(id);
      else if (type === 'schedule') await firebaseService.deleteBoxingSchedule(id);
      else if (type === 'pricing') await firebaseService.deletePricing(id);
      else if (type === 'gallery') await firebaseService.deleteGalleryItem(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus data.');
    }
  };

  // Export Financial Reports to Excel (.xlsx)
  const handleExportExcel = () => {
    const dataToExport = transactions.map((t, idx) => ({
      No: idx + 1,
      'ID Transaksi': t.id,
      'Jenis Transaksi': t.type,
      'Nama Pelanggan': t.customerName,
      'Jumlah (Rp)': t.amount,
      'Tanggal': t.date,
      'Metode Pembayaran': t.paymentMethod,
      'Status': t.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan Go Gym");
    XLSX.writeFile(wb, `GoGym_Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export Financial Reports to PDF (.pdf)
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("GO GYM - LAPORAN KEUANGAN", 14, 20);
    doc.setFontSize(10);
    doc.text("Lokasi: Bumi Pesona Asri Blok A3 No.9 Rancaekek Bandung", 14, 26);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);

    let y = 42;
    doc.setFontSize(11);
    doc.text("No. | Nama Pelanggan | Jenis | Tanggal | Jumlah (Rp) | Pembayaran", 14, y);
    y += 6;
    doc.line(14, y, 196, y);
    y += 8;

    let total = 0;
    transactions.forEach((t, index) => {
      total += t.amount;
      const line = `${index + 1}. ${t.customerName.padEnd(18)} | ${t.type.padEnd(15)} | ${t.date} | Rp ${t.amount.toLocaleString('id-ID')} | ${t.paymentMethod}`;
      doc.text(line, 14, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 6;
    doc.line(14, y, 196, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`TOTAL PENDAPATAN: Rp ${total.toLocaleString('id-ID')}`, 14, y);

    doc.save(`GoGym_Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950">
              GG
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Panel Pengelola Go Gym</h1>
              <p className="text-xs text-slate-400">Bumi Pesona Asri Blok A3 No.9 Rancaekek</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar Admin
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          {[
            { id: 'members', label: 'Daftar Member', icon: Users, count: members.length },
            { id: 'nonMembers', label: 'Non-Member', icon: UserCheck, count: nonMembers.length },
            { id: 'pricing', label: 'Daftar Harga', icon: Tag, count: pricings.length },
            { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon, count: gallery.length },
            { id: 'settings', label: 'Banner & Hero', icon: Camera, count: 1 },
            { id: 'announcements', label: 'Informasi', icon: Bell, count: announcements.length },
            { id: 'instructors', label: 'Instruktur', icon: Users, count: instructors.length },
            { id: 'boxing', label: 'Jadwal Boxing', icon: Calendar, count: schedules.length },
            { id: 'finance', label: 'Keuangan', icon: DollarSign, count: transactions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Manajemen Daftar Member</h2>
                <p className="text-xs text-slate-400">Kelola data member bulanan, perpanjangan, dan status keaktifan.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('member')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Tambah Member Baru
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Nama & Kontak</th>
                      <th className="p-4">Paket</th>
                      <th className="p-4">Tanggal Daftar</th>
                      <th className="p-4">Masa Berlaku</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Bayar</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {members.map((m) => {
                      const isExpired = new Date(m.expiryDate) < new Date();
                      return (
                        <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.phone}</div>
                          </td>
                          <td className="p-4 uppercase text-xs font-semibold text-orange-400">
                            {m.packageType.replace('_', ' ')}
                          </td>
                          <td className="p-4 text-xs text-slate-300">{m.registrationDate}</td>
                          <td className="p-4 text-xs font-semibold text-slate-200">{m.expiryDate}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${isExpired ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-mono font-bold text-amber-400">
                            Rp {m.amountPaid.toLocaleString('id-ID')}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEdit('member', m)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('member', m.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NON-MEMBERS */}
        {activeTab === 'nonMembers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Manajemen Daftar Non-Member / Harian</h2>
                <p className="text-xs text-slate-400">Kelola kunjungan gym harian (Daily Pass).</p>
              </div>
              <button
                onClick={() => handleOpenAdd('nonMember')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Catat Kunjungan Harian
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Nama Pengunjung</th>
                      <th className="p-4">No. HP</th>
                      <th className="p-4">Tanggal Kunjungan</th>
                      <th className="p-4">Biaya</th>
                      <th className="p-4">Metode Bayar</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {nonMembers.map((nm) => (
                      <tr key={nm.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-white">{nm.name}</td>
                        <td className="p-4 text-xs text-slate-400">{nm.phone}</td>
                        <td className="p-4 text-xs text-slate-300">{nm.visitDate}</td>
                        <td className="p-4 text-xs font-mono font-bold text-amber-400">Rp {nm.amountPaid.toLocaleString('id-ID')}</td>
                        <td className="p-4 text-xs text-slate-300">{nm.paymentMethod}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit('nonMember', nm)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('nonMember', nm.id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Manajemen Daftar Harga</h2>
                <p className="text-xs text-slate-400">Kelola harga bulanan member, harian non-member, dan paket khusus.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('pricing')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Tambah Paket Harga
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricings.map((p) => (
                <div key={p.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase">
                        {p.category}
                      </span>
                      {p.isPopular && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          Populer
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{p.title}</h3>
                    <div className="text-2xl font-black text-orange-400 mb-2">
                      Rp {p.price.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">{p.period}</span>
                    </div>
                    <p className="text-slate-300 text-xs mb-4">{p.description}</p>
                    <div className="space-y-1 mb-6">
                      <div className="text-[11px] font-semibold text-slate-400">Fasilitas:</div>
                      {p.features && p.features.map((f, idx) => (
                        <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEdit('pricing', p)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('pricing', p.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Manajemen Galeri Foto Fasilitas</h2>
                <p className="text-xs text-slate-400">Tambah, edit, atau hapus foto galeri dari galeri HP / storage lokal / langsung kamera.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('gallery')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Tambah Foto Galeri
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <span className="absolute top-3 right-3 bg-slate-950/80 text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {item.category}
                      </span>
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-300 text-xs">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex justify-end gap-2 border-t border-slate-800/80 mt-4">
                    <button
                      onClick={() => handleOpenEdit('gallery', item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('gallery', item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HERO SETTINGS & CAMERA UPLOAD */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-black">Pengaturan Banner & Gambar Utama (Hero)</h2>
              <p className="text-xs text-slate-400">Ubah gambar banner utama halaman beranda langsung dari HP, galeri file, atau kamera perangkat.</p>
            </div>

            <form onSubmit={handleSaveHeroSettings} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Judul Utama Hero (Heading)</label>
                <input 
                  type="text" 
                  required 
                  value={heroForm.heroTitle || ''} 
                  onChange={e => setHeroForm({...heroForm, heroTitle: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Subjudul (Deskripsi Hero)</label>
                <textarea 
                  rows={3} 
                  required 
                  value={heroForm.heroSubtitle || ''} 
                  onChange={e => setHeroForm({...heroForm, heroSubtitle: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Gambar Utama (Hero Image)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    {heroForm.heroImageUrl ? (
                      <img src={heroForm.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <input 
                      type="url" 
                      value={heroForm.heroImageUrl || ''} 
                      onChange={e => setHeroForm({...heroForm, heroImageUrl: e.target.value})} 
                      placeholder="Atau masukkan URL gambar..." 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs" 
                    />
                    
                    <div className="flex flex-wrap gap-3">
                      <label className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow">
                        <Upload className="w-4 h-4" /> Pilih dari Galeri HP / File
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'heroImageUrl')} className="hidden" />
                      </label>
                      <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer shadow">
                        <Camera className="w-4 h-4" /> Ambil dari Kamera
                        <input type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'heroImageUrl')} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg">
                Simpan Perubahan Beranda
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Informasi & Pengumuman</h2>
                <p className="text-xs text-slate-400">Tambah, edit, atau hapus pengumuman.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('announcement')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Buat Informasi Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.map((item) => (
                <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                        {item.tag}
                      </span>
                      <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-sm mb-6">{item.content}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEdit('announcement', item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('announcement', item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INSTRUCTORS */}
        {activeTab === 'instructors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Daftar Instruktur & Coach</h2>
                <p className="text-xs text-slate-400">Kelola profil instruktur.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('instructor')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Tambah Instruktur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {instructors.map((ins) => (
                <div key={ins.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div>
                    <img src={ins.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'} alt={ins.name} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white">{ins.name}</h3>
                      <div className="text-orange-400 text-xs font-semibold mb-2">{ins.specialty}</div>
                      <p className="text-slate-300 text-xs mb-4">{ins.bio}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit('instructor', ins)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('instructor', ins.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: BOXING */}
        {activeTab === 'boxing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Jadwal Kelas Boxing</h2>
                <p className="text-xs text-slate-400">Kelola jadwal latihan boxing.</p>
              </div>
              <button
                onClick={() => handleOpenAdd('schedule')}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Tambah Jadwal Boxing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schedules.map((sch) => (
                <div key={sch.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                        {sch.day} - {sch.time}
                      </span>
                      <span className="text-xs text-slate-400">Kuota: {sch.quota} org</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Pelatih: {sch.coach}</h3>
                    <p className="text-orange-300 text-xs font-medium mb-4">{sch.level}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEdit('schedule', sch)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('schedule', sch.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: FINANCE */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Laporan Keuangan Go Gym</h2>
                <p className="text-xs text-slate-400">Rekapitulasi pemasukan member dan non-member.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Download Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  <FileText className="w-4 h-4" /> Download PDF (.pdf)
                </button>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-gradient-to-r from-orange-600/20 via-amber-500/10 to-slate-900 border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-orange-400 font-bold mb-1">Total Pendapatan Go Gym Rancaekek</div>
                <div className="text-3xl sm:text-4xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</div>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
                Total Transaksi Tercatat: <strong className="text-orange-400">{transactions.length} transaksi</strong>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">ID</th>
                      <th className="p-4">Jenis Transaksi</th>
                      <th className="p-4">Nama Pelanggan</th>
                      <th className="p-4">Jumlah</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Metode Bayar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-slate-400">{t.id}</td>
                        <td className="p-4 uppercase text-xs font-bold text-orange-400">{t.type.replace('_', ' ')}</td>
                        <td className="p-4 font-bold text-white">{t.customerName}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">Rp {t.amount.toLocaleString('id-ID')}</td>
                        <td className="p-4 text-xs text-slate-300">{t.date}</td>
                        <td className="p-4 text-xs text-slate-300">{t.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL FOR ADD / EDIT */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white relative shadow-2xl my-8">
            <button onClick={() => setModalType(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black mb-4">
              {editingItem ? 'Edit Data' : 'Tambah Data Baru'} ({modalType})
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {modalType === 'member' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Member</label>
                    <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">No. HP</label>
                    <input type="text" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Paket</label>
                      <select value={formData.packageType || 'monthly'} onChange={e => setFormData({...formData, packageType: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm">
                        <option value="monthly">1 Bulan</option>
                        <option value="3_months">3 Bulan</option>
                        <option value="yearly">1 Tahun</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Biaya (Rp)</label>
                      <input type="number" required value={formData.amountPaid || 150000} onChange={e => setFormData({...formData, amountPaid: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tgl Daftar</label>
                      <input type="date" required value={formData.registrationDate || ''} onChange={e => setFormData({...formData, registrationDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Berlaku (Expiry)</label>
                      <input type="date" required value={formData.expiryDate || ''} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'nonMember' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Pengunjung</label>
                    <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">No. HP</label>
                    <input type="text" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Kunjungan</label>
                      <input type="date" required value={formData.visitDate || ''} onChange={e => setFormData({...formData, visitDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Biaya (Rp)</label>
                      <input type="number" required value={formData.amountPaid || 20000} onChange={e => setFormData({...formData, amountPaid: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'pricing' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Paket</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                      <select value={formData.category || 'monthly'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm">
                        <option value="daily">Harian</option>
                        <option value="monthly">Bulanan</option>
                        <option value="package">Paket</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Harga (Rp)</label>
                      <input type="number" required value={formData.price || 150000} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Periode</label>
                    <input type="text" required value={formData.period || ''} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi</label>
                    <textarea rows={2} required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fasilitas (pisahkan koma)</label>
                    <input type="text" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="isPop" checked={formData.isPopular || false} onChange={e => setFormData({...formData, isPopular: e.target.checked})} className="w-4 h-4 accent-orange-500" />
                    <label htmlFor="isPop" className="text-xs text-slate-300 font-semibold">Tandai sebagai Populer</label>
                  </div>
                </>
              )}

              {modalType === 'gallery' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Foto</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                    <input type="text" required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Foto Galeri (URL / Upload / Kamera)</label>
                    <div className="space-y-2">
                      <input type="url" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="URL gambar..." className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs" />
                      <div className="flex gap-2">
                        <label className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold text-center cursor-pointer">
                          📁 Dari Galeri HP
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'imageUrl')} className="hidden" />
                        </label>
                        <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-xs font-bold text-center cursor-pointer">
                          📷 Dari Kamera
                          <input type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'imageUrl')} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi</label>
                    <textarea rows={2} required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                </>
              )}

              {modalType === 'announcement' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Informasi</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tag</label>
                    <input type="text" required value={formData.tag || ''} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Konten</label>
                    <textarea rows={3} required value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                </>
              )}

              {modalType === 'instructor' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nama</label>
                    <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Spesialisasi</label>
                    <input type="text" required value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Foto (URL / HP / Kamera)</label>
                    <div className="space-y-2">
                      <input type="url" value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} placeholder="URL foto..." className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs" />
                      <div className="flex gap-2">
                        <label className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold text-center cursor-pointer">
                          📁 Galeri HP
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'photoUrl')} className="hidden" />
                        </label>
                        <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-xs font-bold text-center cursor-pointer">
                          📷 Kamera
                          <input type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'photoUrl')} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
                    <textarea rows={2} value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                </>
              )}

              {modalType === 'schedule' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Hari</label>
                      <input type="text" required value={formData.day || ''} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Jam</label>
                      <input type="text" required value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Coach</label>
                    <input type="text" required value={formData.coach || ''} onChange={e => setFormData({...formData, coach: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                    <input type="text" required value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" />
                  </div>
                </>
              )}

              <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow">
                Simpan Data
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
