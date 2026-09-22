import { Member, NonMemberPass, Announcement, Instructor, BoxingSchedule, Transaction, GymPricing, GalleryItem, AppSettings } from '../types';

export const initialGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Area Beban & Barbell Lengkap',
    category: 'Fasilitas Utama',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    description: 'Peralatan beban lengkap dan terawat dengan standar kualitas tinggi untuk latihan otot maksimal.'
  },
  {
    id: 'g2',
    title: 'Ring Tinju & Sasis Latihan Boxing',
    category: 'Kelas Boxing',
    imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&q=80&w=800',
    description: 'Ring tinju standar dengan samsak profesional untuk kelas boxing rutin bersama pelatih berpengalaman.'
  },
  {
    id: 'g3',
    title: 'Ruang Kardio & Treadmill',
    category: 'Cardio',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    description: 'Treadmill, sepeda statis, dan alat kardio modern menghadap pemandangan segar Bumi Pesona Asri Rancaekek.'
  },
  {
    id: 'g4',
    title: 'Suasana Gym Luas & Nyaman Ber-AC',
    category: 'Interior',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    description: 'Ruangan ber-AC penuh, bersih, higienis, dan sirkulasi udara optimal untuk kenyamanan member.'
  },
  {
    id: 'g5',
    title: 'Peralatan Dumbbell & Kettlebell',
    category: 'Fasilitas Utama',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800',
    description: 'Rak dumbbell lengkap dari ukuran ringan hingga berat untuk berbagai variasi latihan.'
  },
  {
    id: 'g6',
    title: 'Area Istirahat & Locker Room',
    category: 'Fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    description: 'Fasilitas loker aman, toilet bersih, dan area santai untuk bersiap sebelum atau sesudah latihan.'
  }
];

export const initialAppSettings: AppSettings = {
  id: 'main_settings',
  heroImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
  heroTitle: 'PUSAT FITNESS & BOXING TERBAIK DI RANCAEKEK BANDUNG',
  heroSubtitle: 'Bergabunglah bersama Go Gym di Bumi Pesona Asri Blok A3 No.9 Rancaekek Bandung. Fasilitas lengkap, instruktur profesional, dan suasana latihan yang ramah untuk semua.'
};

export const initialPricing: GymPricing[] = [
  {
    id: 'pr1',
    title: 'Latihan Harian',
    category: 'daily',
    price: 20000,
    period: '/ kunjungan',
    description: 'Cocok untuk kamu yang ingin latihan sesekali atau mencoba fasilitas Go Gym.',
    features: [
      'Full Access Alat Fitness & Cardio',
      'Ruang Gym Ber-AC & Nyaman',
      'Free Air Mineral Refill',
      'Berlaku 1 Hari Penuh'
    ],
    isPopular: false
  },
  {
    id: 'pr2',
    title: 'Member Bulanan',
    category: 'monthly',
    price: 150000,
    period: '/ bulan',
    description: 'Akses sepuasnya setiap hari selama 1 bulan penuh tanpa batas!',
    features: [
      'Akses Gym Sepuasnya Setiap Hari',
      'Free Akses Semua Alat & Mesin',
      'Diskon Khusus Kelas Boxing',
      'Free Locker & Wi-Fi Berkecepatan Tinggi',
      'Notifikasi Otomatis Masa Aktif'
    ],
    isPopular: true
  },
  {
    id: 'pr3',
    title: 'Paket 3 Bulan',
    category: 'package',
    price: 400000,
    period: '/ 3 bulan',
    description: 'Pilihan terbaik untuk hasil maksimal dengan harga lebih hemat.',
    features: [
      'Semua Fasilitas Member Bulanan',
      'Gratis 1x Sesi Personal Trainer',
      'Free Merchandise Eksklusif Go Gym',
      'Prioritas Booking Jadwal Boxing'
    ],
    isPopular: false
  }
];

export const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Budi Santoso',
    phone: '081234567890',
    email: 'budi@example.com',
    packageType: 'monthly',
    registrationDate: '2026-09-01',
    expiryDate: '2026-10-01',
    status: 'active',
    amountPaid: 150000,
    paymentMethod: 'QRIS / Midtrans'
  },
  {
    id: 'm2',
    name: 'Siti Rahmawati',
    phone: '081987654321',
    email: 'siti@example.com',
    packageType: '3_months',
    registrationDate: '2026-06-15',
    expiryDate: '2026-09-15',
    status: 'expired',
    amountPaid: 400000,
    paymentMethod: 'Transfer BCA'
  },
  {
    id: 'm3',
    name: 'Asep Saepudin',
    phone: '085678901234',
    email: 'asep@example.com',
    packageType: 'monthly',
    registrationDate: '2026-09-20',
    expiryDate: '2026-10-20',
    status: 'active',
    amountPaid: 150000,
    paymentMethod: 'GoPay'
  }
];

