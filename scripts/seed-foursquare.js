const { createClient } = require('@supabase/supabase-js');

// KONEKSI SUPABASE
const SUPABASE_URL = 'https://yxnpequkgdvzyuhugasa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnBlcXVrZ2R2enl1aHVnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Mzc5NDQsImV4cCI6MjA4ODUxMzk0NH0.6wUroW8ysDYd9pOMysQ-BkmdK9RoiuRC0xjPRdU5vzg';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// KUNCI V2 OAUTH FOURSQUARE
const FOURSQUARE_CLIENT_ID = 'ZHDVFPH0LEAXFDHSQIHDGX3TCLBDXN0ASN1KVK4V0YBCME43';
const FOURSQUARE_CLIENT_SECRET = 'LULPZLNXNNDH4VFFF5OY3LSPIBKQZS2VT10JWMERYY3Q4BEC';

// Category ID Foursquare khusus Coffee Shop & Cafe
// 4bf58dd8d48988d1e0931735 = Coffee Shop
// 4bf58dd8d48988d16d941735 = Café
const CAFE_CATEGORY_IDS = '4bf58dd8d48988d1e0931735,4bf58dd8d48988d16d941735';

// Keyword yang lebih spesifik untuk study cafe
const STUDY_KEYWORDS = ['coffee', 'kopi', 'cafe', 'study cafe'];

