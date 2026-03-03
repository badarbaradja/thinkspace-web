import Link from "next/link";
import { cafes } from "@/data/cafes";
import { testimonials } from "@/data/testimonials";
import CafeCard from "@/components/CafeCard";

const steps = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Cari Lokasi",
    description: "Temukan cafe terdekat dengan fasilitas kerja terbaik di kotamu.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Pilih Cafe",
    description: "Lihat review, fasilitas, dan foto untuk pilih tempat terbaik.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: "Mulai Kerja",
    description: "Datang, pesan kopi, dan nikmati produktivitas di tempat ideal.",
  },
];

const whyFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    title: "WiFi Super Cepat",
    description: "Setiap cafe kami verifikasi kecepatan WiFi-nya agar kamu bisa kerja tanpa hambatan.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Stop Kontak Tersedia",
    description: "Info lengkap soal ketersediaan stop kontak, jadi laptop kamu aman seharian.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Komunitas Produktif",
    description: "Bergabung dengan komunitas pekerja remote yang produktif dan saling mendukung.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Info Jam Operasional",
    description: "Tahu pasti kapan cafe buka dan tutup, jadi kamu bisa plan hari kerja dengan optimal.",
  },
];

const popularCafes = cafes.slice(0, 6);

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-navy-950 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Platform workspace di coffee shop #1 Indonesia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight animate-fade-in-up">
              Temukan{" "}
              <span className="text-accent">Workspace Ideal</span>{" "}
              di Coffee Shop Terdekat
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Bosan kerja di rumah? ThinkSpace bantu kamu menemukan cafe dengan WiFi kencang, suasana nyaman, dan fasilitas lengkap untuk produktivitas maksimal.
            </p>

            {/* Visual Search Bar */}
            <div className="max-w-xl mx-auto animate-fade-in-up delay-300">
              <div className="flex items-center bg-white rounded-xl p-1.5 pl-5 shadow-2xl shadow-black/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari cafe di Jakarta, Bandung, Surabaya..."
                  className="flex-1 px-3 py-3 text-sm bg-transparent outline-none text-foreground placeholder:text-slate-400"
                  readOnly
                />
                <button className="bg-accent hover:bg-accent-light text-navy-950 font-bold text-sm px-6 py-3 rounded-lg transition-all">
                  Cari
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                ☕ 150+ cafe workspace tersedia di Jabodetabek
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3 LANGKAH MUDAH ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              3 Langkah <span className="text-accent">Mudah</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Dari bingung cari tempat kerja sampai duduk nyaman di cafe favorit, cuma butuh 3 langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900/5 text-navy-900 mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300">
                  {step.icon}
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-navy-950 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY THINKSPACE ===== */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Kenapa <span className="text-accent">ThinkSpace</span>?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Kami bantu kamu fokus pada kerja, bukan cari tempat kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyFeatures.map((feature) => (
              <div key={feature.title} className="card p-6 text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-900/5 text-navy-900 mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Apa Kata <span className="text-accent">Mereka</span>?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Ribuan pekerja remote sudah merasakan manfaat ThinkSpace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.id} className="card p-6">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR CAFES ===== */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
                Cafe <span className="text-accent">Populer</span>
              </h2>
              <p className="text-slate-500">
                Pilihan cafe terbaik yang paling sering dikunjungi.
              </p>
            </div>
            <Link href="/fitur" className="btn-secondary text-sm">
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"}} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />

        <div className="relative max-w-3xl mx-auto text-center section-padding">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
            Siap Temukan <span className="text-accent">Workspace Idealmu</span>?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Bergabung dengan ribuan pekerja remote yang sudah menemukan tempat kerja favorit mereka melalui ThinkSpace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/fitur" className="btn-primary text-sm !py-3.5 !px-8">
              Jelajahi Cafe
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/mitra" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/5 transition-all text-sm">
              Jadi Mitra
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
