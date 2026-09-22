import { Bell, Calendar, Tag } from 'lucide-react';
import { Announcement } from '../types';

interface InfoSectionProps {
  announcements: Announcement[];
}

export default function InfoSection({ announcements }: InfoSectionProps) {
  return (
    <section id="info" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Pengumuman & Berita
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            INFORMASI TERBARU GO GYM
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Dapatkan info promo, jadwal operasional khusus, dan update fasilitas terbaru langsung dari pengelola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {announcements.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl hover:border-orange-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {item.tag}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-orange-400 font-semibold flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Go Gym Rancaekek Official Info
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