export const initialNonMembers: NonMemberPass[] = [
  {
    id: 'nm1',
    name: 'Jajang Nurjaman',
    phone: '081122334455',
    visitDate: '2026-09-21',
    amountPaid: 20000,
    paymentMethod: 'QRIS',
    status: 'completed'
  },
  {
    id: 'nm2',
    name: 'Dewi Lestari',
    phone: '081299887766',
    visitDate: '2026-09-21',
    amountPaid: 20000,
    paymentMethod: 'Cash',
    status: 'completed'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Promo Spesial September Ceria!',
    content: 'Dapatkan diskon khusus pendaftaran member 3 bulan gratis merchandise eksklusif Go Gym Rancaekek.',
    date: '2026-09-01',
    tag: 'Promo'
  },
  {
    id: 'a2',
    title: 'Penambahan Alat Fitness Baru',
    content: 'Kini Go Gym telah menghadirkan 2 unit Treadmill Elektrik terbaru dan Dumbbell set lengkap hingga 50kg.',
    date: '2026-09-10',
    tag: 'Fasilitas'
  }
];

export const initialInstructors: Instructor[] = [
  {
    id: 'ins1',
    name: 'Coach Rian Kusuma',
    specialty: 'Bodybuilding & Hypertrophy',
    experience: '7 Tahun Pengalaman',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    bio: 'Sertifikasi Nasional Fitness Trainer, spesialis pembentukan otot dan fat loss.'
  },
  {
    id: 'ins2',
    name: 'Coach Siti Aminah',
    specialty: 'Boxing & Cardio HIIT',
    experience: '5 Tahun Pengalaman',
    photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    bio: 'Mantan atlet tinju daerah Jawa Barat, melatih kelas boxing untuk pemula hingga mahir.'
  },
  {
    id: 'ins3',
    name: 'Coach Dedi Setiawan',
    specialty: 'Functional Training & Strength',
    experience: '6 Tahun Pengalaman',
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    bio: 'Ahli dalam peningkatan daya tahan fisik, kettlebell, dan pencegahan cedera.'
  }
];

export const initialBoxingSchedules: BoxingSchedule[] = [
  {
    id: 'bs1',
    day: 'Senin',
    time: '16:00 - 17:30 WIB',
    coach: 'Coach Siti Aminah',
    level: 'Semua Level (Pemula - Mahir)',
    quota: 15
  },
  {
    id: 'bs2',
    day: 'Rabu',
    time: '16:00 - 17:30 WIB',
    coach: 'Coach Siti Aminah',
    level: 'Advanced Sparring & Technique',
    quota: 12
  },
  {
    id: 'bs3',
    day: 'Jumat',
    time: '19:00 - 20:30 WIB',
    coach: 'Coach Siti Aminah',
    level: 'Cardio Boxing & Fat Burn',
    quota: 20
  },
  {
    id: 'bs4',
    day: 'Minggu',
    time: '08:00 - 09:30 WIB',
    coach: 'Coach Siti Aminah',
    level: 'Weekend Warriors Boxing',
    quota: 20
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'member_registration',
    customerName: 'Budi Santoso',
    amount: 150000,
    date: '2026-09-01',
    paymentMethod: 'QRIS / Midtrans',
    status: 'success'
  },
  {
    id: 'tx2',
    type: 'member_registration',
    customerName: 'Siti Rahmawati',
    amount: 400000,
    date: '2026-06-15',
    paymentMethod: 'Transfer BCA',
    status: 'success'
  },
  {
    id: 'tx3',
    type: 'member_registration',
    customerName: 'Asep Saepudin',
    amount: 150000,
    date: '2026-09-20',
    paymentMethod: 'GoPay',
    status: 'success'
  },
  {
    id: 'tx4',
    type: 'daily_pass',
    customerName: 'Jajang Nurjaman',
    amount: 20000,
    date: '2026-09-21',
    paymentMethod: 'QRIS',
    status: 'success'
  },
  {
    id: 'tx5',
    type: 'daily_pass',
    customerName: 'Dewi Lestari',
    amount: 20000,
    date: '2026-09-21',
    paymentMethod: 'Cash',
    status: 'success'
  }
];
