import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section id="fasilitas" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-sm font-bold uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Fasilitas Unggulan
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            GALERI GO GYM RANCAEKEK
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Nikmati fasilitas olahraga berkualitas tinggi dengan kenyamanan maksimal untuk mendukung target fitness harianmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden relative">
                  <span className="absolute top-3 right-3 z-10 bg-slate-950/80 backdrop-blur-md text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-orange-500/20">
                    {item.category}
                  </span>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
