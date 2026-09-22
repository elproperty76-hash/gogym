import { Dumbbell, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                GO GYM
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pusat kebugaran terlengkap & terpercaya di Rancaekek dengan fasilitas modern, alat fitness berkualitas, dan kelas boxing profesional.
            </p>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>Bumi Pesona Asri Blok A3 No.9, Rancaekek, Bandung, Jawa Barat</span>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Jam Operasional</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Senin - Sabtu: 07:00 - 22:00 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Minggu / Hari Libur: 08:00 - 21:00 WIB</span>
              </li>
              <li className="text-xs text-orange-400 pt-1">
                *Buka setiap hari, termasuk hari libur nasional.
              </li>
            </ul>
          </div>

          {/* Contact & Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Layanan & Kontak</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+62 812-3456-7890 (WhatsApp Booking)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>support@gogym-rancaekek.id</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                Member & Non-Member Welcome!
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Go Gym Rancaekek. Seluruh hak cipta dilindungi. Lokasi: Bumi Pesona Asri Blok A3 No.9 Rancaekek Bandung.
        </div>
      </div>
    </footer>
  );
}
