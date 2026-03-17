"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import CafeCard from "@/components/CafeCard";

// ==========================================
// 1. KONEKSI KE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
// Ganti dengan Anon Key Anda
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const InteractiveMap = dynamic(() => import("@/components/CafeMap"), { ssr: false });

const filterAreas = [
  "Semua Area", "Bandung", "Dago", "Dipatiukur", "Ciumbuleuit", 
  "Buah Batu", "Jakarta Selatan", "Kemang", "Senopati", "Depok Margonda"
];

const filterFacilities = [
  "WiFi", "Stop Kontak", "Meeting Room", "Parkir", 
  "AC", "Mushola", "Outdoor", "Pet Friendly"
];

const priceOptions = [
  { id: "Semua", label: "Semua", desc: "Tampilkan Semua" },
  { id: "$", label: "Hemat", desc: "< 50rb" },
  { id: "$$", label: "Standar", desc: "50rb - 100rb" },
  { id: "$$$", label: "Premium", desc: "> 100rb" },
];

const priceMap: Record<string, string> = { "Semua": "Semua", "$": "$", "$$": "$$", "$$$": "$$$" };

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function FiturPage() {
  // ==========================================
  // 2. STATE UNTUK SUPABASE DATA
  // ==========================================
  const [cafes, setCafes] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Semua Area");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(4.0);
  const [sortBy, setSortBy] = useState("Rating Tertinggi");

  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // ==========================================
  // 3. FETCH DATA DARI DB SAAT MOUNTING
  // ==========================================
  useEffect(() => {
    async function fetchCafes() {
      setIsLoadingDB(true);
      const { data, error } = await supabase.from('cafes').select('*');
      
      if (error) {
        console.error("Gagal mengambil data dari Supabase:", error);
      } else if (data) {
        // Format data DB agar sesuai dengan format UI Card
        const formattedData = data.map(item => ({
          ...item,
          priceRange: item.price_range, 
          reviewCount: item.review_count
        }));
        setCafes(formattedData);
      }
      setIsLoadingDB(false);
    }

    fetchCafes();
  }, []);

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setSortBy("Terdekat");
          setIsLocating(false);
        },
        (error) => {
          alert("Gagal mendeteksi lokasi. Pastikan izin lokasi (GPS) diaktifkan di browser Anda.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      setIsLocating(false);
    }
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    cafes.forEach(cafe => {
      if (cafe.name.toLowerCase().includes(query)) suggestions.add(cafe.name);
      if (cafe.location.toLowerCase().includes(query)) suggestions.add(cafe.location);
    });
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, cafes]);

  const filteredCafes = useMemo(() => {
    return cafes
      .filter((cafe) => {
        const matchSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) || cafe.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchArea = selectedArea === "Semua Area" || cafe.location.toLowerCase().includes(selectedArea.toLowerCase()) || cafe.area.toLowerCase().includes(selectedArea.toLowerCase());
        const matchPrice = selectedPrice === "Semua" || cafe.priceRange === priceMap[selectedPrice];
        
        const safeFacilities = cafe.facilities || [];
        const matchFacilities = selectedFacilities.every((facility) => safeFacilities.includes(facility));
        
        const matchRating = (cafe.rating || 0) >= minRating;
        return matchSearch && matchArea && matchPrice && matchFacilities && matchRating;
      })
      .map(cafe => {
        if (userLocation && cafe.lat && cafe.lng) {
          const dist = getDistance(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng);
          return { ...cafe, distance: dist };
        }
        return cafe;
      })
      .sort((a, b) => {
        if (sortBy === "Terdekat" && a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
        if (sortBy === "Rating Tertinggi") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "Review Terbanyak") return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (sortBy === "Harga Terendah") return (a.priceRange || "").length - (b.priceRange || "").length;
        return 0;
      });
      // PERHATIKAN: .slice(0, 30) Dihapus agar semua 50 data tampil
  }, [searchQuery, selectedArea, selectedPrice, selectedFacilities, minRating, sortBy, userLocation, cafes]);

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) => prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]);
  };

  const resetFilters = () => {
    setSearchQuery(""); setSelectedArea("Semua Area"); setSelectedPrice("Semua"); 
    setSelectedFacilities([]); setMinRating(4.0); setUserLocation(null); setSortBy("Rating Tertinggi");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse duration-[3000ms]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent text-sm font-bold mb-6 backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Eksplorasi Spot Asli
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Temukan <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-yellow-200">Spot Nugas Idealmu</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Gunakan filter cerdas kami untuk menemukan kafe dengan WiFi kencang, stop kontak melimpah, dan jarak yang paling dekat denganmu.
          </p>
        </div>
      </section>

      {/* ===== MAP + FILTERS + RESULTS ===== */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* FILTER PANEL */}
            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-navy-950 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filter
                  </h3>
                  <button onClick={resetFilters} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Reset
                  </button>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-bold text-navy-950 block mb-2">Pilih Area</label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm bg-slate-50 text-navy-950 outline-none focus:border-accent focus:bg-white transition-all font-medium cursor-pointer"
                  >
                    {filterAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-bold text-navy-950 block mb-2">Estimasi Pengeluaran</label>
                  <div className="grid grid-cols-2 gap-2">
                    {priceOptions.map((price) => (
                      <button 
                        key={price.id} 
                        onClick={() => setSelectedPrice(price.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all duration-300 ${selectedPrice === price.id ? 'bg-accent/10 border-accent shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                      >
                        <p className={`font-bold text-sm ${selectedPrice === price.id ? 'text-navy-950' : 'text-slate-600'}`}>{price.label}</p>
                        <p className={`text-[10px] mt-0.5 ${selectedPrice === price.id ? 'text-yellow-700' : 'text-slate-400'}`}>{price.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-bold text-navy-950 block mb-3">Fasilitas Wajib</label>
                  <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                    {filterFacilities.map((facility) => (
                      <div 
                        key={facility} 
                        onClick={() => toggleFacility(facility)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedFacilities.includes(facility) ? 'bg-accent border-accent text-navy-950' : 'border-slate-300 bg-white group-hover:border-accent'}`}>
                          {selectedFacilities.includes(facility) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span className={`text-sm font-medium select-none ${selectedFacilities.includes(facility) ? 'text-navy-950' : 'text-slate-600'}`}>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-sm font-bold text-navy-950 block mb-2 flex justify-between">
                    Rating Minimum <span className="text-accent bg-accent/10 px-2 py-0.5 rounded text-xs">⭐ {minRating.toFixed(1)}+</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" max="5" step="0.5" 
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-yellow-500 cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                    <span>1.0</span><span>5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS AREA */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              
              <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm z-50">
                <div className="relative w-full xl:w-96 flex-shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari nama kafe atau lokasi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                  {searchQuery && (
                     <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                     </button>
                  )}

                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden animate-fade-in">
                      <p className="px-4 py-2 text-[10px] font-bold text-slate-400 bg-slate-50 uppercase tracking-wider">Saran Pencarian</p>
                      {searchSuggestions.map((suggestion, idx) => (
                        <div 
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault(); 
                            setSearchQuery(suggestion);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-none group"
                        >
                          <span className="text-sm font-bold text-navy-950 group-hover:text-accent transition-colors">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                  <button 
                    onClick={handleDetectLocation} 
                    disabled={isLocating} 
                    className={`w-full sm:w-auto font-bold text-sm px-5 py-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${userLocation ? 'bg-accent/10 border-accent text-navy-950' : 'bg-white border-slate-200 text-slate-600 hover:border-accent hover:text-navy-950'}`}
                  >
                    {isLocating ? "⏳ Melacak..." : userLocation ? "✅ Lokasi Aktif" : "📍 Cari di Sekitar Saya"}
                  </button>

                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold bg-white text-navy-950 outline-none focus:border-accent cursor-pointer"
                  >
                    {userLocation && <option value="Terdekat">Jarak Terdekat</option>}
                    <option value="Rating Tertinggi">Rating Tertinggi</option>
                    <option value="Review Terbanyak">Review Terbanyak</option>
                    <option value="Harga Terendah">Harga Terendah</option>
                  </select>
                </div>
              </div>

              {/* TAMPILAN LOADING VS PETA */}
              {isLoadingDB ? (
                <div className="rounded-[2rem] border border-slate-200 shadow-sm h-80 sm:h-[400px] lg:h-[450px] bg-slate-200 animate-pulse flex flex-col items-center justify-center gap-4 text-slate-500">
                  <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="font-bold">Menarik Data dari Database...</p>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-slate-200 shadow-sm h-80 sm:h-[400px] lg:h-[450px] bg-slate-100 relative overflow-hidden z-0">
                  <InteractiveMap cafes={filteredCafes} userLocation={userLocation} />
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <h3 className="font-bold text-xl text-navy-950">Rekomendasi Terbaik</h3>
                <p className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">
                  {isLoadingDB ? '...' : filteredCafes.length} Tempat Ditemukan
                </p>
              </div>

              {/* TAMPILAN LOADING KARTU VS DAFTAR KAFE */}
              {isLoadingDB ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>)}
                </div>
              ) : filteredCafes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCafes.map((cafe) => (
                    <div key={cafe.id} className="flex flex-col">
                      <CafeCard cafe={cafe} />
                      {userLocation && cafe.distance !== undefined && (
                        <p className="text-xs text-center font-bold text-green-600 mt-3 bg-green-50 rounded-xl py-2 border border-green-100">
                          🚗 {cafe.distance.toFixed(1)} km dari lokasimu
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4 opacity-50">🕵️‍♂️</div>
                  <h4 className="text-xl font-bold text-navy-950 mb-2">Yah, kafenya nggak ketemu!</h4>
                  <p className="text-slate-500 max-w-sm mx-auto mb-6">
                    Coba kurangi filter fasilitasnya, turunkan minimum rating, atau cari dengan kata kunci yang berbeda.
                  </p>
                  <button onClick={resetFilters} className="bg-accent text-navy-950 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/20">
                    Reset Semua Filter
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}} />
    </div>
  );
}