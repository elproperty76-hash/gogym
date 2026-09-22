import { Check } from 'lucide-react';
import { GymPricing } from '../types';

interface PricingSectionProps {
  pricings: GymPricing[];
  onOpenRegister: (type: 'monthly' | 'daily') => void;
}

export default function PricingSection({ pricings, onOpenRegister }: PricingSectionProps) {
  return (
    <section id="harga" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Pilihan Paket Fleksibel
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            HARGA MEMBER & HARIAN GO GYM
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Investasikan kesehatan tubuhmu dengan harga terjangkau di Bumi Pesona Asri Rancaekek Bandung. Tanpa biaya tersembunyi!
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricings.map((p) => {
            const isPopular = p.isPopular;
            return (
              <div 
                key={p.id}
                className={`rounded-2xl p-8 flex flex-col justify-between relative transition-all group ${isPopular ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500 shadow-2xl shadow-orange-600/25 scale-105 z-10' : 'bg-slate-950/80 border border-slate-800 hover:border-orange-500/50'}`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                    🔥 Paling Populer
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4 mt-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${isPopular ? 'text-orange-300 bg-orange-500/20' : 'text-slate-400 bg-slate-800'}`}>
                      {p.category === 'daily' ? 'Non-Member' : p.category === 'monthly' ? 'Member VIP' : 'Paket Paket'}
                    </span>
                    <span className="text-xs text-orange-400 font-medium capitalize">{p.category}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-slate-300 text-sm mb-6">{p.description}</p>
                  
                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <span className={`text-4xl font-black ${isPopular ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300' : 'text-white'}`}>
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-slate-400 text-sm"> {p.period}</span>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-300 mb-8">
                    {p.features && p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className={`w-4 h-4 shrink-0 ${isPopular ? 'text-orange-400' : 'text-orange-500'}`} /> 
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenRegister(p.category === 'daily' ? 'daily' : 'monthly')}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all text-center shadow-lg ${isPopular ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30' : 'bg-slate-800 hover:bg-orange-600 hover:text-white text-orange-400 border border-orange-500/30'}`}
                >
                  {p.category === 'daily' ? 'Beli Pass Harian Sekarang' : 'Daftar Paket Ini'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
