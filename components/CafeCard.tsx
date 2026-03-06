import Image from "next/image";
import Link from "next/link";
import { Cafe } from "@/data/cafes";

// Mapping Dolar ke Bahasa Indonesia
const priceLabelMap: Record<string, string> = {
  "$": "Hemat",
  "$$": "Standar",
  "$$$": "Premium"
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={
            star <= Math.round(rating) ? "text-accent" : "text-slate-300"
          }
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-sm text-slate-500 ml-1 font-semibold">{rating}</span>
    </div>
  );
}

export default function CafeCard({ cafe }: { cafe: Cafe }) {
  // Gunakan mapping, jika data tidak sesuai fallback ke aslinya
  const displayPrice = priceLabelMap[cafe.priceRange] || cafe.priceRange;

  return (
    <Link 
      href={`/cafe/${cafe.id}`} 
      className="cafe-card block cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white rounded-2xl border border-slate-100 overflow-hidden" 
      id={`cafe-${cafe.id}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={cafe.image}
          alt={cafe.name}
          fill
          className="cafe-card-img object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Label Harga (Sudah ditranslate ke Hemat/Standar/Premium) */}
        <div className="absolute top-3 right-3 bg-navy-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-accent shadow-md tracking-wide">
          {displayPrice}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-navy-950 leading-tight mb-2 group-hover:text-accent transition-colors">
          {cafe.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-accent">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{cafe.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={cafe.rating} />
          <span className="text-xs text-slate-400 font-medium">({cafe.reviewCount} ulasan)</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {cafe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 font-semibold border border-slate-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Facilities */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 font-medium">
          {cafe.facilities.slice(0, 4).map((facility) => (
            <span key={facility} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {facility}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}