export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rina Kusuma",
    role: "Freelance Designer",
    quote: "ThinkSpace bantu saya nemuin cafe dengan WiFi kencang dan suasana tenang. Produktivitas naik drastis sejak pake ThinkSpace!",
    avatar: "/avatars/avatar-1.webp",
  },
  {
    id: "2",
    name: "Budi Santoso",
    role: "Startup Founder",
    quote: "Sebagai founder, saya sering butuh tempat meeting dadakan. ThinkSpace bikin saya nggak perlu ribet cari tempat lagi.",
    avatar: "/avatars/avatar-2.webp",
  },
  {
    id: "3",
    name: "Anisa Rahma",
    role: "Content Creator",
    quote: "Setiap cafe di ThinkSpace punya info lengkap, dari WiFi speed sampai stop kontak. Sangat membantu workflow saya.",
    avatar: "/avatars/avatar-3.webp",
  },
  {
    id: "4",
    name: "Dimas Prasetyo",
    role: "Remote Developer",
    quote: "Kerja remote jadi lebih enjoy. ThinkSpace kasih rekomendasi cafe yang pas buat coding seharian. Love it!",
    avatar: "/avatars/avatar-4.webp",
  },
];
