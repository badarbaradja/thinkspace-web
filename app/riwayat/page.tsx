"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// --- INISIALISASI SUPABASE ---
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function HistoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("aktif"); 
  
  // State data utama
  const [historyData, setHistoryData] = useState<any[]>([]); 
  const [selectedOrder, setSelectedOrder] = useState<any>(null); 
  const [userId, setUserId] = useState<string | null>(null);

  // State Modal Ulasan
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  // State untuk menampung FILE ASLI gambar ulasan (bukan cuma string base64)
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null); 
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
  const reviewFileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Anda harus login untuk melihat riwayat transaksi.");
        router.push("/auth");
        return;
      }
      setUserId(session.user.id);
      
      const savedOrdersRaw = localStorage.getItem('thinkspace_orders');
      if (savedOrdersRaw) {
        setHistoryData(JSON.parse(savedOrdersRaw));
      }
      setIsLoading(false);
    };

    fetchSessionAndData();
  }, [router]);

  const filteredHistory = historyData.filter(item => item.status === activeTab);

  // --- FUNGSI ULASAN ---
  const handleOpenReview = (item: any) => {
    setReviewOrder(item);
    setRating(0); setHoverRating(0); setReviewText(""); 
    setReviewImagePreview(null); setReviewImageFile(null); // Reset juga file aslinya
    setIsReviewModalOpen(true);
  };

  const handleReviewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert("Hanya file gambar yang diperbolehkan.");
      if (file.size > 5 * 1024 * 1024) return alert("Maksimal ukuran gambar adalah 5MB.");
      
      setReviewImageFile(file); // Simpan file aslinya untuk di-upload nanti
      
      // Buat preview instan untuk ditampilkan di layar
      const reader = new FileReader();
      reader.onloadend = () => setReviewImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // FUNGSI BARU: Upload gambar ke Supabase Storage (agar tidak bikin penuh LocalStorage)
  const uploadReviewImageToSupabase = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    
    // Bikin nama file unik: IDUser-WaktuSekarang.jpg
    const fileExt = file.name.split('.').pop();
    const fileName = `review-${userId}-${Date.now()}.${fileExt}`; 

    // Kita simpan di bucket 'avatars' yang sudah open access sebelumnya (bisa juga bikin bucket khusus 'reviews' nanti)
    const { error: uploadError } = await supabase.storage
      .from('avatars') 
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.error("Gagal unggah gambar ulasan:", uploadError);
      return null;
    }

    // Ambil URL public dari gambar yang barusan diunggah
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Silakan berikan rating bintang terlebih dahulu.");
    setIsSubmittingReview(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userName = session?.user?.user_metadata?.full_name || "Pengguna ThinkSpace";

      let finalImageUrl = null;

      // JIKA ADA GAMBAR: Upload dulu ke Supabase sebelum simpan ulasan
      if (reviewImageFile) {
        const uploadedUrl = await uploadReviewImageToSupabase(reviewImageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          setIsSubmittingReview(false);
          alert("Gagal mengunggah foto ulasan. Silakan coba tanpa foto.");
          return; // Hentikan jika gagal upload foto
        }
      }

      // Bikin objek review baru
      const newReview = {
        id: `rev-${Date.now()}`,
        cafeName: reviewOrder.cafe, 
        name: userName,
        rating: rating,
        date: "Baru saja",
        text: reviewText,
        image: finalImageUrl // Menyimpan URL singkat, BUKAN teks panjang base64!
      };
      
      // Simpan ke LocalStorage (Aman, karena sekarang ukurannya sangat kecil)
      const existingReviews = JSON.parse(localStorage.getItem('thinkspace_reviews') || '[]');
      localStorage.setItem('thinkspace_reviews', JSON.stringify([newReview, ...existingReviews]));

      // Update UI dan Riwayat Pesanan
      setHistoryData(prevData => prevData.map(item => item.id === reviewOrder.id ? { ...item, isReviewed: true } : item));
      const savedOrders = JSON.parse(localStorage.getItem('thinkspace_orders') || '[]');
      const updatedSavedOrders = savedOrders.map((item: any) => item.id === reviewOrder.id ? { ...item, isReviewed: true } : item);
      localStorage.setItem('thinkspace_orders', JSON.stringify(updatedSavedOrders));
      
      setIsSubmittingReview(false);
      setIsReviewModalOpen(false);
      alert(`Terima kasih! Ulasan Anda untuk ${reviewOrder.cafe} berhasil ditambahkan.`);

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem. Gagal mengirim ulasan.");
      setIsSubmittingReview(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    const isConfirmed = confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
    if (!isConfirmed) return;

    setHistoryData(prevData => prevData.map(item => item.id === orderId ? { ...item, status: 'dibatalkan' } : item));
    
    const savedOrders = JSON.parse(localStorage.getItem('thinkspace_orders') || '[]');
    const updatedSavedOrders = savedOrders.map((item: any) => item.id === orderId ? { ...item, status: 'dibatalkan' } : item);
    localStorage.setItem('thinkspace_orders', JSON.stringify(updatedSavedOrders));
    
    alert("Pesanan berhasil dibatalkan.");
    setActiveTab("dibatalkan"); 
  };

  const simulateCompleteOrder = (orderId: string) => {
    const isConfirmed = confirm("Fitur Khusus Demo: Mensimulasikan transaksi ini telah 'Selesai' (Anda sudah pulang dari kafe)?");
    if (!isConfirmed) return;

    setHistoryData(prevData => prevData.map(item => item.id === orderId ? { ...item, status: 'selesai' } : item));
    
    const savedOrders = JSON.parse(localStorage.getItem('thinkspace_orders') || '[]');
    const updatedSavedOrders = savedOrders.map((item: any) => item.id === orderId ? { ...item, status: 'selesai' } : item);
    localStorage.setItem('thinkspace_orders', JSON.stringify(updatedSavedOrders));
    
    setActiveTab("selesai");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-accent">Home</Link><span>/</span>
          <span className="text-navy-950">Riwayat</span>
        </div>

        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up min-h-[60vh]">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-navy-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <h1 className="text-3xl font-extrabold relative z-10 flex items-center gap-3">
              <span className="text-accent">🧾</span> Riwayat Transaksi
            </h1>
            <p className="text-slate-300 mt-2 relative z-10 text-sm">
              Pantau status reservasi meja, pesanan aktif, dan riwayat nugas Anda sebelumnya.
            </p>
          </div>

          <div className="flex px-4 sm:px-8 pt-4 border-b border-slate-100 gap-6 overflow-x-auto hide-scrollbar">
            {[
              { id: "aktif", label: "Sedang Berjalan" },
              { id: "selesai", label: "Selesai" },
              { id: "dibatalkan", label: "Dibatalkan" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id ? "border-navy-950 text-navy-950" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-8 space-y-4 bg-slate-50/30 min-h-[400px]">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <div className="text-5xl mb-4 opacity-50 grayscale">📭</div>
                <h3 className="text-lg font-bold text-navy-950 mb-1">Belum ada transaksi</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Riwayat pesanan Anda untuk status ini masih kosong. Yuk, mulai cari spot nugas terbaikmu!</p>
                <Link href="/fitur" className="inline-block bg-accent text-navy-950 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors text-sm shadow-md">
                  Cari Kafe Sekarang
                </Link>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-2xl p-4 sm:p-5 hover:border-accent/40 hover:shadow-md transition-all bg-white group">
                  
                  <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Kedatangan: <span className="text-navy-950">{item.date}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                      item.status === 'aktif' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      item.status === 'selesai' ? 'bg-green-50 text-green-600 border-green-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.image} alt={item.cafe} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-extrabold text-navy-950 text-base sm:text-lg leading-tight mb-1">{item.cafe}</h3>
                        {item.status === 'aktif' && (
                          <button onClick={() => simulateCompleteOrder(item.id)} className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded hover:bg-green-100 hover:text-green-600 transition-colors" title="Simulasi Selesai (Demo)">Akhiri</button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-1 line-clamp-2">{item.items}</p>
                      <p className="text-[10px] font-semibold text-slate-400">Durasi Nugas: <span className="text-navy-950">{item.duration}</span></p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Belanja</p>
                      <p className="font-extrabold text-navy-950 text-lg">Rp {item.total.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.status === 'aktif' && (
                        <>
                          <button onClick={() => setSelectedOrder(item)} className="flex-1 sm:flex-none border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-50 transition-colors">Detail</button>
                          <button onClick={() => handleCancelOrder(item.id)} className="flex-1 sm:flex-none border border-red-200 text-red-500 font-bold px-4 py-2 rounded-lg text-xs hover:bg-red-50 transition-colors">Batalkan</button>
                          <button onClick={() => simulateCompleteOrder(item.id)} className="w-full sm:w-auto bg-accent text-navy-950 font-bold px-5 py-2 rounded-lg text-xs hover:bg-yellow-400 transition-colors shadow-sm" title="Simulasi Kedatangan">Tandai Selesai (Demo)</button>
                        </>
                      )}
                      
                      {item.status === 'selesai' && (
                        <>
                          <button onClick={() => setSelectedOrder(item)} className="flex-1 sm:flex-none border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-50 transition-colors">Detail</button>
                          {!item.isReviewed ? (
                            <button onClick={() => handleOpenReview(item)} className="flex-1 sm:flex-none bg-accent text-navy-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-yellow-400 transition-colors text-center shadow-sm">Beri Ulasan</button>
                          ) : (
                            <button disabled className="flex-1 sm:flex-none bg-green-50 text-green-600 border border-green-200 font-bold px-4 py-2 rounded-lg text-xs cursor-not-allowed text-center">Ulasan Terkirim ✓</button>
                          )}
                          <Link href={`/cafe/${encodeURIComponent(item.cafe)}`} className="w-full sm:w-auto bg-navy-950 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-navy-900 transition-colors text-center">Pesan Lagi</Link>
                        </>
                      )}
                      
                      {item.status === 'dibatalkan' && (
                        <Link href={`/cafe/${encodeURIComponent(item.cafe)}`} className="w-full sm:w-auto bg-navy-950 text-white font-bold px-5 py-2 rounded-lg text-xs hover:bg-navy-900 transition-colors text-center">Pesan Ulang Tempat Ini</Link>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-4xl p-6 sm:p-8 shadow-2xl relative animate-slide-up">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">✖</button>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-950 mb-1">Detail Pesanan</h2>
            <p className="text-sm text-slate-500 mb-2">{selectedOrder.cafe}</p>
            <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-600 mb-5">{selectedOrder.id}</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 max-h-48 overflow-y-auto hide-scrollbar">
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Rincian Item</p>
              {selectedOrder.orderList?.map((ol: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm mb-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-navy-950 pr-2 w-2/3 truncate">{ol.qty}x {ol.name}</span>
                  <span className="font-bold shrink-0 text-slate-600">
                    {ol.price === 0 ? <span className="text-green-600">GRATIS</span> : `Rp ${(ol.price * ol.qty).toLocaleString('id-ID')}`}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-6 text-xs sm:text-sm px-1">
              <div className="flex justify-between"><p className="text-slate-500">Biaya Layanan Reservasi</p><p className="font-bold">Rp {selectedOrder.fees?.reservasi.toLocaleString('id-ID')}</p></div>
              <div className="flex justify-between"><p className="text-slate-500">Biaya Layanan F&B</p><p className="font-bold">Rp {selectedOrder.fees?.fnb.toLocaleString('id-ID')}</p></div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-2 flex justify-between items-center text-xl sm:text-2xl font-extrabold text-navy-950">
              <span className="text-base sm:text-lg text-slate-500 font-medium">Total</span>
              <span>Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BERI ULASAN */}
      {isReviewModalOpen && reviewOrder && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4 sm:p-0 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-4xl p-6 sm:p-8 shadow-2xl relative animate-slide-up flex flex-col max-h-[90vh]">
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">✖</button>
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 mb-1">Gimana Nugasnya?</h2>
              <p className="text-sm text-slate-500">Bantu <span className="font-bold text-navy-950">{reviewOrder.cafe}</span> jadi lebih baik dengan ulasanmu.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="overflow-y-auto hide-scrollbar px-1 pb-4 flex-1">
              
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition-transform hover:scale-110 active:scale-95">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill={(hoverRating || rating) >= star ? "#FACC15" : "none"} stroke={(hoverRating || rating) >= star ? "#FACC15" : "#CBD5E1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ceritain Pengalamanmu (Opsional)</label>
                <textarea rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tempatnya asik banget buat nugas, wifi kenceng..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white resize-none transition-all" />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tambah Foto (Opsional)</label>
                {!reviewImagePreview ? (
                  <button type="button" onClick={() => reviewFileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span className="text-xs font-bold">Upload Foto Kafe/Makanan</span>
                  </button>
                ) : (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                    <img src={reviewImagePreview} alt="Review preview" className="w-full h-full object-cover" />
                    {isSubmittingReview && (
                      <div className="absolute inset-0 bg-navy-950/50 flex items-center justify-center">
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <button type="button" onClick={() => { setReviewImagePreview(null); setReviewImageFile(null); if(reviewFileInputRef.current) reviewFileInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-navy-950/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-colors">✖</button>
                  </div>
                )}
                <input type="file" ref={reviewFileInputRef} onChange={handleReviewImageSelect} accept="image/*" className="hidden" />
              </div>

              <button type="submit" disabled={rating === 0 || isSubmittingReview} className="w-full bg-navy-950 text-white font-bold py-4 rounded-xl text-base hover:bg-navy-900 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2">
                {isSubmittingReview ? "Mengunggah Ulasan..." : "Kirim Ulasan"}
              </button>

            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}