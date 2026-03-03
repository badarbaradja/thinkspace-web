"use client";

import { useState } from "react";

const contactInfo = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "hello@thinkspace.id",
    href: "mailto:hello@thinkspace.id",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Telepon",
    value: "+62 812 3456 7890",
    href: "tel:+6281234567890",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Alamat",
    value: "Jl. Sudirman No.1, Jakarta Pusat, Indonesia",
    href: "#",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Jam Operasional",
    value: "Senin - Jumat, 09:00 - 18:00 WIB",
    href: "#",
  },
];

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Hubungi Kami
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Ada <span className="text-accent">Pertanyaan</span>?
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Kami siap membantu. Kirim pesan dan tim kami akan merespons dalam waktu 24 jam.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                Informasi Kontak
              </h2>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Punya pertanyaan tentang ThinkSpace atau ingin menjadi mitra? Jangan ragu untuk menghubungi kami melalui salah satu cara di bawah.
              </p>

              <div className="space-y-3">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-navy-900/20 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-navy-900/5 text-navy-900 flex items-center justify-center shrink-0 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{info.label}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm font-semibold text-foreground mb-3">Ikuti Kami</p>
                <div className="flex gap-2">
                  {["Instagram", "Twitter", "LinkedIn"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-navy-900/5 hover:text-navy-900 flex items-center justify-center transition-all text-xs font-bold text-slate-400"
                    >
                      {social.charAt(0)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                  Kirim Pesan
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Isi form di bawah dan tim kami akan segera menghubungi kamu.
                </p>

                {submitted && (
                  <div className="mb-6 p-4 rounded-lg bg-accent/10 text-accent text-sm font-medium flex items-center gap-2 animate-fade-in border border-accent/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Pesan terkirim! Kami akan segera menghubungi kamu.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-900/10 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-900/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">Subjek</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-900/10 transition-all">
                      <option>Pertanyaan Umum</option>
                      <option>Kemitraan / Mitra</option>
                      <option>Feedback & Saran</option>
                      <option>Kerja Sama Bisnis</option>
                      <option>Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">Pesan</label>
                    <textarea
                      rows={5}
                      placeholder="Tulis pesan kamu di sini..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white text-foreground outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-900/10 transition-all resize-none"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center !py-3">
                    Kirim Pesan
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
