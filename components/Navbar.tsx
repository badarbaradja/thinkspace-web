"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fitur", label: "Fitur" },
  { href: "/mitra", label: "Mitra" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ==========================================
  // LOGIKA PENTING: SEMBUNYIKAN NAVBAR DI /AUTH
  // ==========================================
  if (pathname === "/auth") {
    return null; // Membatalkan render Navbar seutuhnya
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Pastikan Anda memiliki file /logo.png di folder public Anda */}
            <Image src="/logo.png" alt="ThinkSpace" width={32} height={32} className="w-8 h-8" />
            <span className="text-lg font-bold text-white tracking-tight">
              ThinkSpace
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-accent"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA (SUDAH DIPISAH LOGIN & REGISTER) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-slate-300 hover:text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="bg-accent hover:bg-yellow-400 text-navy-950 font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-accent/20"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-950 border-t border-white/5 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent bg-white/5"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Mobile CTA (DIPISAH LOGIN & REGISTER) */}
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-accent hover:bg-yellow-400 text-navy-950 font-bold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}