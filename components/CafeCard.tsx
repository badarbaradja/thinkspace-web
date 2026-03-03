import Image from "next/image";
import { Cafe } from "@/data/cafes";

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
  return (
    <div className="cafe-card" id={`cafe-${cafe.id}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={cafe.image}
          alt={cafe.name}
          fill
          className="cafe-card-img object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-navy-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-accent">
          {cafe.priceRange}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-base text-foreground leading-tight mb-1.5">
          {cafe.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{cafe.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <StarRating rating={cafe.rating} />
          <span className="text-xs text-slate-400">({cafe.reviewCount} ulasan)</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {cafe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-navy-900/5 text-navy-700 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Facilities */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400">
          {cafe.facilities.slice(0, 4).map((facility) => (
            <span key={facility} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {facility}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
