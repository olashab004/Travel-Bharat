/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useMemo, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Search, 
  Settings, 
  Layers, 
  Sparkles, 
  Star, 
  Menu, 
  X, 
  Lock,
  ChevronRight,
  Bookmark,
  Calendar,
  Layers3,
  Heart,
  User,
  Mail,
  Plane,
  Coins,
  History,
  Users,
  Smile,
  LogOut,
  SlidersHorizontal,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { indiaData, categories, regions, catColors, FALLBACK } from "./data";
import { Place, StateData } from "./types";
import PlaceCard from "./components/PlaceCard";
import PlaceModal from "./components/PlaceModal";
import AdminPanel from "./components/AdminPanel";
import ClientOnboarding, { TravelClient } from "./components/ClientOnboarding";

export default function App() {
  const [view, setView] = useState<"home" | "explore" | "state" | "places">("home");
  const [states, setStates] = useState<StateData[]>(() => indiaData.states);
  
  // Selection States
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceState, setSelectedPlaceState] = useState<StateData | null>(null);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterRegion, setFilterRegion] = useState("All");

  // Admin Security States
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Mobile navigation trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client Onboarding Profiler state
  const [clientInfo, setClientInfo] = useState<TravelClient | null>(() => {
    const stored = localStorage.getItem("travelbharat_client_info");
    return stored ? JSON.parse(stored) : null;
  });

  // Welcome banner visibility helper
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Dynamic calculations of all places in current database state
  const allPlaces = useMemo(() => {
    const list: Place[] = [];
    states.forEach((s) => {
      s.places.forEach((p) => {
        list.push({ ...p, state: s, stateName: s.name });
      });
    });
    return list;
  }, [states]);

  // Sync state selection when states are updated/deleted
  useEffect(() => {
    if (selectedState) {
      const refreshedState = states.find((s) => s.id === selectedState.id);
      if (refreshedState) {
        setSelectedState(refreshedState);
      } else {
        setSelectedState(null);
      }
    }
  }, [states]);

  // Handler to add a destination
  const handleAddPlace = (newPlace: Place) => {
    setStates((prevStates) => {
      return prevStates.map((s) => {
        const matchesName = s.name.toLowerCase() === (newPlace.stateName || "").toLowerCase();
        if (matchesName) {
          return {
            ...s,
            places: [newPlace, ...s.places]
          };
        }
        return s;
      });
    });
  };

  // Handler to delete a destination
  const handleDeletePlace = (id: string) => {
    setStates((prevStates) => {
      return prevStates.map((s) => {
        return {
          ...s,
          places: s.places.filter((p) => p.id !== id)
        };
      });
    });
    if (selectedPlace?.id === id) {
      setSelectedPlace(null);
      setSelectedPlaceState(null);
    }
  };

  // Handler to update a destination
  const handleUpdatePlace = (updatedPlace: Place) => {
    setStates((prevStates) => {
      return prevStates.map((s) => {
        const hasPlace = s.places.some((p) => p.id === updatedPlace.id);
        const matchesNewState = s.name.toLowerCase() === (updatedPlace.stateName || "").toLowerCase();

        if (hasPlace) {
          if (matchesNewState) {
            // State is unchanged, just update the place details inside the state
            return {
              ...s,
              places: s.places.map((p) => (p.id === updatedPlace.id ? updatedPlace : p))
            };
          } else {
            // State changed, remove from this state (it will be added to the matchingState below)
            return {
              ...s,
              places: s.places.filter((p) => p.id !== updatedPlace.id)
            };
          }
        } else if (matchesNewState) {
          // Add the place to this new state
          return {
            ...s,
            places: [updatedPlace, ...s.places]
          };
        }
        return s;
      });
    });

    if (selectedPlace?.id === updatedPlace.id) {
      setSelectedPlace(updatedPlace);
    }
  };

  // Filtering calculations
  const filteredStates = useMemo(() => {
    return states.filter((s) => {
      const matchRegion = filterRegion === "All" || s.region === filterRegion;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        !q || 
        s.name.toLowerCase().includes(q) || 
        s.places.some((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
      
      return matchRegion && matchSearch;
    });
  }, [states, filterRegion, searchQuery]);

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((p) => {
      const matchCat = filterCategory === "All" || p.category === filterCategory;
      const matchReg = filterRegion === "All" || p.state?.region === filterRegion;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.state?.name && p.state.name.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchReg && matchSearch;
    });
  }, [allPlaces, filterCategory, filterRegion, searchQuery]);

  const statePlaces = useMemo(() => {
    if (!selectedState) return [];
    return selectedState.places.filter(
      (p) => filterCategory === "All" || p.category === filterCategory
    );
  }, [selectedState, filterCategory]);

  const clientPlaces = useMemo(() => {
    if (!clientInfo) return [];
    const interest = clientInfo.interest;
    if (interest === "All") return allPlaces.slice(0, 4);
    return allPlaces.filter((p) => p.category.toLowerCase() === interest.toLowerCase());
  }, [allPlaces, clientInfo]);

  const handleAdminLoginSubmit = () => {
    if (adminPass === adminPassword) {
      setShowAdmin(true);
      setShowAdminLogin(false);
      setAdminPass("");
      setAdminError("");
    } else {
      setAdminError("Incorrect security code.");
    }
  };

  const handleOnboardSubmit = (client: TravelClient) => {
    localStorage.setItem("travelbharat_client_info", JSON.stringify(client));
    setClientInfo(client);
    setShowWelcomeBanner(true);
    
    // Auto-filter homepage matching their core interests
    if (client.interest && client.interest !== "All") {
      setFilterCategory(client.interest);
    }
  };

  if (!clientInfo) {
    return <ClientOnboarding onComplete={handleOnboardSubmit} />;
  }

  return (
    <div className="font-sans min-h-screen bg-slate-50/60 text-slate-800 antialiased flex flex-col justify-between">
      
      {/* NAVIGATION BAR */}
      <nav id="app-navigation" className="sticky top-0 z-45 bg-slate-900/95 backdrop-blur-md border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding Logo */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => { setView("home"); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 group focus:outline-none"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform duration-200">
                  🇮🇳
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Travel<span className="text-amber-400">Bharat</span>
                </span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {[
                { id: "home", label: "Home", icon: Compass },
                { id: "explore", label: "Explore States", icon: MapPin },
                { id: "places", label: "All Destinations", icon: BookOpen }
              ].map((link) => {
                const Icon = link.icon;
                const active = view === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setView(link.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      active
                        ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                        : "border-transparent text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              
              {clientInfo && (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Swagatam, <strong className="text-white font-bold">{clientInfo.name}</strong> 
                    <span className="text-amber-400 font-semibold ml-1">({clientInfo.interest})</span>
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("travelbharat_client_info");
                      setClientInfo(null);
                    }}
                    title="Exit Session"
                    className="p-1 hover:bg-white/15 hover:text-red-400 text-slate-400 rounded-lg transition-colors cursor-pointer ml-1 bg-transparent border-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="w-px h-5 bg-white/10 mx-2" />

              <button
                onClick={() => { setShowAdminLogin(true); setAdminError(""); setAdminPass(""); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                <Settings className="w-4 h-4 text-slate-950" />
                <span>Admin</span>
              </button>
            </div>

            {/* Mobile menu trigger button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-900 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {clientInfo && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300 mb-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Traveller</p>
                  <p className="text-white font-bold">{clientInfo.name}</p>
                  <p className="text-amber-400 font-semibold">{clientInfo.interest}</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("travelbharat_client_info");
                    setClientInfo(null);
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 font-bold rounded-lg cursor-pointer"
                >
                  Exit
                </button>
              </div>
            )}
            {[
              { id: "home", label: "Home", icon: Compass },
              { id: "explore", label: "Explore States", icon: MapPin },
              { id: "places", label: "All Destinations", icon: BookOpen }
            ].map((link) => {
              const Icon = link.icon;
              const active = view === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { setView(link.id as any); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left border ${
                    active
                      ? "bg-amber-400/15 border-amber-400/30 text-amber-400"
                      : "border-transparent text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => { setShowAdminLogin(true); setMobileMenuOpen(false); setAdminError(""); setAdminPass(""); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-left"
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Admin Terminal</span>
            </button>
          </div>
        )}
      </nav>

      {/* CORE PAGES CONTROLLER AREA */}
      <main className="flex-grow">
        
        {/* VIEW: HOME LANDING */}
        {view === "home" && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Cover section */}
            <div className="relative bg-slate-900 border-b border-slate-950 overflow-hidden min-h-[500px] flex items-center justify-center px-4">
              {/* Background gradient graphics */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950" />
              
              <div className="relative text-center max-w-3xl py-16 sm:py-24 space-y-6">
                {/* Visual badge highlight */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-500/20 text-xs text-amber-400 font-bold uppercase tracking-widest mx-auto shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Discover Incredible India</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black text-white leading-none tracking-tight text-balance">
                  {clientInfo ? (
                    <>
                      Swagatam, <span className="text-amber-400">{clientInfo.name}</span>!<br />
                      Your Curated Bharat Odyssey
                    </>
                  ) : (
                    <>
                      Explore The Timeless<br />
                      Heritage of <span className="text-amber-400">Bharat</span>
                    </>
                  )}
                </h1>
                
                <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal max-w-2xl mx-auto text-balance">
                  {clientInfo ? (
                    <>
                      Welcome to your personalized travel guide. We have configured your itinerary suited for a <span className="text-amber-400 font-bold">{clientInfo.interest}</span> seeker traveling in <span className="text-amber-400 font-bold">{clientInfo.companion}</span> mode, tuned to a <span className="text-amber-400 font-bold">{clientInfo.budget}</span> budget scale.
                    </>
                  ) : (
                    <>
                      Embark on a grand virtual tour across <strong className="text-white font-medium">{states.length} unique states</strong> and <strong className="text-white font-medium">{allPlaces.length}+ pristine destinations</strong>. Discover monumental royal forts, golden sands, green tea steps, and spiritual ghats.
                    </>
                  )}
                </p>

                <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                  <button 
                    onClick={() => setView("explore")}
                    className="px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Explore States</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setView("places")}
                    className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-95"
                  >
                    Browse All Places
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Census Metrics panel */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-10">
                {[
                  { num: states.length, label: "States Covered", icon: MapPin, color: "text-amber-500 bg-amber-400/10 border-amber-200/50" },
                  { num: `${allPlaces.length}+`, label: "Curated Places", icon: Bookmark, color: "text-emerald-500 bg-emerald-400/10 border-emerald-200/50" },
                  { num: categories.length - 1, label: "Travel categories", icon: Layers3, color: "text-blue-500 bg-blue-400/10 border-blue-200/50" },
                  { num: regions.length - 1, label: "Regions Covered", icon: Compass, color: "text-purple-500 bg-purple-400/10 border-purple-200/50" }
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <div 
                      key={i} 
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md flex items-center gap-4 hover:shadow-lg transition-transform duration-300"
                    >
                      <div className={`p-3 rounded-xl ${metric.color.split(" ")[1]}`}>
                        <Icon className={`w-5 h-5 ${metric.color.split(" ")[0]}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 leading-none mb-1">{metric.num}</p>
                        <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider leading-none">{metric.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Welcome Banner Alert notification if showing */}
            {showWelcomeBanner && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 border border-emerald-500/30 rounded-2xl relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-15 pointer-events-none text-6xl">✨</div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/10 flex-shrink-0">
                      <ThumbsUp className="w-5 h-5 fill-white/20" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Personalized Bharat Compendium Synced! 🎯</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Namaste, <strong className="text-slate-855 text-slate-800 font-bold">{clientInfo?.name}</strong>! We have customized your TravelBharat portal with your <strong className="text-emerald-700 font-bold">{clientInfo?.interest}</strong> styling options under a <strong className="text-emerald-700 font-bold">{clientInfo?.budget}</strong> budget tier. Explore recommendations matching your traveler footprint!
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowWelcomeBanner(false)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-transparent border-none cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Section: Your Personalized Matches Carousel */}
            {clientInfo && clientPlaces.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <span className="text-[10px] bg-amber-400/20 border border-amber-400/30 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold inline-block mb-2 shadow-sm">
                      ✨ CURATED MATCHES BASED ON YOUR INTERESTS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Selected For You, {clientInfo.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Highest-rated {clientInfo.interest} attractions matching your {clientInfo.budget} budget and companion preferences
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setFilterCategory(clientInfo.interest);
                      setView("places");
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
                  >
                    <span>View all matches</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {clientPlaces.slice(0, 4).map((p) => {
                    return (
                      <div key={p.id} className="relative group/personalized">
                        {/* Golden Match Badge overlay */}
                        <div className="absolute top-3 right-[112px] z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full shadow-md border border-amber-300">
                          98% MATCH
                        </div>
                        <PlaceCard 
                          place={p} 
                          state={p.state as StateData} 
                          onClick={(pl, st) => {
                            setSelectedPlace(pl);
                            setSelectedPlaceState(st);
                          }} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section: Featured Top-Rated Attractions */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Must-Visit Masterpieces</h2>
                  <p className="text-sm text-slate-500">Centuries of glorious architecture and extreme natural beauty, rated 4.9+ stars</p>
                </div>
                <button 
                  onClick={() => setView("places")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1 group bg-transparent border-none cursor-pointer"
                >
                  <span>See all destinations</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces
                  .filter((p) => p.rating >= 4.9)
                  .slice(0, 6)
                  .map((p) => (
                    <PlaceCard 
                      key={p.id} 
                      place={p} 
                      state={p.state as StateData} 
                      onClick={(pl, st) => {
                        setSelectedPlace(pl);
                        setSelectedPlaceState(st);
                      }} 
                    />
                  ))}
              </div>
            </div>

            {/* Section: Interactive Category Shortcuts */}
            <div className="bg-slate-50 border-t border-b border-slate-100 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center max-w-xl mx-auto space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
                  <p className="text-sm text-slate-500">Pick an atmosphere matching your core traveler curiosity</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { cat: "Heritage", icon: "🏰", color: "#7B2D8B", desc: "Soar back in time exploring ancient royal forts, temples, and palaces.", bg: "hover:bg-purple-50/50 hover:border-purple-200" },
                    { cat: "Nature", icon: "🌿", color: "#2D8A4E", desc: "Unwind along serene canals, foggy green hills steps, and biodiverse parks.", bg: "hover:bg-emerald-50/50 hover:border-emerald-200" },
                    { cat: "Religious", icon: "🕌", color: "#E8660A", desc: "A spiritual voyage of peaceful temples, rivers, chants, and historic places.", bg: "hover:bg-orange-50/50 hover:border-orange-200" },
                    { cat: "Adventure", icon: "⛰️", color: "#1A6B8A", desc: "Experience extreme rafting, downhill skiing, and mountain pass tracking.", bg: "hover:bg-sky-50/50 hover:border-sky-200" }
                  ].map((c) => (
                    <button
                      key={c.cat}
                      onClick={() => {
                        setFilterCategory(c.cat);
                        setView("places");
                      }}
                      className={`bg-white border border-slate-200/60 rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${c.bg}`}
                    >
                      <div className="text-3xl mb-3.5">{c.icon}</div>
                      <h3 style={{ color: c.color }} className="text-lg font-bold mb-1">{c.cat}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-4">{c.desc}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-0.5">
                        <span>Explore</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: States Quick-Grid Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Explore the States</h2>
                  <p className="text-sm text-slate-500">Divergent cultures, regional history, and scenic horizons</p>
                </div>
                <button 
                  onClick={() => setView("explore")}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-slate-700 hover:text-slate-950 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View All States
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {states.slice(0, 12).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedState(s);
                      setFilterCategory("All");
                      setView("state");
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden text-left p-0 transition-transform hover:-translate-y-1 shadow-sm hover:shadow active:scale-98 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="h-24 w-full bg-slate-100 overflow-hidden relative flex-shrink-0">
                      <img 
                        src={s.image} 
                        alt={s.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-grow">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-[9px] mb-0.5">{s.region} region</p>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">{s.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold mt-2.5 flex items-center justify-between">
                        <span>{s.places.length} places</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: EXPLORE STATE LISTINGS */}
        {view === "explore" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore India, State by State</h1>
              <p className="text-sm text-slate-500 mt-1">Select any region or state to look into beautiful monumental hotspots</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search states, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors"
                />
              </div>

              {/* Region Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none flex-nowrap md:flex-wrap">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setFilterRegion(region)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border whitespace-nowrap transition-all cursor-pointer ${
                      filterRegion === region
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* States listings Grid */}
            {filteredStates.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="text-4xl text-slate-300">🔍</div>
                <h3 className="text-lg font-bold text-slate-800">No states match your search</h3>
                <p className="text-sm text-slate-400">Try rewriting the spelling or clearing some of the current filters.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setFilterRegion("All"); }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStates.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedState(s);
                      setFilterCategory("All");
                      setView("state");
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* State Banner Preview */}
                      <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                        <img 
                          src={s.image} 
                          alt={s.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span 
                          style={{ backgroundColor: s.color }} 
                          className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full shadow"
                        >
                          {s.region} INDIA
                        </span>
                      </div>

                      {/* State Description Metadata */}
                      <div className="p-6">
                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                          {s.name}
                        </h3>
                        <p style={{ color: s.color }} className="text-xs font-bold uppercase tracking-wider mb-3 leading-none">
                          {s.tagline}
                        </p>
                        <p className="text-xs text-slate-400 leading-none mb-4">
                          Capital: <span className="text-slate-600 font-semibold">{s.capital}</span>
                        </p>

                        {/* Category list bubbles */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {["Heritage", "Nature", "Religious", "Adventure"]
                            .filter((cat) => s.places.some((place) => place.category === cat))
                            .map((cat) => (
                              <span 
                                key={cat}
                                style={{
                                  backgroundColor: `${catColors[cat]}10`,
                                  color: catColors[cat],
                                  borderColor: `${catColors[cat]}20`
                                }}
                                className="text-[9px] font-bold tracking-wider border px-2 py-0.5 rounded uppercase"
                              >
                                {cat}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{s.places.length} curated destination{s.places.length !== 1 ? "s" : ""}</span>
                      <span className="text-blue-600 flex items-center gap-0.5">
                        <span>Explore</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: STATE DETAILS & PLACES VIEW */}
        {view === "state" && selectedState && (
          <div className="animate-in fade-in duration-300">
            {/* Banner covering header */}
            <div className="relative bg-slate-950 text-white overflow-hidden py-16 px-4">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{ backgroundImage: `url('${selectedState.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
              
              <div className="relative max-w-7xl mx-auto space-y-4">
                <button
                  onClick={() => setView("explore")}
                  className="px-4 py-2 border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  ← Back to States
                </button>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">{selectedState.name}</h1>
                  <p style={{ color: selectedState.color }} className="text-sm sm:text-lg font-black uppercase tracking-wider mt-1">{selectedState.tagline}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 flex-wrap">
                  <span className="bg-white/10 px-2.5 py-1 rounded-md">Capital: <strong className="text-white font-semibold">{selectedState.capital}</strong></span>
                  <span>•</span>
                  <span>{selectedState.places.length} total places</span>
                  <span>•</span>
                  <span className="bg-amber-400/20 text-amber-300 font-bold px-2.5 py-1 rounded-md">{selectedState.region} India</span>
                </div>
              </div>
            </div>

            {/* Filters and List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
              
              {/* Category selector */}
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-tight">State Destinations</h2>
                  <p className="text-xs text-slate-500 mt-1">Browse spectacular locations in {selectedState.name}</p>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none flex-nowrap">
                  {categories.map((c) => {
                    const active = filterCategory === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setFilterCategory(c)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-all cursor-pointer ${
                          active
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid or Empty */}
              {statePlaces.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <p className="text-3xl">🏜️</p>
                  <h3 className="text-lg font-bold text-slate-800">No destinations match this filter.</h3>
                  <button 
                    onClick={() => setFilterCategory("All")}
                    className="px-4 py-1.5 text-xs font-bold text-blue-600"
                  >
                    Show all categories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statePlaces.map((p) => (
                    <PlaceCard 
                      key={p.id} 
                      place={p} 
                      state={selectedState} 
                      onClick={(pl, st) => {
                        setSelectedPlace(pl);
                        setSelectedPlaceState(st);
                      }} 
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW: ALL DESTINATIONS PANEL */}
        {view === "places" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Destinations</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredPlaces.length} of {allPlaces.length} Indian masterpieces
              </p>
            </div>

            {/* Heavy Search and Filter Panel */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search monument, city, state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 focus:bg-white transition-colors"
                  />
                </div>

                {/* Clear panel */}
                {(searchQuery || filterCategory !== "All" || filterRegion !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("All");
                      setFilterRegion("All");
                    }}
                    className="self-start lg:self-center text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Filters categories and regions */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
                {/* Category selectors */}
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                  <span className="font-extrabold uppercase tracking-wider text-slate-400 min-w-16">Activities:</span>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-nowrap sm:flex-wrap">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilterCategory(c)}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border whitespace-nowrap transition-colors cursor-pointer ${
                          filterCategory === c
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region selectors */}
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap pt-1">
                  <span className="font-extrabold uppercase tracking-wider text-slate-400 min-w-16">Regions:</span>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-nowrap sm:flex-wrap">
                    {regions.map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilterRegion(r)}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border whitespace-nowrap transition-colors cursor-pointer ${
                          filterRegion === r
                            ? "bg-amber-500 border-amber-500 text-slate-950"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid display */}
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/50 shadow-sm space-y-4">
                <p className="text-5xl">🧭</p>
                <h3 className="text-lg font-black text-slate-800">No destinations found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Try rewording state name or using more general search queries to explore things.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("All");
                    setFilterRegion("All");
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Reset parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((p) => (
                  <PlaceCard 
                    key={p.id} 
                    place={p} 
                    state={p.state as StateData} 
                    onClick={(pl, st) => {
                      setSelectedPlace(pl);
                      setSelectedPlaceState(st);
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer id="app-footer" className="bg-slate-900 border-t border-white/5 text-slate-400 pt-16 pb-10 flex-shrink-0 animate-in fade-in duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Description branding info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-orange-500 leading-none flex items-center justify-center text-white text-xs">🇮🇳</span>
                <span className="text-lg font-black text-white">Travel<span className="text-amber-400">Bharat</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                India's premiere, interactive visual compendium detailing centuries of historical heritage, landscapes, religious shrines, and snowy mountains. Discover Incredible India!
              </p>
              
              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Built with love for India</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Explore Links</p>
              <div className="flex flex-col gap-2.5 text-xs text-slate-400">
                <button onClick={() => setView("home")} className="hover:text-white bg-transparent border-none p-0 text-left cursor-pointer">Homepage</button>
                <button onClick={() => setView("explore")} className="hover:text-white bg-transparent border-none p-0 text-left cursor-pointer">Explore States</button>
                <button onClick={() => setView("places")} className="hover:text-white bg-transparent border-none p-0 text-left cursor-pointer">All Destinations</button>
              </div>
            </div>

            {/* Quick Categories Column */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Top Categories</p>
              <div className="flex flex-col gap-2.5 text-xs text-slate-400">
                {["Heritage", "Nature", "Religious", "Adventure"].map((c) => (
                  <button 
                    key={c}
                    onClick={() => { setFilterCategory(c); setView("places"); }}
                    className="hover:text-white bg-transparent border-none p-0 text-left cursor-pointer"
                  >
                    {c} Destinations
                  </button>
                ))}
              </div>
            </div>

            {/* Database Census details column */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Database Summary</p>
              <div className="space-y-2 text-xs text-slate-400">
                <p>Regional states registered: <strong className="text-white font-semibold">{states.length}</strong></p>
                <p>Monuments documented: <strong className="text-white font-semibold">{allPlaces.length}</strong></p>
                <p className="text-[10px] text-slate-500 leading-normal">System operates entirely in persistent sandbox local state storage.</p>
              </div>
            </div>

          </div>

          {/* Sublicense branding alignment info */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
            <span>© 2026 TravelBharat Compendium Project</span>
            <span>Uniting India's Diverse Landmarks</span>
            <span className="text-slate-400/80">Incredible India Official Educational Tool</span>
          </div>

        </div>
      </footer>

      {/* MODAL WINDOWS & SLIDEOVERS */}

      {/* Place Modal Overlay */}
      {selectedPlace && selectedPlaceState && (
        <PlaceModal 
          place={selectedPlace} 
          state={selectedPlaceState} 
          onClose={() => {
            setSelectedPlace(null);
            setSelectedPlaceState(null);
          }} 
        />
      )}

      {/* Admin Login Dialog */}
      {showAdminLogin && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAdminLogin(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-lg mx-auto mb-3 shadow-md shadow-slate-900/10">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            
            <h2 className="text-center text-base sm:text-lg font-bold text-slate-900">Admin Console Access</h2>
            <p className="text-center text-slate-500 text-xs mt-1 mb-6">Enter password context to manage destination details</p>
            
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdminLoginSubmit();
                  }}
                  placeholder="Enter access password..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 focus:bg-white transition-colors text-center font-bold tracking-widest text-slate-800"
                  autoFocus
                />
                
                {adminError && (
                  <p className="text-xs font-bold text-red-505 text-red-600 text-center mt-2">
                    {adminError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={handleAdminLoginSubmit}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Auth Login
                </button>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-6 leading-none">
              Default credentials passcode: <span className="font-bold text-slate-600">{adminPassword}</span>
            </p>

          </div>
        </div>
      )}

      {/* Admin Panel Slideover */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          placesData={allPlaces}
          onAddPlace={handleAddPlace}
          onDeletePlace={handleDeletePlace}
          onUpdatePlace={handleUpdatePlace}
        />
      )}

    </div>
  );
}
