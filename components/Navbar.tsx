"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- INISIALISASI SUPABASE ---
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fitur", label: "Fitur" },
  { href: "/mitra", label: "Mitra" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    setMobileOpen(false);
    router.push('/'); 
  };

  if (pathname === "/auth") return null; 

  // Ambil data penting dari metadata
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url; // Tarik gambar dari DB!

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="ThinkSpace" width={32} height={32} className="w-8 h-8" />
            <span className="text-lg font-bold text-white tracking-tight">ThinkSpace</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive ? "text-accent" : "text-slate-400 hover:text-white"}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link href="/auth" className="bg-accent hover:bg-yellow-400 text-navy-950 font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-accent/20">
                Login
              </Link>
            ) : (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10">
                  
                  {/* Lingkaran Avatar Navbar Desktop */}
                  <div className="w-8 h-8 rounded-full bg-accent text-navy-950 flex items-center justify-center font-bold text-xs shadow-md shadow-accent/20 overflow-hidden border border-white/10">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  
                  <div className="text-left hidden lg:block max-w-[120px]">
                    <p className="text-sm font-bold text-white truncate leading-tight">{userName}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-bold text-navy-950 truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { setIsProfileOpen(false); router.push('/profil'); }} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy-950 rounded-lg transition-colors font-medium flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profil Saya
                      </button>
                      <button onClick={() => { setIsProfileOpen(false); router.push('/riwayat'); }} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy-950 rounded-lg transition-colors font-medium flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Riwayat
                      </button>
                      <hr className="my-1 border-slate-100" />
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/5 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-accent bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
              {!user ? (
                <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center w-full bg-accent hover:bg-yellow-400 text-navy-950 font-bold text-sm px-5 py-3 rounded-lg transition-colors">
                  Login
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-lg border border-white/10">
                    
                    {/* Lingkaran Avatar Navbar Mobile */}
                    <div className="w-10 h-10 rounded-full bg-accent text-navy-950 flex items-center justify-center font-bold text-sm overflow-hidden border border-white/10">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { setMobileOpen(false); router.push('/profil'); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Profil Saya
                  </button>
                  <button onClick={() => { setMobileOpen(false); router.push('/riwayat'); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Riwayat
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Keluar (Logout)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.2s ease-out forwards; }
      `}} />
    </nav>
  );
}