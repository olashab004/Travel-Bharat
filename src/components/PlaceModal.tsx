/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { X, MapPin, Star, Calendar, Clock, DollarSign, ExternalLink, Sparkles } from "lucide-react";
import { Place, StateData } from "../types";
import { catColors, FALLBACK } from "../data";

interface PlaceModalProps {
  place: Place;
  state: StateData;
  onClose: () => void;
}

export default function PlaceModal({ place, state, onClose }: PlaceModalProps) {
  const [imgSrc, setImgSrc] = useState(place.image);
  const color = catColors[place.category] || "#E8660A";

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    // Add Esc listener to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleImageError = () => {
    setImgSrc(FALLBACK);
  };

  const openMap = () => {
    const q = encodeURIComponent(`${place.name}, ${place.city}, India`);
    const url = place.lat && place.lng
      ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      id="place-modal-overlay"
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="place-modal-content"
      >
        {/* Banner Section */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-100 flex-shrink-0">
          <img 
            src={imgSrc} 
            alt={place.name} 
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-transform hover:scale-105"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Core Banner details */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span 
              style={{ backgroundColor: color }}
              className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full text-white uppercase shadow-sm inline-block mb-2"
            >
              {place.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-1.5 shadow-sm text-balance">
              {place.name}
            </h2>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{place.city}, {state.name}</span>
            </div>
          </div>
        </div>

        {/* Scrollable details container */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* Rating & time parameters panel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Rating</p>
                <p className="text-sm font-bold text-slate-800">{place.rating.toFixed(1)} / 5.0</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Best Season</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{place.bestTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Timings</p>
                <p className="text-sm font-bold text-slate-800 truncate" title={place.timings}>{place.timings}</p>
              </div>
            </div>
          </div>

          {/* Complete Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About Destination</h4>
            <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed font-normal">
              {place.desc}
            </p>
          </div>

          {/* Pricing and Schedule notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/40 p-4 rounded-xl border border-amber-100">
            <div className="flex items-start gap-2.5">
              <DollarSign className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-800/60 font-bold leading-none mb-1">Entry Fee</p>
                <p className="text-xs sm:text-sm font-semibold text-amber-900">{place.entryFee}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-800/60 font-bold leading-none mb-1">Full Timings</p>
                <p className="text-xs sm:text-sm font-semibold text-amber-900">{place.timings}</p>
              </div>
            </div>
          </div>

          {/* Near attractions */}
          {place.nearby && place.nearby.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-xs">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Nearby Attractions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {place.nearby.map((attraction, i) => (
                  <span 
                    key={i}
                    className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-200/50 transition-colors cursor-default"
                  >
                    {attraction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Maps direction button */}
          <button 
            onClick={openMap}
            className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            id="view-maps-btn"
          >
            <MapPin className="w-4 h-4 text-red-400 fill-red-400/20" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
