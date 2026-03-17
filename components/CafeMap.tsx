"use client";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";

// Komponen helper untuk otomatis menggeser peta ke lokasi user
function FlyToUser({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function CafeMap({ cafes, userLocation }: { cafes: any[], userLocation?: {lat: number, lng: number} | null }) {
  // Pusat peta default di Bandung
  const centerPosition: [number, number] = [-6.914744, 107.60981];

  const mapIcons = useMemo(() => {
    if (typeof window === "undefined") return null;

    return {
      cafeIcon: L.divIcon({
        className: "bg-transparent border-none",
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center justify-center">
            <div class="absolute bg-accent/40 w-10 h-10 rounded-full blur-md group-hover:bg-accent/60 group-hover:scale-125 transition-all"></div>
            <div class="relative w-8 h-8 bg-navy-950 border-2 border-accent rounded-full flex items-center justify-center shadow-xl z-10 transition-transform group-hover:-translate-y-1">
              <span class="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            </div>
            <div class="w-2 h-2 bg-navy-950 rotate-45 -mt-1.5 z-0 transition-transform group-hover:-translate-y-1"></div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
      }),
      userIcon: L.divIcon({
        className: "bg-transparent border-none",
        html: `
          <div class="relative flex flex-col items-center justify-center">
            <div class="absolute bg-red-500/30 w-16 h-16 rounded-full blur-md animate-ping"></div>
            <div class="relative w-10 h-10 bg-red-500 border-4 border-white rounded-full flex items-center justify-center shadow-2xl z-10">
              <span class="text-white text-xs">📍</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -25],
      })
    };
  }, []);

  if (!mapIcons) {
    return <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-medium">Memuat Peta...</div>;
  }

  return (
    <div className="w-full h-full relative z-0 rounded-[2rem] overflow-hidden shadow-inner">
      <MapContainer center={centerPosition} zoom={12} scrollWheelZoom={true} zoomControl={false} className="w-full h-full">
        <ZoomControl position="bottomright" />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        <FlyToUser coords={userLocation ? [userLocation.lat, userLocation.lng] : null} />

        {/* Marker Lokasi Pengguna */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={mapIcons.userIcon}>
            <Popup className="custom-popup"><div className="p-2 font-bold text-navy-950 text-center">Lokasi Anda Saat Ini</div></Popup>
          </Marker>
        )}

        {/* Marker Kafe */}
        {cafes.map((cafe) => {
          if (!cafe.lat || !cafe.lng) return null;
          
          return (
            <Marker key={cafe.id} position={[cafe.lat, cafe.lng]} icon={mapIcons.cafeIcon}>
              <Popup className="custom-popup">
                <div className="text-center p-1 min-w-[160px]">
                  {/* Foto Kafe */}
                  <div className="w-full h-20 rounded-lg overflow-hidden mb-2 relative">
                     <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                     <div className="absolute top-1 right-1 bg-navy-950/80 backdrop-blur-sm text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">⭐ {cafe.rating}</div>
                  </div>
                  
                  {/* Info Teks */}
                  <h3 className="font-bold text-navy-950 text-sm mb-0.5">{cafe.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-3 truncate px-1">📍 {cafe.location}</p>
                  
                  {/* DUA TOMBOL AKSI */}
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Tombol 1: Detail Aplikasi */}
                    <Link href={`/cafe/${cafe.id}`} className="bg-accent text-navy-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 block w-full transition-colors shadow-sm">
                      Lihat Detail
                    </Link>
                    
                    {/* Tombol 2: Google Maps Routing (GROWTH HACK) */}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 hover:text-navy-950 block w-full transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      Rute Google Maps
                    </a>
                  </div>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { border-radius: 1.25rem !important; padding: 4px !important; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15) !important; border: 1px solid #f1f5f9; }
        .leaflet-popup-content { margin: 4px !important; }
        .leaflet-popup-tip { background: white !important; }
        .leaflet-container a.leaflet-popup-close-button { color: #cbd5e1; padding: 6px; top: 2px; right: 2px; }
        .leaflet-container a.leaflet-popup-close-button:hover { color: #ef4444; background: transparent; }
      `}} />
    </div>
  );
}