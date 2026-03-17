"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// --- INISIALISASI SUPABASE ---
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type AuthMode = "login" | "register" | "forgot_password";

export default function AuthPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- HANDLERS DENGAN SUPABASE ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading("credentials");
    
    // Panggil API Supabase untuk Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsLoading(null);

    if (error) {
      alert("❌ Login Gagal: " + error.message);
    } else {
      // Jika berhasil, arahkan kembali ke halaman sebelumnya atau beranda
      router.back(); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirmPassword) return;
    setIsLoading("register");
    
    // Panggil API Supabase untuk Registrasi
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name, // Simpan nama lengkap di metadata user
        }
      }
    });

    setIsLoading(null);

    if (error) {
      alert("❌ Registrasi Gagal: " + error.message);
    } else {
      alert("🎉 Registrasi Berhasil! Silakan Login menggunakan akun yang baru saja dibuat.");
      setAuthMode("login"); 
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading("reset");
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    setIsLoading(null);

    if (error) {
      alert("❌ Gagal mengirim link reset: " + error.message);
    } else {
      alert(`✅ Link reset password telah dikirim ke ${email}. Silakan cek kotak masuk Anda.`);
      setAuthMode("login"); 
    }
  };

  const handleSSOLogin = async (provider: "google" | "apple") => {
    setIsLoading(provider);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin, // Akan kembali ke beranda setelah SSO berhasil
      }
    });

    if (error) {
      alert(`❌ Gagal login dengan ${provider}: ` + error.message);
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-slate-50 overflow-y-auto">
      
      {/* =======================================
          KOLOM KIRI: BRANDING & MOCKUP 
          ======================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 p-12 flex-col relative overflow-hidden min-h-full">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4 animate-pulse duration-[4000ms]" />
        
        <div className="relative z-10 mb-12">
          <Link href="/" className="inline-flex items-center gap-3 text-white font-bold text-2xl tracking-tight hover:text-accent transition-colors">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-navy-950"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
            </div>
            ThinkSpace
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          <div className="relative w-full h-64 sm:h-72 mb-10 animate-fade-in-up mt-8">
            {/* Laptop Mockup */}
            <div className="absolute top-0 left-0 right-12 z-10">
              <div className="relative w-full bg-slate-800 rounded-t-xl p-2 pb-3 border-x border-t border-slate-700 shadow-2xl">
                <div className="bg-slate-900 h-40 sm:h-48 rounded-lg overflow-hidden flex flex-col border border-slate-800">
                  <div className="h-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 p-4 flex gap-4">
                    <div className="w-1/3 flex flex-col gap-3">
                      <div className="h-16 bg-accent/10 rounded-lg border border-accent/20 flex flex-col justify-center px-3">
                        <div className="w-8 h-2 bg-accent/50 rounded mb-2"></div>
                        <div className="w-16 h-4 bg-accent rounded"></div>
                      </div>
                      <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/30"></div>
                    </div>
                    <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/30"></div>
                  </div>
                </div>
              </div>
              <div className="relative w-[110%] -ml-[5%] h-3 bg-slate-400 rounded-b-xl shadow-2xl flex justify-center z-20 border-b-[3px] border-slate-500">
                <div className="w-16 h-1 bg-slate-500 rounded-b-md"></div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="absolute -bottom-6 right-0 z-30 w-32 sm:w-36 h-64 sm:h-72 bg-black rounded-[2rem] p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border-2 border-slate-800 transform rotate-12 hover:rotate-0 hover:-translate-y-4 transition-all duration-500 cursor-pointer">
              <div className="w-full h-full bg-slate-50 rounded-[1.6rem] overflow-hidden flex flex-col relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-30"></div>
                <div className="flex-1 pt-8 px-3 flex flex-col gap-3">
                  <div className="w-full h-20 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="h-12 bg-slate-200 w-full"></div>
                    <div className="flex-1 p-1.5 flex flex-col gap-1 justify-center">
                      <div className="w-3/4 h-1.5 bg-slate-300 rounded"></div>
                      <div className="w-1/2 h-1 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-8 bg-accent/20 rounded-lg border border-accent/30 flex items-center justify-center">
                    <div className="w-1/2 h-2 bg-accent/60 rounded"></div>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    <div className="w-[calc(50%-3px)] h-10 bg-green-100 rounded-md border border-green-200"></div>
                    <div className="w-[calc(50%-3px)] h-10 bg-red-100 rounded-md border border-red-200"></div>
                    <div className="w-[calc(50%-3px)] h-10 bg-green-100 rounded-md border border-green-200"></div>
                    <div className="w-[calc(50%-3px)] h-10 bg-navy-950 rounded-md border border-navy-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
              Akses ribuan <span className="text-accent">spot produktif</span> dalam satu ketukan.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Bergabunglah dengan ekosistem mahasiswa dan profesional yang bekerja lebih cerdas, bukan lebih keras.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-navy-950 bg-slate-300 flex items-center justify-center text-xl z-20">👨‍💻</div>
                <div className="w-10 h-10 rounded-full border-2 border-navy-950 bg-slate-400 flex items-center justify-center text-xl z-10">👩‍🎓</div>
                <div className="w-10 h-10 rounded-full border-2 border-navy-950 bg-accent flex items-center justify-center text-xs font-bold text-navy-950 z-0">5k+</div>
              </div>
              <p className="text-sm text-slate-400 font-medium">Pengguna aktif di Bandung</p>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================
          KOLOM KANAN: DYNAMIC AUTH FORMS
          ======================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white lg:bg-slate-50 min-h-full">
        <Link href="/" className="absolute top-6 left-6 lg:hidden w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:bg-slate-200 transition-colors">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 lg:rounded-[2.5rem] lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] lg:border border-slate-100 relative overflow-hidden my-auto">
          
          {/* ----------------- FORM LOGIN ----------------- */}
          {authMode === "login" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-extrabold text-navy-950 mb-2">Login</h2>
              <p className="text-slate-500 mb-8 text-sm">Selamat datang kembali! Silakan masuk ke akun ThinkSpace kamu.</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-navy-950 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <input type="email" required placeholder="contoh@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-navy-950">Password</label>
                    <button type="button" onClick={() => setAuthMode("forgot_password")} className="text-xs font-bold text-slate-500 hover:text-accent transition-colors">Lupa password?</button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white transition-all tracking-widest" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading !== null || !email || !password} className="w-full bg-accent text-navy-950 font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                  {isLoading === "credentials" ? "Memproses..." : "Login"}
                </button>
              </form>

              {/* SSO Buttons Area */}
              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATAU LOGIN DENGAN</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="space-y-3 mb-8">
                <button onClick={() => handleSSOLogin("google")} disabled={isLoading !== null} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
                  {isLoading === "google" ? "Memproses..." : (
                    <><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Lanjutkan dengan Google</>
                  )}
                </button>
                <button onClick={() => handleSSOLogin("apple")} disabled={isLoading !== null} className="w-full flex items-center justify-center gap-3 bg-black border-2 border-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50">
                  {isLoading === "apple" ? "Memproses..." : (
                    <><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 14.505c-.015-2.28 1.86-3.39 1.95-3.435-1.05-1.545-2.685-1.755-3.27-1.785-1.395-.135-2.73.825-3.435.825-.705 0-1.815-.81-2.97-.795-1.5.015-2.895.87-3.675 2.22-1.575 2.745-.405 6.81 1.125 9.03.75 1.08 1.62 2.295 2.76 2.25 1.11-.045 1.545-.72 2.895-.72 1.335 0 1.74.72 2.91.69 1.185-.03 1.935-1.125 2.67-2.19.855-1.245 1.2-2.46 1.215-2.52-.03-.015-2.16-.825-2.175-3.57zM14.565 6.42c.615-.75 1.035-1.785.915-2.82-.885.045-1.965.6-2.61 1.35-.57.66-.99 1.71-.855 2.73 1.005.075 2.025-.51 2.55-1.26z"/></svg> Lanjutkan dengan Apple</>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 font-medium">Belum punya akun? <button onClick={() => setAuthMode("register")} className="text-accent font-bold hover:underline underline-offset-4">Register di sini</button></p>
              </div>
            </div>
          )}

          {/* ----------------- FORM REGISTER ----------------- */}
          {authMode === "register" && (
            <div className="animate-fade-in">
              <button onClick={() => setAuthMode("login")} className="mb-6 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h2 className="text-3xl font-extrabold text-navy-950 mb-2">Buat Akun</h2>
              <p className="text-slate-500 mb-6 text-sm">Daftar sekarang dan temukan spot produktif pertamamu.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">Nama Lengkap</label>
                  <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1.5">Email</label>
                  <input type="email" required placeholder="contoh@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">Password</label>
                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">Ulangi Password</label>
                    <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm outline-none ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-slate-100 focus:border-accent'}`} />
                  </div>
                </div>

                <button type="submit" disabled={isLoading !== null || !name || !email || !password || password !== confirmPassword} className="w-full bg-navy-950 text-white font-bold py-4 rounded-xl hover:bg-navy-900 transition-colors shadow-lg disabled:opacity-50 mt-4">
                  {isLoading === "register" ? "Mendaftarkan..." : "Daftar Sekarang"}
                </button>
              </form>

              {/* SSO Buttons Area di Register */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATAU DAFTAR DENGAN</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => handleSSOLogin("google")} disabled={isLoading !== null} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
                </button>
                <button onClick={() => handleSSOLogin("apple")} disabled={isLoading !== null} className="w-full flex items-center justify-center gap-2 bg-black border-2 border-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 14.505c-.015-2.28 1.86-3.39 1.95-3.435-1.05-1.545-2.685-1.755-3.27-1.785-1.395-.135-2.73.825-3.435.825-.705 0-1.815-.81-2.97-.795-1.5.015-2.895.87-3.675 2.22-1.575 2.745-.405 6.81 1.125 9.03.75 1.08 1.62 2.295 2.76 2.25 1.11-.045 1.545-.72 2.895-.72 1.335 0 1.74.72 2.91.69 1.185-.03 1.935-1.125 2.67-2.19.855-1.245 1.2-2.46 1.215-2.52-.03-.015-2.16-.825-2.175-3.57zM14.565 6.42c.615-.75 1.035-1.785.915-2.82-.885.045-1.965.6-2.61 1.35-.57.66-.99 1.71-.855 2.73 1.005.075 2.025-.51 2.55-1.26z"/></svg> Apple
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 font-medium">Sudah punya akun? <button onClick={() => setAuthMode("login")} className="text-accent font-bold hover:underline underline-offset-4">Login di sini</button></p>
              </div>
            </div>
          )}

          {/* ----------------- FORM FORGOT PASSWORD ----------------- */}
          {authMode === "forgot_password" && (
            <div className="animate-fade-in">
              <button onClick={() => setAuthMode("login")} className="mb-6 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h2 className="text-3xl font-extrabold text-navy-950 mb-2">Lupa Password?</h2>
              <p className="text-slate-500 mb-8 text-sm">Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.</p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-navy-950 mb-2">Email Terdaftar</label>
                  <input type="email" required placeholder="contoh@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white" />
                </div>

                <button type="submit" disabled={isLoading !== null || !email} className="w-full bg-accent text-navy-950 font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50">
                  {isLoading === "reset" ? "Mengirim Email..." : "Kirim Tautan Reset"}
                </button>
              </form>
            </div>
          )}

          {/* Ketentuan - Selalu Tampil */}
          <p className="text-center text-[10px] text-slate-400 mt-8">
            Dengan melanjutkan, kamu menyetujui <br/><Link href="#" className="underline">Syarat & Ketentuan</Link> serta <Link href="#" className="underline">Kebijakan Privasi</Link> kami.
          </p>

        </div>
      </div>

      {/* Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
      `}} />
    </div>
  );
}