import { Calendar, Clock, User, Users, ShieldAlert } from 'lucide-react';
import { BoxingSchedule } from '../types';

interface BoxingScheduleProps {
  schedules: BoxingSchedule[];
  onOpenRegister: (type: 'monthly' | 'daily') => void;
}

export default function BoxingScheduleSection({ schedules, onOpenRegister }: BoxingScheduleProps) {
  return (
    <section id="boxing" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            VIP Class
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            JADWAL KELAS BOXING GO GYM
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Tingkatkan stamina, kelincahan, dan kemampuan bela diri melalui kelas boxing eksklusif bersama pelatih berpengalaman di Rancaekek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schedules.map((sch) => (
            <div 
              key={sch.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-orange-500/50 shadow-xl group transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {sch.day}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Max {sch.quota} org
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{sch.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <User className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pelatih: <strong className="text-white">{sch.coach}</strong></span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-orange-300 font-medium mb-6">
                  {sch.level}
                </div>
              </div>

              <button
                onClick={() => onOpenRegister('monthly')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 hover:border-orange-500"
              >
                Booking / Join Kelas
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-orange-600/20 via-amber-500/10 to-transparent border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ingin Ikut Sesi Boxing Perdana?</h3>
            <p className="text-slate-300 text-sm">Member bulanan Go Gym mendapatkan akses khusus dan prioritas kuota kelas boxing!</p>
          </div>
          <button
            onClick={() => onOpenRegister('monthly')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg whitespace-nowrap"
          >
            Daftar Member Sekarang
          </button>
        </div>

      </div>
    </section>
  );
}
