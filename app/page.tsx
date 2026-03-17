import Link from "next/link";
import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";

const popularCafes = cafes.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION DENGAN REALISTIC PHONE MOCKUP ===== */}
      <section className="relative bg-navy-950 overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-125 h-125 bg-accent/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Kiri: Copywriting Utama */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Live: Bandung
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
                Cari Tempat Nugas <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-yellow-200">Tanpa Drama.</span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Cek ketersediaan kursi secara real-time dan booking instan sebelum berangkat. Cepat, transparan, dan pastinya dapet tempat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* ADJUSTMENT: Diarahkan ke halaman /fitur (Peta) */}
                <Link href="/fitur" className="bg-accent hover:bg-yellow-400 text-navy-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>                  Eksplor Peta Sekarang
                </Link>
                <Link href="/mitra" className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all flex items-center justify-center">
                  Daftar Jadi Mitra
                </Link>
              </div>
            </div>

            {/* Kanan: REALISTIC IPHONE MOCKUP CSS */}
            <div className="relative mx-auto w-[320px] h-160 z-10 animate-fade-in-up">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/30 blur-[80px] rounded-full z-0" />
              
              <div className="absolute inset-0 bg-black rounded-[3.5rem] p-2 shadow-2xl border border-slate-800 z-10">
                <div className="absolute top-32 -left-1 w-1 h-12 bg-slate-700 rounded-l-md" /> 
                <div className="absolute top-48 -left-1 w-1 h-12 bg-slate-700 rounded-l-md" /> 
                <div className="absolute top-40 -right-1 w-1 h-16 bg-slate-700 rounded-r-md" /> 

                <div className="relative w-full h-full bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800/50 flex flex-col">
                  
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-2.5 h-2.5 bg-slate-800/80 rounded-full" /> 
                  </div>

                  <div className="flex-1 p-5 pt-12 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-xs text-slate-400">Lokasi kamu</p>
                        <p className="font-semibold text-sm">📍 Bojongsoang, Bandung</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                        <span className="text-lg">👤</span>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl mt-4 shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-bold text-lg">Kopi Kisah Kita</h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md font-medium border border-green-500/20">Buka</span>
                      </div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-accent/20 text-accent font-bold text-2xl px-4 py-2 rounded-xl border border-accent/30 shadow-inner">
                          12
                        </div>
                        <p className="text-sm text-slate-300">Kursi Kosong<br/><span className="text-xs text-slate-400">Update detik ini</span></p>
                      </div>
                      {/* ADJUSTMENT: Diarahkan ke halaman /fitur */}
                      <Link href="/fitur" className="block text-center w-full bg-accent text-navy-950 font-bold py-3 rounded-xl text-sm shadow-md hover:bg-yellow-400 transition-colors">
                        Cari Tempat Nugas
                      </Link>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl opacity-70 mt-2">
                      <h3 className="text-white font-bold mb-1">Ruang Teduh Coworking</h3>
                      <p className="text-sm text-red-400 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Sisa 2 kursi!
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / VALIDASI (Tetap Putih agar Logo Jelas) ===== */}
      <section className="bg-white py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-slate-500 text-sm font-semibold">
          <p className="text-center sm:text-left tracking-wide">Didukung & Dipercaya Oleh:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <img src="/ditmawa.webp" alt="Ditmawa" className="h-10 sm:h-14 object-contain hover:scale-105 transition-transform duration-300" />
            <img src="/kemendikbud.webp" alt="Kemendikbud" className="h-10 sm:h-14 object-contain hover:scale-105 transition-transform duration-300" />
            <img src="/btp.webp" alt="Bandung Techno Park" className="h-10 sm:h-14 object-contain hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </section>

      {/* ===== THE PROBLEM (AGITASI) ===== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mb-4 tracking-tight">
              Sering Ngalamin <span className="text-red-500">"Drama"</span> Ini?
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Mahasiswa dan freelancer sudah cukup pusing dengan deadline. Jangan tambah pusing cari tempat nugas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Zonk Pas Nyampai", desc: "Udah jalan jauh menembus macet, eh sampai kafe semua kursi penuh. Balik kanan deh.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>), colorClass: "bg-red-50 text-red-500" },
              { title: "Waktu Terbuang", desc: "Keliling dari satu coworking ke kafe lain cuma buat cari spot yang kondusif.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>), colorClass: "bg-orange-50 text-orange-500" },
              { title: "Booking Manual Ribet", desc: "Chat admin kafe slow respon. Datanya nggak sinkron sama pengunjung walk-in.", icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /><path d="m15 8-6 6" /><path d="m9 8 6 6" /></svg>), colorClass: "bg-blue-50 text-blue-500" }
            ].map((prob, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${prob.colorClass}`}>
                  {prob.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">{prob.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ECOSYSTEM BANNER (GAYA KOSPACE, WARNA THINKSPACE) ===== */}
      <section className="bg-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 mb-6 tracking-tight">
            Lebih dari Sekadar Aplikasi.
            <br />ThinkSpace adalah Ekosistem.
          </h2>
          <p className="text-lg text-yellow-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Kami menciptakan jembatan digital antara mahasiswa yang membutuhkan ruang kerja produktif, dan pemilik bisnis yang ingin mengoptimalkan kapasitas kafenya secara efisien.
          </p>
        </div>
      </section>

      {/* ===== MEET OUR SPACE / PILIH PLATFORM (GAYA KOSPACE, WARNA NAVY) ===== */}
      <section className="py-24 bg-navy-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Pilih Platform Sesuai <span className="text-accent">Kebutuhanmu</span>
            </h2>
            <p className="text-slate-400">Satu ekosistem cerdas, dirancang khusus untuk dua sisi yang berbeda.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: User App */}
            <div className="bg-navy-950 rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col items-center text-center group hover:border-accent/50 transition-colors shadow-2xl">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-accent group-hover:bg-accent/10 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ThinkSpace App</h3>
              <p className="text-slate-400 mb-8 max-w-sm">Aplikasi super cepat untuk mahasiswa & freelancer mencari dan memesan kursi di kafe favorit secara instan.</p>
              <ul className="text-left text-sm text-slate-300 space-y-3 mb-10 w-full max-w-xs mx-auto">
                <li className="flex items-center gap-3"><span className="text-accent text-lg">✔</span> Real-Time Seat Availability</li>
                <li className="flex items-center gap-3"><span className="text-accent text-lg">✔</span> Seamless 1-Click Login</li>
                <li className="flex items-center gap-3"><span className="text-accent text-lg">✔</span> Smart Maps Discovery</li>
              </ul>
              {/* ADJUSTMENT: Diarahkan ke halaman /fitur */}
              <Link href="/fitur" className="bg-accent text-navy-950 font-bold py-3.5 px-8 rounded-xl w-full max-w-xs hover:bg-yellow-400 transition-colors">
                Mulai Pencarian
              </Link>
            </div>

            {/* Card 2: B2B Mitra */}
            <div className="bg-navy-950 rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/50 transition-colors shadow-2xl">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ThinkSpace for Business</h3>
              <p className="text-slate-400 mb-8 max-w-sm">Dashboard web pintar bagi kasir dan pemilik kafe untuk memanajemen pengunjung walk-in tanpa double-booking.</p>
              <ul className="text-left text-sm text-slate-300 space-y-3 mb-10 w-full max-w-xs mx-auto">
                <li className="flex items-center gap-3"><span className="text-blue-400 text-lg">✔</span> Live Synchronization</li>
                <li className="flex items-center gap-3"><span className="text-blue-400 text-lg">✔</span> Sistem Auto-Release</li>
                <li className="flex items-center gap-3"><span className="text-blue-400 text-lg">✔</span> Laporan Okupansi & Statistik</li>
              </ul>
              <Link href="/mitra" className="bg-transparent border-2 border-slate-700 text-white font-bold py-3 px-8 rounded-xl w-full max-w-xs hover:border-blue-500 hover:text-blue-400 transition-colors">
                Pelajari Solusi Mitra
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ===== B2B / MITRA DEEP DIVE DENGAN REALISTIC LAPTOP ===== */}
      <section className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
           <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#FACC15" d="M45.7,-76.1C58.9,-69.3,68.8,-55.4,76.5,-40.8C84.2,-26.2,89.7,-10.9,87.6,3.6C85.5,18.1,75.8,31.8,65.3,44.1C54.8,56.4,43.5,67.3,29.8,74.5C16.1,81.7,0,85.2,-14.8,82.4C-29.6,79.6,-43.1,70.5,-55.2,59.5C-67.3,48.5,-78.1,35.6,-83.4,20.4C-88.7,5.2,-88.5,-12.3,-82.4,-27.4C-76.3,-42.5,-64.3,-55.2,-50.7,-61.8C-37.1,-68.4,-21.9,-68.9,-5.8,-60.1C10.3,-51.3,32.5,-82.9,45.7,-76.1Z" transform="translate(100 100)" /></svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Kiri: Copywriting */}
            <div className="order-2 lg:order-1">
              <div className="text-accent font-bold tracking-wider text-sm mb-3">UNTUK PEMILIK BISNIS</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Maksimalkan Okupansi Kafe Anda, Tanpa Risiko Double-Booking.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                ThinkSpace bukan sekadar aplikasi user. Kami menyediakan Web-Dashboard canggih khusus mitra untuk memanajemen pengunjung walk-in & reservasi dalam satu layar yang rapi secara real-time.
              </p>
              <Link href="/mitra" className="inline-flex items-center justify-center gap-2 bg-white text-navy-950 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all">
                Pelajari Solusi Mitra →
              </Link>
            </div>
            
            {/* Kanan: REALISTIC LAPTOP MOCKUP CSS */}
            <div className="relative w-full max-w-150 mx-auto order-1 lg:order-2">
              <div className="relative bg-slate-800 rounded-t-2xl p-2.5 pb-3 border-x border-t border-slate-700 shadow-2xl">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
                
                <div className="bg-slate-900 rounded-md overflow-hidden border border-slate-800 h-75 flex flex-col">
                  <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-[10px] text-slate-400 flex-1 text-center bg-slate-900/50 py-1 rounded-md">mitra.thinkspace.id</div>
                  </div>
                  
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="text-white font-bold text-sm">Dashboard Kasir</h4>
                      <span className="bg-accent/20 text-accent text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live Sync
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/50">
                        <p className="text-slate-400 text-[10px] mb-1">Total Kursi Kafe</p>
                        <p className="text-white font-bold text-xl">40</p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                        <p className="text-accent text-[10px] mb-1">Tersedia Saat Ini</p>
                        <p className="text-accent font-bold text-xl">12</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800/50 flex-1 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-slate-500 text-xs">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                       Statistik Pengunjung
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative w-[112%] -ml-[6%] h-5 bg-slate-300 rounded-b-xl shadow-2xl border-b-4 border-slate-400 flex justify-center items-start z-20">
                <div className="w-24 h-1.5 bg-slate-400 rounded-b-md" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== CAFE DEMO ===== */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mb-2">
              Tersedia di Area <span className="text-accent">Bandung Raya</span>
            </h2>
            <p className="text-slate-500 text-sm">Sneak peek beberapa spot produktif di jaringan ThinkSpace.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}