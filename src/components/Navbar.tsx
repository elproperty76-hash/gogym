import { useState } from 'react';
import { Dumbbell, Menu, X, ShieldCheck, Bell, UserCheck, Calendar, Users, Home } from 'lucide-react';
import { Member } from '../types';

interface NavbarProps {
  onOpenRegister: (type: 'monthly' | 'daily') => void;
  onOpenCheckMembership: () => void;
  onOpenAdminLogin: () => void;
  members: Member[];
  activeTab: string;
  setActiveTab: (tab: 'home' | 'admin') => void;
}

export default function Navbar({
  onOpenRegister,
  onOpenCheckMembership,
  onOpenAdminLogin,
  members,
  activeTab,
  setActiveTab
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate expiring members for notification badge
  const today = new Date();
  const expiringCount = members.filter(m => {
    if (m.status !== 'active') return false;
    const expiry = new Date(m.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const scrollToSection = (id: string) => {
    setActiveTab('home');
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  GO GYM
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Rancaekek
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Bumi Pesona Asri Blok A3 No.9</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`hover:text-orange-400 transition-colors ${activeTab === 'home' ? 'text-orange-400 font-semibold' : 'text-slate-300'}`}
            >
              Beranda
            </button>
            <button onClick={() => scrollToSection('fasilitas')} className="text-slate-300 hover:text-orange-400 transition-colors">
              Fasilitas
            </button>
            <button onClick={() => scrollToSection('instruktur')} className="text-slate-300 hover:text-orange-400 transition-colors">
              Instruktur
            </button>
            <button onClick={() => scrollToSection('boxing')} className="text-slate-300 hover:text-orange-400 transition-colors">
              Jadwal Boxing
            </button>
            <button onClick={() => scrollToSection('harga')} className="text-slate-300 hover:text-orange-400 transition-colors">
              Harga & Paket
            </button>
            <button onClick={() => scrollToSection('info')} className="text-slate-300 hover:text-orange-400 transition-colors">
              Informasi
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCheckMembership}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Cek Status Member & Reminder Masa Aktif"
            >
              <UserCheck className="w-4 h-4 text-orange-400" />
              <span>Cek Member</span>
              {expiringCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow animate-pulse">
                  {expiringCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onOpenRegister('daily')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 text-xs font-semibold border border-orange-500/30 transition-all"
            >
              Latihan Harian
            </button>

            <button
              onClick={() => onOpenRegister('monthly')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all"
            >
              Daftar Member
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Login Admin (admin / gogym123)"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCheckMembership}
              className="relative p-2 rounded-lg bg-slate-800 text-orange-400"
              title="Cek Member"
            >
              <UserCheck className="w-5 h-5" />
              {expiringCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {expiringCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <button 
            onClick={() => { setActiveTab('home'); setIsOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-orange-400" /> Beranda
          </button>
          <button 
            onClick={() => scrollToSection('fasilitas')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4 text-orange-400" /> Fasilitas Gym
          </button>
          <button 
            onClick={() => scrollToSection('instruktur')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-orange-400" /> Daftar Instruktur
          </button>
          <button 
            onClick={() => scrollToSection('boxing')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-orange-400" /> Jadwal Kelas Boxing
          </button>
          <button 
            onClick={() => scrollToSection('harga')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <span>💰</span> Harga & Paket
          </button>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => { onOpenRegister('daily'); setIsOpen(false); }}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold border border-orange-500/30 text-center"
            >
              Latihan Harian
            </button>
            <button
              onClick={() => { onOpenRegister('monthly'); setIsOpen(false); }}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold text-center shadow-md"
            >
              Daftar Member
            </button>
          </div>

          <button
            onClick={() => { onOpenAdminLogin(); setIsOpen(false); }}
            className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Login Admin (Pengelola)
          </button>
        </div>
      )}
    </header>
  );
}
