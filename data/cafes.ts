export interface Cafe {
  id: string;
  name: string;
  location: string;
  area: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  image: string;
  tags: string[];
  description: string;
  facilities: string[];
  openHours: string;
  lat?: number;
  lng?: number;
  distance?: number; // Tambahan opsional untuk kalkulasi jarak terdekat
}

// =======================================
// CAFE NYATA (DIPISAH BERDASARKAN REGIONAL)
// =======================================
const bandungCafes = [
  "Sejiwa Coffee", "Two Hands Full", "Kopi Toko Djawa", "Dago Bakery",
  "Armor Kopi", "Wheels Coffee Roasters", "Jabarano Coffee", "Kinokimi Coffee",
  "Massuka Coffee", "Yuma Coffee", "Kopi Calf", "Marka Coffee",
  "Little Contrast", "Kopi Anjis", "Groei Coffee & Space", "Plumeria"
];

const jakartaCafes = [
  "Tanamera Coffee", "Titik Temu Coffee", "Filosofi Kopi", "Anomali Coffee",
  "1/15 Coffee", "First Crack Coffee", "Gordi HQ", "Ombe Kofie",
  "Dua Coffee", "Chief Coffee", "Stuja Coffee", "Kopi Kalyan",
  "Harlan + Holden", "Kopi Manyar", "Tujuhari Coffee", "Common Grounds"
];

// =======================================
// AREA DISTRIBUTION
// =======================================
const bandungAreas = [
  { area: "Dago", city: "Bandung", lat: -6.889, lng: 107.612 },
  { area: "Dipatiukur", city: "Bandung", lat: -6.899, lng: 107.615 },
  { area: "Buah Batu", city: "Bandung", lat: -6.936, lng: 107.623 },
  { area: "Braga", city: "Bandung", lat: -6.921, lng: 107.609 },
  { area: "Setiabudi", city: "Bandung", lat: -6.865, lng: 107.597 },
  { area: "Bojongsoang", city: "Bandung", lat: -6.973, lng: 107.630 },
  { area: "Cihampelas", city: "Bandung", lat: -6.893, lng: 107.604 },
];

const jakartaAreas = [
  { area: "Kemang", city: "Jakarta Selatan", lat: -6.261, lng: 106.814 },
  { area: "Senopati", city: "Jakarta Selatan", lat: -6.228, lng: 106.809 },
  { area: "Cipete", city: "Jakarta Selatan", lat: -6.277, lng: 106.804 },
  { area: "Kuningan", city: "Jakarta Selatan", lat: -6.229, lng: 106.828 },
  { area: "Menteng", city: "Jakarta Pusat", lat: -6.196, lng: 106.839 },
  { area: "Kelapa Gading", city: "Jakarta Utara", lat: -6.158, lng: 106.904 },
  { area: "Grogol", city: "Jakarta Barat", lat: -6.164, lng: 106.790 },
  { area: "Depok Margonda", city: "Depok", lat: -6.390, lng: 106.830 },
  { area: "BSD", city: "Tangerang Selatan", lat: -6.302, lng: 106.652 },
];

// =======================================
// UTILITIES UNTUK RANDOMISASI
// =======================================
const allFacilities = ["WiFi", "Stop Kontak", "Meeting Room", "Parkir", "AC", "Mushola", "Outdoor", "Pet Friendly"];
const allTags = ["WiFi Cepat", "Work Friendly", "Quiet Zone", "Instagramable", "Spacious", "Cozy", "Affordable", "Premium"];

function randomCoord(base: number, spread: number) {
  return base + (Math.random() - 0.5) * spread;
}

function getRandomElements(arr: string[], min: number, max: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (max - min + 1)) + min);
}

// =======================================
// GENERATE 200 CAFE REALISTIS
// =======================================
export const cafes: Cafe[] = [];
let idCounter = 1;

// Generate 100 Kafe Bandung
for (let i = 0; i < 100; i++) {
  const name = bandungCafes[i % bandungCafes.length] + (i >= bandungCafes.length ? ` Cabang ${i}` : "");
  const area = bandungAreas[i % bandungAreas.length];
  cafes.push({
    id: String(idCounter++),
    name: name,
    location: `${area.area}, ${area.city}`,
    area: area.area,
    rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
    reviewCount: Math.floor(50 + Math.random() * 1500),
    priceRange: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
    image: `/cafes/cafe-${(i % 23) + 1}.webp`, // Menggunakan 23 gambar yang sudah ada
    tags: getRandomElements(allTags, 2, 4),
    description: "Coffee shop populer dengan suasana nyaman untuk work from cafe, meeting kecil, atau nugas dengan WiFi stabil.",
    facilities: getRandomElements(allFacilities, 3, 7), // Fasilitas diacak agar filter berguna
    openHours: "08:00 - 22:00",
    lat: randomCoord(area.lat, 0.03),
    lng: randomCoord(area.lng, 0.03)
  });
}

// Generate 100 Kafe Jakarta/Jabodetabek
for (let i = 0; i < 100; i++) {
  const name = jakartaCafes[i % jakartaCafes.length] + (i >= jakartaCafes.length ? ` Cabang ${i}` : "");
  const area = jakartaAreas[i % jakartaAreas.length];
  cafes.push({
    id: String(idCounter++),
    name: name,
    location: `${area.area}, ${area.city}`,
    area: area.area,
    rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
    reviewCount: Math.floor(50 + Math.random() * 1500),
    priceRange: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
    image: `/cafes/cafe-${(i % 23) + 1}.webp`,
    tags: getRandomElements(allTags, 2, 4),
    description: "Ruang kerja komunal di jantung kota. Menyediakan kopi specialty dan area yang kondusif.",
    facilities: getRandomElements(allFacilities, 3, 7),
    openHours: "07:00 - 23:00",
    lat: randomCoord(area.lat, 0.04),
    lng: randomCoord(area.lng, 0.04)
  });
}