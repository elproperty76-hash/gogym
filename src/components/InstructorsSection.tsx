import { Award, UserCheck } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorsSectionProps {
  instructors: Instructor[];
}

export default function InstructorsSection({ instructors }: InstructorsSectionProps) {
  return (
    <section id="instruktur" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Professional Trainer
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            INSTRUKTUR & COACH GO GYM
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Dilatih langsung oleh para ahli bersertifikat yang siap membimbingmu mencapai bentuk tubuh impian secara aman dan efektif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instructors.map((ins) => (
            <div 
              key={ins.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={ins.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600'} 
                    alt={ins.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    {ins.experience}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                    {ins.name}
                  </h3>
                  <div className="text-orange-400 text-sm font-semibold mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> {ins.specialty}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {ins.bio}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-semibold text-slate-300">
                  Go Gym Rancaekek Coach
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
