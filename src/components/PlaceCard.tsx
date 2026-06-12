/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MapPin, Star, Calendar, ArrowRight } from "lucide-react";
import { Place, StateData } from "../types";
import { catColors, FALLBACK } from "../data";

interface PlaceCardProps {
  key?: string | number | undefined;
  place: Place;
  state: StateData;
  onClick: (place: Place, state: StateData) => void;
}

export default function PlaceCard({ place, state, onClick }: PlaceCardProps) {
  const [imgSrc, setImgSrc] = useState(place.image);
  const color = catColors[place.category] || "#E8660A";

  const handleImageError = () => {
    setImgSrc(FALLBACK);
  };

  return (
    <div
      onClick={() => onClick(place, state)}
      className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200/80 flex flex-col h-full shadow-sm"
      id={`place-card-${place.id}`}
    >
      {/* Thumbnail */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={imgSrc}
          alt={place.name}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
        />
        
        {/* Layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span 
            style={{ 
              backgroundColor: `${color}18`, 
              color: color, 
              borderColor: `${color}30` 
            }}
            className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase shadow-sm backdrop-blur-sm bg-white/70"
          >
            {place.category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span className="text-xs font-bold text-slate-800">{place.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug tracking-tight">
              {place.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{place.city}, {state.name}</span>
          </div>

          {/* Snippet Description */}
          <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
            {place.desc}
          </p>
        </div>

        {/* Footer info & button */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Best: <strong className="text-slate-700 font-semibold">{place.bestTime}</strong></span>
          </div>
          <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
