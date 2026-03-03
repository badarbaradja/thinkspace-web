import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mitra — ThinkSpace",
  description:
    "Bergabung jadi mitra ThinkSpace. Tingkatkan visibilitas cafe kamu dan jangkau lebih banyak pekerja remote.",
};

const packages = [
  {
    name: "Starter",
    tagline: "Untuk cafe yang baru mulai",
    price: "Gratis",
    highlighted: false,
    features: [
      "Listing di platform ThinkSpace",
      "Profil cafe dasar",
      "Foto & info fasilitas",
      "Muncul di hasil pencarian",
      "Badge 'Verified Workspace'",
    ],
  },
  {
    name: "Growth",
    tagline: "Paling populer",
    price: "Hubungi Kami",
    highlighted: true,
    features: [
      "Semua fitur Starter",
      "Prioritas di hasil pencarian",
      "Analytics dashboard",
      "Promo & featured placement",
      "Dukungan marketing dedicated",
      "Badge 'Recommended' eksklusif",
    ],
  },
  {
    name: "Premium",
    tagline: "Untuk brand besar",
    price: "Custom",
    highlighted: false,
    features: [
      "Semua fitur Growth",
      "Co-branding dengan ThinkSpace",
      "Event hosting partnership",
      "Dedicated account manager",
      "Custom analytics & reporting",
      "Multi-outlet support",
      "Early access fitur baru",
    ],
  },
];

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Tingkatkan Visibilitas",
    description: "Cafe kamu ditemukan oleh ribuan pekerja remote yang mencari workspace.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Revenue Tambahan",
    description: "Tambah pemasukan dari pelanggan pekerja remote yang belanja lebih banyak.",
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
    title: "Komunitas Loyal",
    description: "Bangun komunitas pelanggan setia yang kembali terus ke cafe kamu.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Data & Insight",
    description: "Dapatkan data pengunjung dan insight untuk mengoptimalkan bisnis cafe.",
  },
];

export default function MitraPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Partnership Program
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Bergabung Jadi <span className="text-accent">Mitra ThinkSpace</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Tingkatkan visibilitas cafe kamu dan jangkau ribuan pekerja remote yang mencari workspace ideal. Gratis untuk mulai.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Kenapa Jadi <span className="text-accent">Mitra</span>?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Keuntungan yang kamu dapatkan saat bergabung dengan jaringan ThinkSpace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card p-6 text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-900/5 text-navy-900 mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Pilih <span className="text-accent">Paket Kemitraan</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Mulai dari gratis, tingkatkan sesuai kebutuhan bisnis kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  pkg.highlighted
                    ? "bg-navy-950 text-white shadow-2xl shadow-navy-950/30 scale-[1.03] border border-accent/20"
                    : "card"
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-navy-950 text-xs font-bold px-4 py-1 rounded-full">
                    Paling Populer
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${pkg.highlighted ? "text-white" : "text-foreground"}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm ${pkg.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                    {pkg.tagline}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-3xl font-extrabold ${pkg.highlighted ? "text-accent" : "text-foreground"}`}>
                    {pkg.price}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 mt-0.5 ${pkg.highlighted ? "text-accent" : "text-accent"}`}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={pkg.highlighted ? "text-slate-300" : "text-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/kontak"
                  className={`w-full justify-center text-center block py-3 rounded-lg font-bold text-sm transition-all ${
                    pkg.highlighted
                      ? "bg-accent text-navy-950 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20"
                      : "bg-navy-900 text-white hover:bg-navy-800"
                  }`}
                >
                  {pkg.price === "Gratis" ? "Daftar Sekarang" : "Hubungi Kami"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"}} />
        <div className="relative max-w-3xl mx-auto text-center section-padding">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Siap <span className="text-accent">Bergabung</span>?
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Hubungi tim kami untuk konsultasi gratis tentang paket kemitraan yang tepat untuk cafe kamu.
          </p>
          <Link href="/kontak" className="btn-primary !py-3.5 !px-10">
            Hubungi Tim ThinkSpace
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
