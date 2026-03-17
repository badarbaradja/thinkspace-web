"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Cropper from "react-easy-crop";

// --- INISIALISASI SUPABASE ---
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- HELPER FUNCTION UNTUK CROP GAMBAR ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) { resolve(null); return; }
      const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("mahasiswa"); 
  const [educationLevel, setEducationLevel] = useState("kuliah"); 
  const [institution, setInstitution] = useState(""); 
  const [identityNumber, setIdentityNumber] = useState(""); 
  
  // Photo States
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Photo Modal (Crop) States
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);
  const [confirmedPhotoFile, setConfirmedPhotoFile] = useState<File | null>(null);
  
  // Crop States
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        alert("Anda harus login untuk mengakses halaman profil.");
        router.push("/auth");
        return;
      }

      const user = session.user;
      setUserId(user.id);
      
      const metadata = user.user_metadata;
      setUserEmail(user.email || "");
      setFullName(metadata.full_name || "");
      setPhone(metadata.phone || "");
      setAvatarUrl(metadata.avatar_url || null);
      setAvatarPreview(metadata.avatar_url || null);
      setOccupation(metadata.occupation || "mahasiswa");
      setEducationLevel(metadata.education_level || "kuliah");
      setInstitution(metadata.institution || "");
      setIdentityNumber(metadata.identity_number || "");
      
      setIsLoading(false);
    };

    fetchProfile();
  }, [router]);

  const triggerFileSelect = () => { fileInputRef.current?.click(); };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert("Hanya file gambar yang diperbolehkan.");
      if (file.size > 5 * 1024 * 1024) return alert("Ukuran file maksimal adalah 5MB."); // Dinaikkan ke 5MB agar aman saat crop

      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingPhotoPreview(reader.result as string);
        setZoom(1); setCrop({ x: 0, y: 0 }); // Reset crop
        setShowPhotoModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (pendingPhotoPreview && croppedAreaPixels) {
      const croppedFile = await getCroppedImg(pendingPhotoPreview, croppedAreaPixels);
      if (croppedFile) {
        setAvatarPreview(URL.createObjectURL(croppedFile)); // Tampilkan hasil crop di UI profil
        setConfirmedPhotoFile(croppedFile); // Simpan file crop untuk diupload ke DB
        setShowPhotoModal(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelPhoto = () => {
    setPendingPhotoPreview(null);
    setShowPhotoModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadAvatarToStorage = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      alert("❌ Gagal mengunggah foto ke server: " + uploadError.message);
      return null;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let finalAvatarUrl = avatarUrl;

    if (confirmedPhotoFile) {
      const uploadedUrl = await uploadAvatarToStorage(confirmedPhotoFile);
      if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      else { setIsSaving(false); return; }
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone,
        avatar_url: finalAvatarUrl, 
        occupation: occupation,
        education_level: educationLevel,
        institution: institution,
        identity_number: identityNumber
      }
    });

    setIsSaving(false);

    if (error) {
      alert("❌ Gagal menyimpan profil: " + error.message);
    } else {
      alert("✅ Data Profil dan Foto berhasil disimpan!");
      setAvatarUrl(finalAvatarUrl);
      setConfirmedPhotoFile(null);
      window.location.reload();
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-accent">Home</Link><span>/</span>
          <span className="text-navy-950">Profil Saya</span>
        </div>

        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-navy-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <h1 className="text-3xl font-extrabold relative z-10">Profil Saya</h1>
            <p className="text-slate-300 mt-2 relative z-10 text-sm sm:text-base max-w-lg">
              Lengkapi data diri Anda untuk membuka fitur eksklusif dan klaim voucher diskon nugas sesuai dengan status Anda!
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="p-6 sm:p-10 space-y-8">
            
            {/* FOTO PROFIL */}
            <div className="flex flex-col items-center border-b border-slate-100 pb-8">
              <h2 className="text-lg font-bold text-navy-950 mb-6 self-start flex items-center gap-2">
                <span className="text-accent"></span> Foto Profil
              </h2>
              
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-inner overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl text-slate-300"></div>
                  )}
                </div>
                
                <button type="button" onClick={triggerFileSelect} className="absolute bottom-0 right-0 w-10 h-10 bg-accent text-navy-950 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-yellow-400 active:scale-95 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </button>
              </div>
              
              <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
              
              {confirmedPhotoFile && (
                <div className="mt-4 bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-200">
                  ⚠️ Foto belum disimpan. Klik "Simpan Perubahan" di bawah.
                </div>
              )}
            </div>

            {/* DATA UTAMA */}
            <div>
              <h2 className="text-lg font-bold text-navy-950 mb-4 flex items-center gap-2"><span className="text-accent">👤</span> Data Utama</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" disabled value={userEmail} className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor WhatsApp / HP</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent focus:bg-white" />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* STATUS & PEKERJAAN */}
            <div>
              <h2 className="text-lg font-bold text-navy-950 mb-4 flex items-center gap-2"><span className="text-accent"></span> Status / Pekerjaan Saat Ini</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button type="button" onClick={() => setOccupation("mahasiswa")} className={`p-4 rounded-2xl border-2 text-center transition-all ${occupation === "mahasiswa" ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="text-3xl mb-2">🎓</div>
                  <div className={`font-bold text-sm ${occupation === "mahasiswa" ? 'text-navy-950' : 'text-slate-600'}`}>Pelajar / Mahasiswa</div>
                </button>
                <button type="button" onClick={() => setOccupation("pekerja")} className={`p-4 rounded-2xl border-2 text-center transition-all ${occupation === "pekerja" ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="text-3xl mb-2">🏢</div>
                  <div className={`font-bold text-sm ${occupation === "pekerja" ? 'text-navy-950' : 'text-slate-600'}`}>Pekerja Instansi</div>
                </button>
                <button type="button" onClick={() => setOccupation("freelance")} className={`p-4 rounded-2xl border-2 text-center transition-all ${occupation === "freelance" ? 'border-accent bg-accent/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="text-3xl mb-2">💻</div>
                  <div className={`font-bold text-sm ${occupation === "freelance" ? 'text-navy-950' : 'text-slate-600'}`}>Mandiri / Freelance</div>
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                {occupation === "mahasiswa" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenjang Pendidikan</label>
                      <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent">
                        <option value="smp">SMP / Sederajat</option>
                        <option value="sma">SMA / SMK / Sederajat</option>
                        <option value="kuliah">Perguruan Tinggi (D3/S1/S2)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama {educationLevel === "kuliah" ? "Universitas / Kampus" : "Sekolah"}</label>
                      <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder={educationLevel === "kuliah" ? "Contoh: Telkom University" : "Contoh: SMAN 3 Bandung"} className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Induk ({educationLevel === "kuliah" ? "NIM" : "NIS / NISN"})</label>
                      <input type="text" value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} placeholder="Masukkan Nomor Induk Anda" className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent" />
                    </div>
                  </>
                )}
                {occupation === "pekerja" && (
                  <>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Perusahaan / Instansi</label><input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Contoh: PT. Telekomunikasi Indonesia" className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ID Karyawan (Opsional)</label><input type="text" value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} placeholder="Masukkan NIK/ID Karyawan" className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent" /></div>
                  </>
                )}
                {occupation === "freelance" && (
                  <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bidang Pekerjaan Utama</label><input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Contoh: UI/UX Designer, Content Creator" className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium text-navy-950 outline-none focus:border-accent" /></div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button type="submit" disabled={isSaving || !fullName} className="w-full bg-navy-950 text-white font-bold py-4 rounded-xl text-lg hover:bg-navy-900 shadow-xl shadow-navy-950/20 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                {isSaving ? "Menyimpan Data..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL CROP GAMBAR */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
            <h2 className="text-xl font-bold text-navy-950 mb-2">Sesuaikan Foto Profil</h2>
            <p className="text-sm text-slate-500 mb-6">Geser dan perbesar untuk mengatur posisi wajah Anda.</p>
            
            {/* Area Cropper (Zoom & Pan) */}
            <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden mb-4">
              {pendingPhotoPreview && (
                <Cropper
                  image={pendingPhotoPreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} 
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>

            {/* Slider Zoom */}
            <div className="mb-6 px-4">
              <input 
                type="range" 
                value={zoom} 
                min={1} 
                max={3} 
                step={0.1} 
                onChange={(e) => setZoom(Number(e.target.value))} 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent" 
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleCancelPhoto} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={handleConfirmCrop} className="flex-1 px-4 py-3 rounded-xl bg-navy-950 text-white font-bold hover:bg-navy-900 shadow-lg transition-colors">Gunakan Foto</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}} />
    </div>
  );
}