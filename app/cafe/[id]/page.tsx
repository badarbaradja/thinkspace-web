"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cafes } from "@/data/cafes";

// --- DATA DUMMY MENU ---
const menuCategories = ["Signature Coffee", "Non-Coffee", "Pastry & Snack", "Main Course"];
const menuItems = [
  { id: 1, category: "Signature Coffee", name: "Iced Aren Latte", desc: "Espresso, susu aren, cream", price: 25000, img: "☕" },
  { id: 2, category: "Signature Coffee", name: "Americano", desc: "Espresso double shot + air", price: 20000, img: "🧊" },
  { id: 3, category: "Signature Coffee", name: "Caramel Macchiato", desc: "Espresso, susu, sirup karamel", price: 28000, img: "🥤" },
  { id: 4, category: "Non-Coffee", name: "Matcha Fusion", desc: "Matcha premium dengan susu", price: 28000, img: "🍵" },
  { id: 5, category: "Non-Coffee", name: "Red Velvet Latte", desc: "Red velvet blend manis & creamy", price: 26000, img: "🍰" },
  { id: 6, category: "Pastry & Snack", name: "Butter Croissant", desc: "Flaky butter croissant hangat", price: 18000, img: "🥐" },
  { id: 7, category: "Pastry & Snack", name: "French Fries", desc: "Kentang goreng renyah + saus", price: 20000, img: "🍟" },
  { id: 8, category: "Main Course", name: "Nasi Goreng Spesial", desc: "Nasi goreng ayam + telur mata sapi", price: 35000, img: "🍳" },
];

type CartItem = { id: number; name: string; price: number; qty: number; img: string; };

