import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PricingSection from './components/PricingSection';
import GallerySection from './components/GallerySection';
import InstructorsSection from './components/InstructorsSection';
import BoxingScheduleSection from './components/BoxingScheduleSection';
import TestimonialsSection from './components/TestimonialsSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import CheckMembershipModal from './components/CheckMembershipModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import { 
  getMembers, 
  getNonMembers, 
  getAnnouncements, 
  getInstructors, 
  getBoxingSchedules, 
  getTransactions,
  getPricings,
  getGallery,
  getAppSettings
} from './services/firebaseService';
import { Member, NonMemberPass, Announcement, Instructor, BoxingSchedule, Transaction, GymPricing, GalleryItem, AppSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [nonMembers, setNonMembers] = useState<NonMemberPass[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [schedules, setSchedules] = useState<BoxingSchedule[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pricings, setPricings] = useState<GymPricing[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Modals
  const [registerModalType, setRegisterModalType] = useState<'monthly' | 'daily' | null>(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  const loadAllData = async () => {
    try {
      const [m, nm, a, ins, sch, tx, pr, gal, sets] = await Promise.all([
        getMembers(),
        getNonMembers(),
        getAnnouncements(),
        getInstructors(),
        getBoxingSchedules(),
        getTransactions(),
        getPricings(),
        getGallery(),
        getAppSettings()
      ]);
      setMembers(m);
      setNonMembers(nm);
      setAnnouncements(a);
      setInstructors(ins);
      setSchedules(sch);
      setTransactions(tx);
      setPricings(pr);
      setGallery(gal);
      setAppSettings(sets);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (activeTab === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        members={members}
        nonMembers={nonMembers}
        announcements={announcements}
        instructors={instructors}
        schedules={schedules}
        transactions={transactions}
        pricings={pricings}
        gallery={gallery}
        appSettings={appSettings}
        onRefresh={loadAllData}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setActiveTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        members={members}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={(type) => setRegisterModalType(type)}
        onOpenCheckMembership={() => setShowCheckModal(true)}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          onOpenRegister={(type) => setRegisterModalType(type)}
          onOpenCheckMembership={() => setShowCheckModal(true)}
          heroImageUrl={appSettings?.heroImageUrl}
          heroTitle={appSettings?.heroTitle}
          heroSubtitle={appSettings?.heroSubtitle}
        />
        
        <GallerySection gallery={gallery} />
        
        <InstructorsSection instructors={instructors} />
        
        <BoxingScheduleSection 
          schedules={schedules} 
          onOpenRegister={(type) => setRegisterModalType(type)} 
        />
        
        <PricingSection 
          pricings={pricings}
          onOpenRegister={(type) => setRegisterModalType(type)} 
        />
        
        <TestimonialsSection />
        
        <InfoSection announcements={announcements} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {registerModalType && (
        <RegisterModal
          initialType={registerModalType}
          onClose={() => setRegisterModalType(null)}
          onSuccess={loadAllData}
        />
      )}

      {showCheckModal && (
        <CheckMembershipModal
          members={members}
          onClose={() => setShowCheckModal(false)}
          onOpenRegister={(type) => setRegisterModalType(type)}
        />
      )}

      {showAdminLoginModal && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setActiveTab('admin');
            setShowAdminLoginModal(false);
          }}
        />
      )}

    </div>
  );
}
