"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const method = searchParams.get("method");
  const amount = searchParams.get("amount");
  const cafeName = searchParams.get("cafe");

  // Timer 10 Menit (600 Detik)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center animate-fade-in py-10">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-navy-950 mb-2">Pembayaran Sukses!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Kursi Anda di <strong>{cafeName}</strong> telah berhasil diamankan. Silakan tunjukkan pesanan ini ke kasir.
        </p>
        <Link href="/" className="bg-navy-950 text-white font-bold py-4 px-8 rounded-xl hover:bg-navy-900 transition-colors w-full inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Merchant</p>
          <p className="font-bold text-navy-950">{cafeName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Batas Waktu</p>
          <p className="font-mono font-bold text-red-500 text-lg bg-red-50 px-3 py-1 rounded-lg border border-red-100">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 text-center">
        <p className="text-sm text-slate-500 mb-2">Total Pembayaran</p>
        <p className="text-4xl font-extrabold text-navy-950 mb-6">
          Rp {Number(amount).toLocaleString('id-ID')}
        </p>

        {/* LOGIKA TAMPILAN BERDASARKAN METODE */}
        {method === 'qris' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 inline-block">
            <div className="w-48 h-48 bg-slate-100 mb-4 flex justify-center items-center border-2 border-dashed border-slate-300 rounded-xl relative overflow-hidden">
               {/* Dummy QR IS Image */}
               <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM21 21v-2h-4v2h4zM15 15h2v2h-2zM15 19h2v2h-2zM19 15h2v2h-2z"/></svg>
               <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center opacity-80 mix-blend-multiply"></div>
            </div>
            <p className="text-xs text-slate-500 font-bold mb-1">Scan QRIS menggunakan aplikasi:</p>
            <p className="text-[10px] text-slate-400">BCA Mobile, Livin, GoPay, OVO, Dana, ShopeePay</p>
          </div>
        )}

        {(method === 'bca' || method === 'mandiri') && (
          <div className="text-left">
            <p className="text-sm text-slate-500 mb-2">Nomor Virtual Account ({method.toUpperCase()})</p>
            <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl mb-6">
              <span className="font-mono font-bold text-xl tracking-wider text-navy-950">
                {method === 'bca' ? '8077 7081 2345 6789' : '8902 2081 2345 6789'}
              </span>
              <button className="text-accent text-sm font-bold bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent hover:text-navy-950 transition-colors">Salin</button>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm">
              <p className="font-bold text-navy-950 mb-3">Cara Pembayaran:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Buka aplikasi Mobile Banking Anda.</li>
                <li>Pilih menu Transfer &gt; Virtual Account.</li>
                <li>Masukkan nomor VA di atas.</li>
                <li>Pastikan nama merchant adalah <strong className="text-navy-950">ThinkSpace</strong>.</li>
                <li>Masukkan PIN dan selesaikan pembayaran.</li>
              </ol>
            </div>
          </div>
        )}

        {method === 'gopay' && (
          <div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl shadow-lg shadow-green-500/30">🟢</div>
            <p className="text-sm text-slate-600 mb-6">Klik tombol di bawah ini untuk membuka aplikasi Gojek dan menyelesaikan pembayaran.</p>
            <button className="w-full bg-[#00AED6] text-white font-bold py-4 rounded-xl shadow-md">Buka Aplikasi Gojek</button>
          </div>
        )}
      </div>

      <button onClick={handleSimulatePayment} className="w-full text-center text-sm font-bold text-slate-400 hover:text-accent underline underline-offset-4 mt-6">
        [Klik di sini untuk simulasi "Pembayaran Berhasil"]
      </button>
    </div>
  );
}

export default function PaymentGateway() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Header Midtrans/Payment Gateway */}
        <div className="absolute top-0 left-0 right-0 bg-navy-950 h-3" />
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-navy-950"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
          </div>
          <span className="font-bold text-navy-950 tracking-tight">ThinkSpace Pay</span>
        </div>

        {/* Suspense Wrapper untuk useSearchParams Next.js */}
        <Suspense fallback={<div className="text-center py-20 text-slate-400 font-bold animate-pulse">Memuat Payment Gateway...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}