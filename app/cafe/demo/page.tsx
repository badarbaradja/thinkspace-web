"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// --- DATA DUMMY ---
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

// --- TIPE DATA KERANJANG ---
type CartItem = { id: number; name: string; price: number; qty: number; img: string; };

export default function CafeBookingDemo() {
  // --- STATE MANAGEMENT ---
  const [selectedArea, setSelectedArea] = useState<string>("Indoor (AC)");
  const [tableType, setTableType] = useState<number>(2);
  const [pax, setPax] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("Signature Coffee");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // State untuk Modal
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // State Pembayaran
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- BUSINESS LOGIC ---
  const MIN_SPEND_PER_PAX = 25000;
  const SPEND_PER_EXTRA_HOUR = 20000;
  const FEE_RESERVASI = 1000;
  const FEE_FNB = 1000;

  // --- LOGIKA KERANJANG ---
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

  // --- KALKULASI TOTAL & DURASI ---
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
  const fbTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const totalMinSpend = pax * MIN_SPEND_PER_PAX;
  
  let currentDuration = 0;
  if (fbTotal >= totalMinSpend) {
    const excessSpend = fbTotal - totalMinSpend;
    currentDuration = 2 + Math.floor(excessSpend / SPEND_PER_EXTRA_HOUR);
  }

  const nextTargetSpend = currentDuration === 0 
    ? totalMinSpend 
    : totalMinSpend + ((currentDuration - 2 + 1) * SPEND_PER_EXTRA_HOUR);
  const spendLacking = nextTargetSpend - fbTotal;

  const hasFnbFee = cartItemCount > 0;
  const grandTotal = fbTotal + FEE_RESERVASI + (hasFnbFee ? FEE_FNB : 0);
  const isCheckoutReady = currentDuration >= 2;

  const displayedMenu = useMemo(() => menuItems.filter((item) => item.category === activeCategory), [activeCategory]);

  // --- HANDLER MODAL ---
  const handleOpenPayment = () => {
    setIsCartModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const processPayment = () => {
    if (!selectedPayment) return;
    setIsProcessingPayment(true);
    
    // Simulasi loading dari payment gateway (1.5 detik)
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  // --- PAYMENT METHODS DATA ---
  const paymentMethods = [
    { id: "qris", name: "QRIS", desc: "Bebas biaya admin", icon: "📱", category: "Instan" },
    { id: "gopay", name: "GoPay", desc: "Terkoneksi dengan aplikasi Gojek", icon: "🟢", category: "E-Wallet" },
    { id: "ovo", name: "OVO", desc: "Bayar instan dengan OVO", icon: "🟣", category: "E-Wallet" },
    { id: "bca", name: "BCA Virtual Account", desc: "Dicek otomatis", icon: "🏦", category: "Transfer Bank" },
    { id: "mandiri", name: "Mandiri Virtual Account", desc: "Dicek otomatis", icon: "🏦", category: "Transfer Bank" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy-950">Kopi Kisah Kita</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* =======================================
              KOLOM KIRI: INFO MEJA & PAX
              ======================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="w-full h-48 bg-slate-200 rounded-2xl mb-5 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🏪</div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Buka s/d 22:00
                </div>
              </div>
              <h1 className="text-2xl font-bold text-navy-950 mb-1">Kopi Kisah Kita</h1>
              <p className="text-slate-500 text-sm mb-5">📍 Telkom University Area, Bojongsoang</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-navy-950 flex items-center gap-2">
                  <span className="text-xl">🪑</span> Pilih Tipe Meja
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => { setTableType(2); setPax(Math.min(pax, 2)); }} className={`p-3 rounded-xl border-2 text-left transition-all ${tableType === 2 ? 'bg-accent/10 border-accent' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                  <p className={`font-bold ${tableType === 2 ? 'text-navy-950' : 'text-slate-600'}`}>Meja 2 Pax</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">Tersisa 4 Meja</p>
                </button>
                <button onClick={() => { setTableType(4); }} className={`p-3 rounded-xl border-2 text-left transition-all ${tableType === 4 ? 'bg-accent/10 border-accent' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                  <p className={`font-bold ${tableType === 4 ? 'text-navy-950' : 'text-slate-600'}`}>Meja 4 Pax</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">Tersisa 1 Meja</p>
                </button>
              </div>

              <h3 className="font-bold text-navy-950 mb-3 text-sm">Jumlah Orang (Max {tableType} Pax)</h3>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2 w-fit mb-6">
                <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-10 h-10 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100">-</button>
                <span className="w-8 text-center font-bold text-navy-950">{pax}</span>
                <button onClick={() => setPax(Math.min(tableType, pax + 1))} className="w-10 h-10 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100">+</button>
              </div>

              {/* DYNAMIC DURATION TRACKER */}
              <div className="bg-navy-950 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl"></div>
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Status Nugas</h4>
                
                {currentDuration === 0 ? (
                  <>
                    <div className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Terkunci
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Wajib pesanan minimum <strong className="text-accent">Rp {totalMinSpend.toLocaleString('id-ID')}</strong> ({pax} pax) untuk unlock <strong className="text-white">2 Jam</strong> pertama.
                    </p>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (fbTotal / totalMinSpend) * 100)}%` }}></div>
                    </div>
                    <p className="text-[10px] text-accent mt-1.5 text-right">Kurang Rp {spendLacking.toLocaleString('id-ID')}</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-accent mb-1 flex items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                      {currentDuration} Jam Unlocked!
                    </div>
                    <p className="text-xs text-slate-300">
                      Tambah jajan <strong className="text-white">Rp {spendLacking.toLocaleString('id-ID')}</strong> lagi untuk nugas sampai <strong className="text-accent">{currentDuration + 1} Jam</strong>.
                    </p>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-green-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${((SPEND_PER_EXTRA_HOUR - spendLacking) / SPEND_PER_EXTRA_HOUR) * 100}%` }}></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* =======================================
              KOLOM KANAN: MENU (ESB STYLE)
              ======================================= */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] max-h-[800px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-navy-950">Pesan Makanan & Minuman</h2>
                <p className="text-slate-500 text-sm mt-1">Pilih menumu. Semakin banyak belanja, semakin lama durasi nugasmu!</p>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 max-w-[180px] bg-slate-50 border-r border-slate-100 p-4 overflow-y-auto hidden sm:block">
                  {menuCategories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold mb-2 transition-all duration-300 ${activeCategory === cat ? 'bg-white text-accent shadow-sm border border-slate-100 scale-[1.02]' : 'text-slate-500 hover:bg-slate-200/50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24">
                  <div className="flex sm:hidden overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
                    {menuCategories.map((cat) => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-navy-950 text-white border-navy-950' : 'bg-white text-slate-500 border-slate-200'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  <h3 className="font-bold text-lg text-navy-950 mb-5">{activeCategory}</h3>
                  <div className="space-y-4">
                    {displayedMenu.map((item) => {
                      const cartItem = cart.find(c => c.id === item.id);
                      return (
                        <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-accent/50 hover:shadow-md transition-all duration-300 group bg-white">
                          <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">{item.img}</div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-navy-950">{item.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.desc}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                              {cartItem ? (
                                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded-md font-bold">-</button>
                                  <span className="text-xs font-bold w-4 text-center">{cartItem.qty}</span>
                                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-accent bg-accent/10 hover:bg-accent hover:text-white rounded-md font-bold">+</button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(item)} className="bg-white border-2 border-accent text-accent hover:bg-accent hover:text-navy-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95">Tambah</button>
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

      {/* =======================================
          FLOATING BOTTOM BAR
          ======================================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => setIsCartModalOpen(true)} className="relative w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center border border-accent/20 hover:bg-accent/20 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">{cartItemCount}</span>
              )}
            </button>
            <div className="flex-1 cursor-pointer" onClick={() => setIsCartModalOpen(true)}>
              <p className="text-xs text-slate-500 font-medium mb-0.5">Total Estimasi</p>
              <div className="flex items-end gap-2">
                <p className="font-extrabold text-navy-950 text-xl">Rp {grandTotal.toLocaleString('id-ID')}</p>
                {currentDuration > 0 && <p className="text-xs text-green-600 font-bold mb-1">(+ Nugas {currentDuration} Jam)</p>}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsCartModalOpen(true)}
            className="w-full sm:w-auto bg-navy-950 text-white font-bold px-10 py-4 rounded-xl hover:bg-navy-900 transition-all shadow-xl shadow-navy-950/20 flex items-center justify-center gap-2 active:scale-95"
          >
            Lihat Struk
          </button>
        </div>
      </div>

      {/* =======================================
          MODAL 1: KERANJANG & STRUK
          ======================================= */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl animate-slide-up relative">
            <button onClick={() => setIsCartModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <h2 className="text-2xl font-bold text-navy-950 mb-6">Rincian Pesanan</h2>

            {/* F&B Items */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 max-h-40 overflow-y-auto">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Makanan & Minuman</p>
              {cart.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Belum ada pesanan.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-3 last:mb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.img}</span>
                      <div>
                        <p className="font-bold text-sm text-navy-950">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.qty}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                ))
              )}
            </div>

            {/* Rincian Reservasi & Admin */}
            <div className="space-y-3 mb-6 px-1">
              <div className="flex justify-between text-sm">
                <p className="text-slate-600">Sewa Meja ({tableType} Pax) - {currentDuration > 0 ? `${currentDuration} Jam` : 'Terkunci'}</p>
                <p className="font-bold text-green-600">GRATIS</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-slate-500">Biaya Layanan Reservasi</p>
                <p className="font-bold">Rp {FEE_RESERVASI.toLocaleString('id-ID')}</p>
              </div>
              {hasFnbFee && (
                <div className="flex justify-between text-sm">
                  <p className="text-slate-500">Biaya Layanan Pemesanan (F&B)</p>
                  <p className="font-bold">Rp {FEE_FNB.toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4 mb-6 flex justify-between items-center">
              <p className="text-slate-500 font-medium">Grand Total</p>
              <p className="text-2xl font-extrabold text-navy-950">Rp {grandTotal.toLocaleString('id-ID')}</p>
            </div>

            {!isCheckoutReady ? (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-2 border border-red-100">
                ⚠️ Kamu harus pesan minimal Rp {totalMinSpend.toLocaleString('id-ID')} untuk membuka durasi nugas (2 Jam).
              </div>
            ) : (
              <button onClick={handleOpenPayment} className="w-full bg-accent text-navy-950 font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/20 active:scale-95">
                Lanjut Pembayaran
              </button>
            )}
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 2: PAYMENT GATEWAY (MIDTRANS/XENDIT STYLE)
          ======================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-navy-950/70 backdrop-blur-md p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl animate-slide-up relative flex flex-col max-h-[90vh]">
            
            <button onClick={() => setIsPaymentModalOpen(false)} disabled={isProcessingPayment} className="absolute top-6 right-6 w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <h2 className="text-xl font-bold text-navy-950 mb-1">Pilih Pembayaran</h2>
            <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
              Total Tagihan: <span className="font-bold text-accent text-lg">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </p>

            {/* List Metode Pembayaran */}
            <div className="overflow-y-auto pr-2 pb-4 space-y-3 flex-1 hide-scrollbar">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  onClick={() => !isProcessingPayment && setSelectedPayment(method.id)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${selectedPayment === method.id ? 'border-accent bg-accent/5' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-bold text-navy-950 text-sm">{method.name}</p>
                        <p className="text-xs text-slate-500">{method.desc}</p>
                      </div>
                    </div>
                    {/* Radio Button Custom */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-accent' : 'border-slate-300'}`}>
                      {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                    </div>
                  </div>

                  {/* Tombol Bayar Muncul Jika Dipilih */}
                  {selectedPayment === method.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
                      <button 
                        onClick={(e) => { e.stopPropagation(); processPayment(); }}
                        disabled={isProcessingPayment}
                        className="w-full bg-navy-950 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-navy-900 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                      >
                        {isProcessingPayment ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Memproses Pembayaran...
                          </>
                        ) : (
                          `Bayar dengan ${method.name}`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 mt-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <p className="text-xs text-slate-500 font-medium">Pembayaran dijamin aman & terenkripsi</p>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 3: SUKSES CHECKOUT
          ======================================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white p-4 animate-fade-in">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 mb-4">Pembayaran Sukses!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Meja {tableType} Pax di <strong>Kopi Kisah Kita</strong> sudah diamankan untuk Anda selama <strong className="text-navy-950">{currentDuration} Jam</strong>. Makanan akan langsung disiapkan saat Anda tiba.
            </p>
            <Link href="/" className="inline-flex items-center justify-center w-full bg-slate-100 text-navy-950 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

      {/* Styles for Animations & Scrollbar */}
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