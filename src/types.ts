export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  packageType: 'monthly' | '3_months' | 'yearly';
  registrationDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: 'active' | 'expired' | 'pending';
  amountPaid: number;
  paymentMethod: string;
}

export interface NonMemberPass {
  id: string;
  name: string;
  phone: string;
  visitDate: string; // YYYY-MM-DD
  amountPaid: number;
  paymentMethod: string;
  status: 'completed' | 'checked_in';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: string;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  photoUrl: string;
  bio: string;
}

export interface BoxingSchedule {
  id: string;
  day: string;
  time: string;
  coach: string;
  level: string;
  quota: number;
}

export interface Transaction {
  id: string;
  type: 'member_registration' | 'member_renewal' | 'daily_pass';
  customerName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'success' | 'pending';
}

export interface GymPricing {
  id: string;
  title: string;
  category: 'daily' | 'monthly' | 'package';
  price: number;
  period: string; // e.g. "/ kunjungan", "/ bulan", "/ 3 bulan"
  description: string;
  features: string[];
  isPopular: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface AppSettings {
  id: string;
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}

