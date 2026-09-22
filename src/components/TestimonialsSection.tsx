import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rian Hidayat',
      role: 'Member Bulanan (Warga Rancaekek)',
      comment: 'Go Gym sangat dekat dari rumah di Bumi Pesona Asri. Alatnya lengkap, bersih, dan AC-nya dingin. Sangat nyaman buat latihan sepulang kerja!',
      rating: 5
    },
    {
      name: 'Dina Marlina',
      role: 'Member VIP & Boxing Class',
      comment: 'Coach-nya ramah dan telaten banget ngajarin gerakan yang benar. Kelas boxingnya juga seru dan bikin badan bugar.',
      rating: 5
    },
    {
      name: 'Fajar Nugraha',
      role: 'Pengunjung Harian',
      comment: 'Pass harian cuma 20 ribu tapi fasilitasnya setara gym komersial kota besar. Recommended banget buat warga Rancaekek dan sekitarnya.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Testimoni Member
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            APA KATA MEREKA TENTANG GO GYM?
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Kepuasan member adalah prioritas utama kami dalam memberikan pelayanan kebugaran terbaik di Rancaekek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-slate-950 rounded-2xl border border-slate-800 p-8 relative flex flex-col justify-between shadow-xl"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-orange-500/10" />

              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm sm:text-base italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="font-bold text-white text-base">{t.name}</div>
                <div className="text-xs text-orange-400 mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