export default function DynamicCafeBooking() {
  const params = useParams();
  const router = useRouter();
  
  // Ambil data kafe berdasarkan URL ID
  const cafeId = params.id as string;
  const cafeData = cafes.find(c => c.id === cafeId) || cafes[0]; // Fallback jika tidak ketemu

  // SIMULASI: Ketentuan Meja Custom berbeda-beda tiap kafe
  // (Anggap saja ini ditarik dari database backend nanti)
  const numericId = parseInt(cafeId.replace(/\D/g, '') || "1");
  const maxCustomPax = numericId % 3 === 0 ? 12 : numericId % 2 === 0 ? 8 : 10;

  // --- STATE MANAGEMENT ---
  const [selectedArea, setSelectedArea] = useState<string>("Indoor (AC)");
  // tableType sekarang bisa 2, 4, atau 'custom'
  const [tableType, setTableType] = useState<number | 'custom'>(2); 
  const [pax, setPax] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("Signature Coffee");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- BUSINESS LOGIC ---
  const MIN_SPEND_PER_PAX = 25000;
  const SPEND_PER_EXTRA_HOUR = 20000;
  const FEE_RESERVASI = 1000;
  const FEE_FNB = 1000;

  // Penentuan kapasitas maksimal berdasarkan tipe meja yang dipilih
  const currentMaxPax = tableType === 'custom' ? maxCustomPax : tableType;

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
  const fbTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  
  // Total minimum spend membengkak sesuai jumlah orang!
  const totalMinSpend = pax * MIN_SPEND_PER_PAX;
  
  let currentDuration = 0;
  if (fbTotal >= totalMinSpend) {
    const excessSpend = fbTotal - totalMinSpend;
    currentDuration = 2 + Math.floor(excessSpend / SPEND_PER_EXTRA_HOUR);
  }

  const nextTargetSpend = currentDuration === 0 ? totalMinSpend : totalMinSpend + ((currentDuration - 2 + 1) * SPEND_PER_EXTRA_HOUR);
  const spendLacking = nextTargetSpend - fbTotal;

  const hasFnbFee = cartItemCount > 0;
  const grandTotal = fbTotal + FEE_RESERVASI + (hasFnbFee ? FEE_FNB : 0);
  const isCheckoutReady = currentDuration >= 2;

  const displayedMenu = useMemo(() => menuItems.filter((item) => item.category === activeCategory), [activeCategory]);

  const processPayment = () => {
    if (!selectedPayment) return;
    setIsProcessingPayment(true);
    
    // REDIRECT KE HALAMAN PEMBAYARAN
    setTimeout(() => {
      router.push(`/payment?method=${selectedPayment}&amount=${grandTotal}&cafe=${encodeURIComponent(cafeData.name)}`);
    }, 1000);
  };

  const paymentMethods = [
    { id: "qris", name: "QRIS", desc: "Bebas biaya admin", icon: "📱" },
    { id: "gopay", name: "GoPay", desc: "Terkoneksi aplikasi Gojek", icon: "🟢" },
    { id: "bca", name: "BCA Virtual Account", desc: "Cek otomatis", icon: "🏦" },
    { id: "mandiri", name: "Mandiri Virtual Account", desc: "Cek otomatis", icon: "🏦" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/" className="hover:text-accent">Home</Link><span>/</span>
          <Link href="/fitur" className="hover:text-accent">Cafe</Link><span>/</span>
          <span className="text-navy-950 truncate">{cafeData.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI: INFO DINAMIS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-full h-48 rounded-2xl mb-5 overflow-hidden relative bg-slate-200">
                <img src={cafeData.image} alt={cafeData.name} className="object-cover w-full h-full" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Buka s/d 22:00
                </div>
              </div>
              <h1 className="text-2xl font-bold text-navy-950 mb-1">{cafeData.name}</h1>
              <p className="text-slate-500 text-sm mb-5 flex items-start gap-1">
                <span>📍</span> <span>{cafeData.location}</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-navy-950 flex items-center gap-2">
                  <span className="text-xl">🪑</span> Pilih Tipe Meja
                </h3>
              </div>
              
              {/* OPSI MEJA SEKARANG ADA 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button onClick={() => { setTableType(2); setPax(Math.min(pax, 2)); }} className={`p-3 rounded-xl border-2 text-left transition-all ${tableType === 2 ? 'bg-accent/10 border-accent' : 'bg-white border-slate-100'}`}>
                  <p className={`font-bold text-sm ${tableType === 2 ? 'text-navy-950' : 'text-slate-600'}`}>Meja 2 Pax</p>
                  <p className="text-[10px] text-green-600 font-semibold mt-1">Tersedia</p>
                </button>
                <button onClick={() => { setTableType(4); setPax(Math.min(pax, 4)); }} className={`p-3 rounded-xl border-2 text-left transition-all ${tableType === 4 ? 'bg-accent/10 border-accent' : 'bg-white border-slate-100'}`}>
                  <p className={`font-bold text-sm ${tableType === 4 ? 'text-navy-950' : 'text-slate-600'}`}>Meja 4 Pax</p>
                  <p className="text-[10px] text-green-600 font-semibold mt-1">Tersedia</p>
                </button>
                <button onClick={() => { setTableType('custom'); }} className={`p-3 rounded-xl border-2 text-left transition-all ${tableType === 'custom' ? 'bg-accent/10 border-accent' : 'bg-white border-slate-100'}`}>
                  <p className={`font-bold text-sm ${tableType === 'custom' ? 'text-navy-950' : 'text-slate-600'}`}>Custom</p>
                  <p className="text-[10px] text-orange-500 font-semibold mt-1">Maks {maxCustomPax} Orang</p>
                </button>
              </div>

              <h3 className="font-bold text-navy-950 mb-3 text-sm">Jumlah Orang (Max {currentMaxPax} Pax)</h3>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2 w-fit mb-6">
                <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-10 h-10 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100">-</button>
                <span className="w-8 text-center font-bold text-navy-950">{pax}</span>
                <button onClick={() => setPax(Math.min(currentMaxPax, pax + 1))} className="w-10 h-10 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100">+</button>
              </div>

              {/* DYNAMIC DURATION */}
              <div className="bg-navy-950 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl"></div>
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Status Nugas</h4>
                {currentDuration === 0 ? (
                  <>
                    <div className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">Terkunci</div>
                    <p className="text-xs text-slate-300 leading-relaxed">Minimum spend <strong className="text-accent">Rp {totalMinSpend.toLocaleString('id-ID')}</strong> ({pax} pax) untuk unlock <strong className="text-white">2 Jam</strong>.</p>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (fbTotal / totalMinSpend) * 100)}%` }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-accent mb-1">{currentDuration} Jam Unlocked!</div>
                    <p className="text-xs text-slate-300">Tambah jajan <strong className="text-white">Rp {spendLacking.toLocaleString('id-ID')}</strong> untuk nugas <strong className="text-accent">{currentDuration + 1} Jam</strong>.</p>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-green-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${((SPEND_PER_EXTRA_HOUR - spendLacking) / SPEND_PER_EXTRA_HOUR) * 100}%` }}></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: MENU */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] max-h-[85vh] relative">
              <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-navy-950">Menu {cafeData.name}</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Pilih menumu. Semakin banyak belanja, semakin lama durasi nugasmu!</p>
              </div>
              
              <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Kategori (Desktop) */}
                <div className="w-1/3 max-w-[180px] bg-slate-50 border-r border-slate-100 p-4 overflow-y-auto hidden sm:block">
                  {menuCategories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold mb-2 transition-all ${activeCategory === cat ? 'bg-white text-accent shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-200/50'}`}>{cat}</button>
                  ))}
                </div>
                
                {/* List Produk */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto pb-28 relative">
                  
                  {/* Kategori Mobile */}
                  <div className="flex sm:hidden overflow-x-auto gap-2 mb-4 pb-3 sticky -top-4 z-20 bg-white/95 backdrop-blur-md pt-4 -mx-4 px-4 shadow-[0_4px_10px_-10px_rgba(0,0,0,0.2)] hide-scrollbar">
                    {menuCategories.map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)} 
                        className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-navy-950 text-white border-navy-950 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <h3 className="font-bold text-lg text-navy-950 mb-4">{activeCategory}</h3>
                  
                  <div className="space-y-4">
                    {displayedMenu.map((item) => {
                      const cartItem = cart.find(c => c.id === item.id);
                      return (
                        <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-100 rounded-2xl hover:border-accent/50 hover:shadow-md transition-all bg-white">
                          <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center text-3xl shrink-0">{item.img}</div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-navy-950 text-sm sm:text-base">{item.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.desc}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                              {cartItem ? (
                                <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md font-bold text-slate-600">-</button>
                                  <span className="text-xs font-bold w-4 text-center">{cartItem.qty}</span>
                                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-accent bg-accent/10 hover:bg-accent hover:text-white rounded-md font-bold">+</button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(item)} className="bg-white border-2 border-accent text-accent hover:bg-accent hover:text-navy-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">Tambah</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CART */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button onClick={() => setIsCartModalOpen(true)} className="relative w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 text-accent rounded-xl sm:rounded-2xl flex items-center justify-center border border-accent/20">
              <span className="text-xl sm:text-2xl">🛒</span>
              {cartItemCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">{cartItemCount}</span>}
            </button>
            <div className="cursor-pointer flex-1" onClick={() => setIsCartModalOpen(true)}>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-0.5">Total Estimasi</p>
              <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-2">
                <p className="font-extrabold text-navy-950 text-base sm:text-xl leading-none">Rp {grandTotal.toLocaleString('id-ID')}</p>
                {currentDuration > 0 && <p className="text-[10px] sm:text-xs text-green-600 font-bold mt-1 sm:mt-0 sm:mb-0.5 leading-none">(+ Nugas {currentDuration} Jam)</p>}
              </div>
            </div>
          </div>
          <button onClick={() => setIsCartModalOpen(true)} className="bg-navy-950 text-white font-bold px-5 sm:px-10 py-3 sm:py-4 rounded-xl text-sm sm:text-base hover:bg-navy-900 shadow-xl whitespace-nowrap">Lihat Struk</button>
        </div>
      </div>

      {/* MODAL STRUK */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative animate-slide-up">
            <button onClick={() => setIsCartModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600">✖</button>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-950 mb-5">Rincian Pesanan</h2>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 max-h-40 overflow-y-auto hide-scrollbar">
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Makanan & Minuman</p>
              {cart.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Belum ada pesanan.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm mb-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-bold text-navy-950 pr-2">{item.qty}x {item.name}</span>
                    <span className="font-bold shrink-0">Rp {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="space-y-2 mb-6 text-xs sm:text-sm px-1">
              <div className="flex justify-between"><p className="text-slate-600">Sewa Meja ({tableType === 'custom' ? 'Custom' : tableType} Pax) - {currentDuration > 0 ? `${currentDuration} Jam` : 'Terkunci'}</p><p className="font-bold text-green-600">GRATIS</p></div>
              <div className="flex justify-between"><p className="text-slate-500">Biaya Layanan Reservasi</p><p className="font-bold">Rp {FEE_RESERVASI.toLocaleString()}</p></div>
              {hasFnbFee && <div className="flex justify-between"><p className="text-slate-500">Biaya Layanan F&B</p><p className="font-bold">Rp {FEE_FNB.toLocaleString()}</p></div>}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-6 flex justify-between items-center text-xl sm:text-2xl font-extrabold text-navy-950">
              <span className="text-base sm:text-lg text-slate-500 font-medium">Total</span>
              <span>Rp {grandTotal.toLocaleString()}</span>
            </div>
            
            {!isCheckoutReady ? (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs sm:text-sm font-bold text-center border border-red-100">⚠️ Capai Minimum Spend Rp {totalMinSpend.toLocaleString()} untuk nugas.</div>
            ) : (
              <button onClick={() => { setIsCartModalOpen(false); setIsPaymentModalOpen(true); }} className="w-full bg-accent text-navy-950 font-bold py-4 rounded-xl text-base sm:text-lg hover:bg-yellow-400 shadow-lg active:scale-95 transition-transform">Lanjut Pembayaran</button>
            )}
          </div>
        </div>
      )}

      {/* MODAL PILIH PEMBAYARAN */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-navy-950/70 backdrop-blur-md p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative animate-slide-up flex flex-col max-h-[85vh]">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600">✖</button>
            <h2 className="text-xl font-bold text-navy-950 mb-1">Pilih Pembayaran</h2>
            <p className="text-sm text-slate-500 mb-5 border-b border-slate-100 pb-4">Tagihan: <span className="font-bold text-accent text-lg">Rp {grandTotal.toLocaleString()}</span></p>
            
            <div className="space-y-3 overflow-y-auto pb-4 hide-scrollbar flex-1">
              {paymentMethods.map((method) => (
                <div key={method.id} onClick={() => !isProcessingPayment && setSelectedPayment(method.id)} className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div><p className="font-bold text-navy-950 text-sm">{method.name}</p><p className="text-[10px] sm:text-xs text-slate-500">{method.desc}</p></div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-accent' : 'border-slate-300'}`}>
                      {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                    </div>
                  </div>
                  {selectedPayment === method.id && (
                    <button onClick={processPayment} disabled={isProcessingPayment} className="w-full mt-4 bg-navy-950 text-white font-bold py-3.5 rounded-xl text-sm flex justify-center items-center gap-2">
                      {isProcessingPayment ? "Memproses..." : `Bayar dengan ${method.name}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}