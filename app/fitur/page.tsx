import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitur — ThinkSpace",
  description:
    "Jelajahi fitur ThinkSpace: peta cafe interaktif, filter fasilitas, dan rekomendasi workspace terbaik.",
};

const filterAreas = [
  "Semua Area",
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Tangerang Selatan",
  "Depok",
];

const filterFacilities = [
  "WiFi",
  "Stop Kontak",
  "Meeting Room",
  "Parkir",
  "AC",
  "Mushola",
  "Outdoor",
  "Pet Friendly",
];

const priceOptions = ["Semua", "$", "$$", "$$$"];

export default function FiturPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Preview Fitur
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Jelajahi <span className="text-accent">Fitur ThinkSpace</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Lihat bagaimana ThinkSpace akan membantu kamu menemukan cafe workspace ideal dengan fitur pencarian dan filter canggih.
          </p>
        </div>
      </section>

      {/* Map + Filters */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-bold text-base text-foreground mb-6 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filter Pencarian
                </h3>

                {/* Area */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Area</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-900/10 transition-all" defaultValue="Semua Area">
                    {filterAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Harga</label>
                  <div className="flex gap-2">
                    {priceOptions.map((price) => (
                      <button key={price} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:bg-navy-900/5 hover:text-navy-900 hover:border-navy-900/20 transition-all">
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-foreground block mb-2">Fasilitas</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filterFacilities.map((facility) => (
                      <label key={facility} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 hover:border-navy-900/10 hover:bg-navy-900/5 transition-all cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5 accent-amber-500 rounded" readOnly />
                        <span className="text-sm text-foreground">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Rating Minimum</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="1" max="5" step="0.5" defaultValue="4" className="flex-1 accent-amber-500" readOnly />
                    <span className="text-sm font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">4.0+</span>
                  </div>
                </div>

                <button className="btn-primary w-full justify-center">Terapkan Filter</button>
              </div>
            </div>

            {/* Map + Results */}
            <div className="lg:col-span-2">
              {/* Map */}
              <div className="rounded-xl overflow-hidden mb-8 border border-slate-200 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.290530977!2d106.7271562871674!3d-6.229386797490834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta cafe workspace Jakarta"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Rekomendasi Cafe</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Menampilkan {cafes.length} cafe workspace terbaik</p>
                </div>
                <select className="px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600">
                  <option>Rating Tertinggi</option>
                  <option>Review Terbanyak</option>
                  <option>Harga Terendah</option>
                </select>
              </div>

              {/* Cafe grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cafes.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