// Helper: delay agar tidak kena rate limit free tier
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Validasi apakah venue ini benar-benar cafe/coffee shop (bukan restoran)
function isTrueCafe(venue) {
  const categories = venue.categories || [];
  if (categories.length === 0) return false;

  const cafeRelatedIds = [
    '4bf58dd8d48988d1e0931735', // Coffee Shop
    '4bf58dd8d48988d16d941735', // Café
    '5665c7b9498e7d8a4f2c0f06', // College Cafeteria (bonus)
  ];

  const cafeKeywords = ['coffee', 'cafe', 'kopi', 'espresso', 'brew', 'roast'];

  // Cek berdasarkan category ID
  const hasCafeCategory = categories.some(c => cafeRelatedIds.includes(c.id));
  if (hasCafeCategory) return true;

  // Cek berdasarkan nama kategori
  const hasCafeKeywordInCategory = categories.some(c =>
    cafeKeywords.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (hasCafeKeywordInCategory) return true;

  // Cek berdasarkan nama venue itu sendiri
  const nameLower = venue.name.toLowerCase();
  const hasCafeKeywordInName = cafeKeywords.some(kw => nameLower.includes(kw));
  return hasCafeKeywordInName;
}

async function fetchByKeyword(keyword, latitude, longitude, today) {
  const url = `https://api.foursquare.com/v2/venues/explore` +
    `?ll=${latitude},${longitude}` +
    `&query=${encodeURIComponent(keyword)}` +
    `&categoryId=${CAFE_CATEGORY_IDS}` +  // ← Filter utama: hanya coffee shop & cafe
    `&radius=15000` +
    `&limit=50` +
    `&venuePhotos=1` +
    `&client_id=${FOURSQUARE_CLIENT_ID}` +
    `&client_secret=${FOURSQUARE_CLIENT_SECRET}` +
    `&v=${today}`;

  try {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await response.json();

    if (!data.response?.groups?.length) return [];
    return data.response.groups[0].items || [];
  } catch (err) {
    console.warn(`⚠️ Gagal fetch keyword "${keyword}":`, err.message);
    return [];
  }
}

async function fetchAndSeedCafes() {
  console.log("🚀 Memulai scraping CAFE khusus WFA/belajar dari Foursquare...");
  console.log("🔍 Menggunakan category filter: Coffee Shop & Café\n");

  try {
    const latitude = -6.9175;
    const longitude = 107.6191;
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Kumpulkan venue dari berbagai keyword, deduplikasi pakai Map (key = venue ID)
    const venueMap = new Map();

    for (const keyword of STUDY_KEYWORDS) {
      console.log(`🔎 Fetching dengan keyword: "${keyword}"...`);
      const items = await fetchByKeyword(keyword, latitude, longitude, today);
      
      let addedCount = 0;
      for (const item of items) {
        const venue = item.venue;
        if (!venueMap.has(venue.id) && isTrueCafe(venue)) {
          venueMap.set(venue.id, item);
          addedCount++;
        }
      }
      console.log(`   ✅ +${addedCount} cafe unik (total: ${venueMap.size})`);
      
      // Delay 500ms antar request agar aman di free tier
      await delay(500);
    }

    const allItems = Array.from(venueMap.values());
    console.log(`\n✅ Total cafe terfilter: ${allItems.length} (hanya coffee shop & cafe asli)`);

    if (allItems.length === 0) {
      console.error("❌ Tidak ada data cafe yang berhasil diambil.");
      return;
    }

    // Format data
    const formattedCafes = allItems.map((item) => {
      const place = item.venue;

      // 1. Foto asli dari Foursquare
      let realImageUrl = "";
      if (place.photos?.groups?.length > 0) {
        const photoItems = place.photos.groups[0].items;
        if (photoItems?.length > 0) {
          const photo = photoItems[0];
          realImageUrl = `${photo.prefix}800x800${photo.suffix}`;
        }
      }
      // Fallback foto cafe jika tidak ada
      if (!realImageUrl) {
        realImageUrl = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop";
      }

      // 2. Rating (Foursquare skala 10 → konversi ke 5)
      const finalRating = place.rating
        ? parseFloat((place.rating / 2).toFixed(1))
        : parseFloat((4.0 + Math.random() * 0.9).toFixed(1));
      const finalReviewCount = place.ratingSignals || Math.floor(100 + Math.random() * 900);

      // 3. Harga
      let finalPrice = "$$";
      if (place.price?.tier) {
        finalPrice = "$".repeat(place.price.tier);
      }

      const location = place.location || {};
      const categories = place.categories || [];

      // Tags dari kategori Foursquare — pastikan relevan
      const rawTags = categories.map(c => c.name).slice(0, 3);
      const tags = rawTags.length > 0 ? rawTags : ["Coffee Shop", "Cafe", "WiFi"];

      // Fasilitas default untuk study cafe
      const facilities = ["WiFi", "Stop Kontak", "Cozy"];
      if (finalPrice.length <= 2) facilities.push("AC"); // Cafe budget biasanya AC
      if (location.city) facilities.push("Parkir");

      return {
        name: place.name,
        location: location.formattedAddress
          ? location.formattedAddress.join(', ')
          : 'Kota Bandung',
        area: location.neighborhood || location.city || 'Bandung',
        rating: finalRating,
        review_count: finalReviewCount,
        price_range: finalPrice,
        image: realImageUrl,
        tags: tags,
        description: `Cafe di ${location.neighborhood || location.city || 'Bandung'}. Cocok untuk WFA, ngerjain tugas, atau meeting santai.`,
        facilities: facilities,
        open_hours: "08:00 - 22:00",
        lat: location.lat || latitude,
        lng: location.lng || longitude,
      };
    });

    // Preview 3 data pertama
    console.log("\n📋 Preview 3 cafe pertama:");
    formattedCafes.slice(0, 3).forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} | ${c.area} | Tags: ${c.tags.join(', ')} | Rating: ${c.rating}`);
    });

    // Insert ke Supabase (batch per 20 agar aman di free tier)
    console.log(`\n📝 Memasukkan ${formattedCafes.length} cafe ke Supabase...`);
    console.log("⚠️  Pastikan sudah TRUNCATE tabel 'cafes' via SQL Editor Supabase sebelum ini!\n");

    const BATCH_SIZE = 20;
    let successCount = 0;

    for (let i = 0; i < formattedCafes.length; i += BATCH_SIZE) {
      const batch = formattedCafes.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('cafes').insert(batch);

      if (error) {
        console.error(`❌ Gagal insert batch ${i / BATCH_SIZE + 1}:`, error.message);
      } else {
        successCount += batch.length;
        console.log(`   ✅ Batch ${i / BATCH_SIZE + 1}: ${batch.length} cafe berhasil (total: ${successCount})`);
      }
      await delay(300);
    }

    console.log(`\n🎉 SELESAI! ${successCount} cafe WFA/belajar berhasil masuk ke Supabase!`);

  } catch (err) {
    console.error("❌ Error fatal:", err);
  }
}

fetchAndSeedCafes();