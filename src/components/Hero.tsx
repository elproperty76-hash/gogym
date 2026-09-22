import { MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenRegister: (type: 'monthly' | 'daily') => void;
  onOpenCheckMembership: () => void;
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export default function Hero({ 
  onOpenRegister, 
  onOpenCheckMembership,
  heroImageUrl,
  heroTitle,
  heroSubtitle
}: HeroProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200';
  const displayImage = heroImageUrl || defaultImage;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-16 md:py-24 border-b border-slate-800">
      {/* Background Glow & Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold tracking-wide">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Bumi Pesona Asri Blok A3 No.9, Rancaekek, Bandung</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              {heroTitle ? heroTitle : (
                <>BANGUN TUBUH <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">IDEALMU</span> DI GO GYM</>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroSubtitle || 'Pusat kebugaran terlengkap di Rancaekek dengan alat fitness modern, instruktur profesional bersertifikat, dan kelas boxing berkelas. Siap menemani perjalanan sehatmu setiap hari!'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenRegister('monthly')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-xl shadow-orange-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <span>Daftar Member Bulanan</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenRegister('daily')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-400 hover:text-orange-300 font-bold text-base border-2 border-orange-500/40 hover:border-orange-500 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>Latihan Harian (Rp 20rb)</span>
              </button>
            </div>

            {/* Quick check membership prompt */}
            <div className="pt-2 text-xs sm:text-sm text-slate-400">
              Sudah terdaftar sebagai member?{' '}
              <button 
                onClick={onOpenCheckMembership}
                className="text-orange-400 font-semibold underline hover:text-orange-300 transition-colors"
              >
                Cek masa aktif & status member di sini
              </button>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">100%</div>
                <div className="text-xs text-slate-400 mt-1">Alat Berstandar Gym</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">Rp 20rb</div>
                <div className="text-xs text-slate-400 mt-1">Gym Harian Terjangkau</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">VIP</div>
                <div className="text-xs text-slate-400 mt-1">Kelas Boxing Rutin</div>
              </div>
            </div>

          </div>

          {/* Right Image / Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img 
                  src={displayImage} 
                  alt="Go Gym Rancaekek" 
                  className="w-full h-[380px] sm:h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-flex items-center gap-2 bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Buka Setiap Hari 07:00 - 22:00
                  </div>
                  <h3 className="text-xl font-bold text-white">Go Gym Rancaekek Bandung</h3>
                  <p className="text-xs text-slate-300 mt-1">Tempat latihan nyaman, bersih, luas, dan lengkap di Bumi Pesona Asri.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
