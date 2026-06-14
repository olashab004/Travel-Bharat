/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Search, Key, Shield, Columns, MapPin, Eye, CheckCircle, Pencil, ArrowLeft, AlertTriangle, Users } from "lucide-react";
import { Place } from "../types";
import { catColors, FALLBACK } from "../data";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

interface AdminPanelProps {
  onClose: () => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  placesData: Place[];
  onAddPlace: (newPlace: Place) => void;
  onDeletePlace: (id: string) => void;
  onUpdatePlace: (updatedPlace: Place) => void;
}

export default function AdminPanel({
  onClose,
  adminPassword,
  setAdminPassword,
  placesData,
  onAddPlace,
  onDeletePlace,
  onUpdatePlace
}: AdminPanelProps) {
  const [tab, setTab] = useState<"add" | "manage" | "users" | "password">("add");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  const [usersList, setUsersList] = useState<any[]>(() => {
    const raw = localStorage.getItem("travelbharat_all_users");
    if (!raw) {
      const defaults = [
        {
          id: "usr-1",
          name: "Aarav Sharma",
          email: "aarav@gmail.com",
          interest: "Heritage",
          budget: "Luxury",
          companion: "Family",
          loginMethod: "Google",
          phone: "",
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          id: "usr-2",
          name: "Priya Patel",
          email: "priya.patel@yahoo.com",
          interest: "Nature",
          budget: "Eco-friendly",
          companion: "Solo Traveller",
          loginMethod: "Email",
          phone: "",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          id: "usr-3",
          name: "Devendra Singh",
          email: "devendra@bharat.in",
          interest: "Religious",
          budget: "Comfort",
          companion: "Group Tour",
          loginMethod: "Mobile",
          phone: "+91 98765 43210",
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
        },
        {
          id: "usr-4",
          name: "Neha Kapoor",
          email: "neha.kapoor@gmail.com",
          interest: "Adventure",
          budget: "Comfort",
          companion: "Couple",
          loginMethod: "Facebook",
          phone: "",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("travelbharat_all_users", JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userEditForm, setUserEditForm] = useState<any | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const dbUsers: any[] = [];
      snapshot.forEach((doc) => {
        dbUsers.push(doc.data());
      });
      if (dbUsers.length > 0) {
        setUsersList(dbUsers);
        localStorage.setItem("travelbharat_all_users", JSON.stringify(dbUsers));
      }
    }, (err) => {
      console.error("Firestore user synchronizer in Admin panel errored: ", err);
    });
    return () => unsubscribe();
  }, []);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [editForm, setEditForm] = useState<Place | null>(null);

  const [form, setForm] = useState({
    name: "",
    city: "",
    stateName: "",
    category: "Heritage",
    rating: 4.5,
    bestTime: "",
    entryFee: "Free",
    timings: "9:00 AM–5:00 PM",
    desc: "",
    image: "",
    lat: "27.1751",
    lng: "78.0421"
  });

  // Password fields
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const showFlash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 4000);
  };

  const handleAddField = (key: string, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.city.trim() || !form.stateName.trim() || !form.desc.trim()) {
      showFlash("❌ Required fields are missing (Name, City, State, Description).");
      return;
    }

    const newPlaceObj: Place = {
      id: form.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: form.name.trim(),
      city: form.city.trim(),
      category: form.category,
      rating: Number(form.rating) || 4.5,
      bestTime: form.bestTime.trim() || "Oct–Mar",
      entryFee: form.entryFee.trim() || "Free",
      timings: form.timings.trim() || "9:00 AM–5:00 PM",
      desc: form.desc.trim(),
      image: form.image.trim() || FALLBACK,
      lat: Number(form.lat) || 27.1751,
      lng: Number(form.lng) || 78.0421,
      nearby: [],
      stateName: form.stateName.trim()
    };

    onAddPlace(newPlaceObj);
    showFlash("✅ Destination added successfully!");
    
    // reset
    setForm({
      name: "",
      city: "",
      stateName: form.stateName, // store user state default
      category: "Heritage",
      rating: 4.5,
      bestTime: "",
      entryFee: "Free",
      timings: "9:00 AM–5:00 PM",
      desc: "",
      image: "",
      lat: "27.1751",
      lng: "78.0421"
    });
  };

  const handleStartEdit = (p: Place) => {
    setEditingPlace(p);
    setEditForm({ ...p });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    if (!editForm.name.trim() || !editForm.city.trim() || !(editForm.stateName || editForm.state?.name)?.trim() || !editForm.desc.trim()) {
      showFlash("❌ Required fields are missing (Name, City, State, Description).");
      return;
    }

    onUpdatePlace({
      ...editForm,
      name: editForm.name.trim(),
      city: editForm.city.trim(),
      stateName: (editForm.stateName || editForm.state?.name)?.trim(),
      desc: editForm.desc.trim(),
      image: editForm.image.trim() || FALLBACK,
      rating: Number(editForm.rating) || 4.5,
      lat: Number(editForm.lat) || 27.1751,
      lng: Number(editForm.lng) || 78.0421
    });

    showFlash("✅ Destination details updated successfully!");
    setEditingPlace(null);
    setEditForm(null);
  };

  const handlePasswordChange = () => {
    if (!curPass) {
      showFlash("❌ Enter your current password.");
      return;
    }
    if (curPass !== adminPassword) {
      showFlash("❌ Current password is incorrect.");
      return;
    }
    if (newPass.length < 6) {
      showFlash("❌ New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      showFlash("❌ Passwords do not match.");
      return;
    }

    setAdminPassword(newPass);
    setCurPass("");
    setNewPass("");
    setConfirmPass("");
    showFlash("✅ Password updated successfully!");
  };

  const handleSaveUserEdit = async () => {
    if (!userEditForm) return;
    if (!userEditForm.name.trim() || !userEditForm.email.trim()) {
      showFlash("❌ User Name and Email address are required.");
      return;
    }

    try {
      await setDoc(doc(db, "users", userEditForm.id), userEditForm);

      // Update active traveler session if they edited themselves
      const activeClientRaw = localStorage.getItem("travelbharat_client_info");
      if (activeClientRaw) {
        const activeClient = JSON.parse(activeClientRaw);
        if (activeClient.id === userEditForm.id) {
          localStorage.setItem("travelbharat_client_info", JSON.stringify(userEditForm));
        }
      }

      showFlash("✅ User profile modified successfully!");
      setEditingUser(null);
      setUserEditForm(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userEditForm.id}`);
      showFlash("❌ Failed to update profile in database.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const targetUser = usersList.find(u => u.id === userId);
    const displayName = targetUser ? targetUser.name : "this user";
    if (window.confirm(`Are you sure you want to delete the traveler profile: ${displayName}? This will log them out if active.`)) {
      try {
        await deleteDoc(doc(db, "users", userId));

        // Clear session if active
        const activeClientRaw = localStorage.getItem("travelbharat_client_info");
        if (activeClientRaw) {
          const activeClient = JSON.parse(activeClientRaw);
          if (activeClient.id === userId) {
            localStorage.removeItem("travelbharat_client_info");
            window.location.reload();
          }
        }
        showFlash("✅ User deleted successfully!");
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `users/${userId}`);
        showFlash("❌ Failed to delete user from database.");
      }
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.interest && u.interest.toLowerCase().includes(q)) ||
      (u.loginMethod && u.loginMethod.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const filteredPlaces = placesData.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.stateName && p.stateName.toLowerCase().includes(q))
    );
  });

  const inputStyle = 
    "w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-colors bg-white text-slate-800 placeholder-slate-400";

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[560px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 text-slate-800">
                <Shield className="w-5 h-5 text-red-500 fill-red-500/10" />
                <h2 className="text-xl font-bold tracking-tight">Admin Terminal</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Manage content database in real-time</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl overflow-x-auto">
            {[
              { id: "add", label: "Add Place", icon: Plus },
              { id: "manage", label: `Manage (${filteredPlaces.length})`, icon: Columns },
              { id: "users", label: `Users (${usersList.length})`, icon: Users },
              { id: "password", label: "Security", icon: Key }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tab === t.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow overflow-y-auto min-h-0 space-y-6">
          {msg && (
            <div 
              className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                msg.includes("✅") 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                  : "bg-red-50 border-red-100 text-red-800"
              }`}
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* ADD PLACE TAB */}
          {tab === "add" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Destination Name *</label>
                  <input 
                    className={inputStyle} 
                    value={form.name} 
                    placeholder="e.g. Amber Fort"
                    onChange={(e) => handleAddField("name", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">City *</label>
                  <input 
                    className={inputStyle} 
                    value={form.city} 
                    placeholder="e.g. Jaipur"
                    onChange={(e) => handleAddField("city", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">State Name *</label>
                  <input 
                    className={inputStyle} 
                    value={form.stateName} 
                    placeholder="e.g. Rajasthan"
                    onChange={(e) => handleAddField("stateName", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
                  <select 
                    className={inputStyle} 
                    value={form.category}
                    onChange={(e) => handleAddField("category", e.target.value)}
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Nature">Nature</option>
                    <option value="Religious">Religious</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Best Season</label>
                  <input 
                    className={inputStyle} 
                    value={form.bestTime} 
                    placeholder="e.g. Oct–Mar"
                    onChange={(e) => handleAddField("bestTime", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Entry Fee (INR)</label>
                  <input 
                    className={inputStyle} 
                    value={form.entryFee} 
                    placeholder="e.g. ₹50"
                    onChange={(e) => handleAddField("entryFee", e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Timings</label>
                  <input 
                    className={inputStyle} 
                    value={form.timings} 
                    placeholder="e.g. 9:00 AM–5:00 PM"
                    onChange={(e) => handleAddField("timings", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Rating (1.0 to 5.0)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1" 
                    className={inputStyle} 
                    value={form.rating} 
                    onChange={(e) => handleAddField("rating", Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Latitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className={inputStyle} 
                    value={form.lat} 
                    placeholder="e.g. 27.1751"
                    onChange={(e) => handleAddField("lat", e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Longitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className={inputStyle} 
                    value={form.lng} 
                    placeholder="e.g. 78.0421"
                    onChange={(e) => handleAddField("lng", e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Image Unsplash/CDN URL</label>
                <input 
                  type="url" 
                  className={inputStyle} 
                  value={form.image} 
                  placeholder="https://images.unsplash.com/photo-..."
                  onChange={(e) => handleAddField("image", e.target.value)} 
                />
              </div>

              {/* Card image real-time preview (safety safeguard check to prevent random images) */}
              {form.image && (
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Landmark Image Preview</div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-white border border-slate-200 relative">
                    <img 
                      src={form.image} 
                      alt="Verify the accuracy of this photo before creating the landmark" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK;
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Please verify that the picture shown represents the core, realistic landmark of {form.name || 'this destination'}.</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Detailed Description *</label>
                <textarea 
                  rows={4}
                  className={`${inputStyle} resize-none`} 
                  value={form.desc} 
                  placeholder="Give a beautiful, historical, and detailed narrative..."
                  onChange={(e) => handleAddField("desc", e.target.value)} 
                />
              </div>

              <button 
                onClick={handleAdd}
                className="w-full mt-2 py-3 bg-slate-905 bg-slate-900 border border-transparent text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Create Destination
              </button>
            </div>
          )}

          {/* MANAGE PLACES TAB */}
          {tab === "manage" && editingPlace && editForm && (
            <div className="space-y-4">
              {/* Back button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  onClick={() => {
                    setEditingPlace(null);
                    setEditForm(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-wider bg-transparent cursor-pointer border-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to List</span>
                </button>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Editing Mode</span>
              </div>

              {/* Integrity Warning */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Accuracy Warning:</span> Please ensure the images and descriptions you are adding correspond precisely to the particular landmark of <strong className="font-extrabold">{editingPlace.name}</strong>. No generic photos or unrelated pictures.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Destination Name *</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.name} 
                    placeholder="e.g. Amber Fort"
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">City *</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.city} 
                    placeholder="e.g. Jaipur"
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">State Name *</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.stateName || editForm.state?.name || ""} 
                    placeholder="e.g. Rajasthan"
                    onChange={(e) => setEditForm({ ...editForm, stateName: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
                  <select 
                    className={inputStyle} 
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Nature">Nature</option>
                    <option value="Religious">Religious</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Best Season</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.bestTime} 
                    placeholder="e.g. Oct–Mar"
                    onChange={(e) => setEditForm({ ...editForm, bestTime: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Entry Fee (INR)</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.entryFee} 
                    placeholder="e.g. ₹50"
                    onChange={(e) => setEditForm({ ...editForm, entryFee: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Timings</label>
                  <input 
                    className={inputStyle} 
                    value={editForm.timings} 
                    placeholder="e.g. 9:00 AM–5:00 PM"
                    onChange={(e) => setEditForm({ ...editForm, timings: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Rating (1.0 to 5.0)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1" 
                    className={inputStyle} 
                    value={editForm.rating} 
                    onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Latitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className={inputStyle} 
                    value={editForm.lat} 
                    placeholder="e.g. 27.1751"
                    onChange={(e) => setEditForm({ ...editForm, lat: Number(e.target.value) || 27.1751 })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Longitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    className={inputStyle} 
                    value={editForm.lng} 
                    placeholder="e.g. 78.0421"
                    onChange={(e) => setEditForm({ ...editForm, lng: Number(e.target.value) || 78.0421 })} 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Image Unsplash/CDN URL *</label>
                <input 
                  type="url" 
                  className={inputStyle} 
                  value={editForm.image} 
                  placeholder="https://images.unsplash.com/photo-..."
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} 
                />
              </div>

              {/* Card image real-time preview (safety safeguard check to prevent random images) */}
              {editForm.image && (
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Landmark Image Preview</div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-white border border-slate-200 relative group">
                    <img 
                      src={editForm.image} 
                      alt="Verify this is Amber Fort, Hawa Mahal, Taj Mahal, etc." 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK;
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Please verify that the picture shown represents the core, realistic landmark of {editForm.name}.</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Detailed Description *</label>
                <textarea 
                  rows={4}
                  className={`${inputStyle} resize-none`} 
                  value={editForm.desc} 
                  placeholder="Give a beautiful, historical, and detailed narrative..."
                  onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} 
                />
              </div>

              <div className="flex gap-2 text-xs pt-1.5">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingPlace(null);
                    setEditForm(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {tab === "manage" && !editingPlace && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className={`${inputStyle} pl-10`} 
                  placeholder="Search by monument name, city or state..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredPlaces.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No matching destinations found.</p>
                ) : (
                  filteredPlaces.map((p) => {
                    const color = catColors[p.category] || "#6B7280";
                    return (
                      <div 
                        key={p.id} 
                        className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-100">
                          <img 
                            src={p.image} 
                            alt="" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate mb-0.5">{p.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="truncate">{p.city} · {p.stateName || p.state?.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                            <span style={{ color: color }} className="font-semibold text-[10px] uppercase tracking-wider">{p.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs font-bold text-amber-600 mr-2">★ {p.rating}</span>
                          
                          {/* Edit button */}
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit Landmark Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => onDeletePlace(p.id)}
                            className="p-2 hover:bg-red-55 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* USER REGISTRY TAB */}
          {tab === "users" && editingUser && userEditForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUserEditForm(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-wider bg-transparent cursor-pointer border-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to User Registry</span>
                </button>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Edit Traveler Profile</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Traveler Name *</label>
                  <input 
                    className={inputStyle} 
                    value={userEditForm.name || ""} 
                    onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Email address *</label>
                  <input 
                    type="email"
                    className={inputStyle} 
                    value={userEditForm.email || ""} 
                    onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Travel Vibe Interest</label>
                  <select 
                    className={inputStyle} 
                    value={userEditForm.interest || "All"}
                    onChange={(e) => setUserEditForm({ ...userEditForm, interest: e.target.value })}
                  >
                    <option value="All">All / Guest</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Nature">Nature</option>
                    <option value="Religious">Religious</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Companion Mode</label>
                  <select 
                    className={inputStyle} 
                    value={userEditForm.companion || "Solo Traveller"}
                    onChange={(e) => setUserEditForm({ ...userEditForm, companion: e.target.value })}
                  >
                    <option value="Solo Traveller">Solo Traveller</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Group Tour">Group Tour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Budget Scale</label>
                  <select 
                    className={inputStyle} 
                    value={userEditForm.budget || "Comfort"}
                    onChange={(e) => setUserEditForm({ ...userEditForm, budget: e.target.value })}
                  >
                    <option value="Eco-friendly">Eco-friendly</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mobile Phone (Optional)</label>
                  <input 
                    className={inputStyle} 
                    placeholder="e.g. +91 90000 00000"
                    value={userEditForm.phone || ""} 
                    onChange={(e) => setUserEditForm({ ...userEditForm, phone: e.target.value })} 
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">Authentication Provider</span>
                  <span className="font-semibold text-slate-700 capitalize">{userEditForm.loginMethod || "Signup"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">Account Created On</span>
                  <span className="font-semibold text-slate-700">
                    {userEditForm.createdAt ? new Date(userEditForm.createdAt).toLocaleDateString() : "Just Now"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-xs pt-1.5">
                <button
                  onClick={handleSaveUserEdit}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Traveler Profile
                </button>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUserEditForm(null);
                  }}
                  className="flex-grow-0 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl pointer-events-auto cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {tab === "users" && !editingUser && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className={`${inputStyle} pl-10`} 
                  placeholder="Search travelers by name, email, interests..." 
                  value={userSearchQuery} 
                  onChange={(e) => setUserSearchQuery(e.target.value)} 
                />
              </div>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No matching traveler records found.</p>
                ) : (
                  filteredUsers.map((u) => {
                    const avatarColor = u.interest === "Heritage" ? "bg-purple-100 text-purple-700" :
                                        u.interest === "Nature" ? "bg-emerald-100 text-emerald-700" :
                                        u.interest === "Religious" ? "bg-orange-100 text-orange-700" :
                                        u.interest === "Adventure" ? "bg-sky-100 text-sky-700" :
                                        "bg-amber-100 text-amber-700";
                    return (
                      <div 
                        key={u.id}
                        className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                      >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl ${avatarColor} font-black text-sm flex items-center justify-center flex-shrink-0 border border-white`}>
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        {/* Text fields */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800 truncate">{u.name}</span>
                            <span className="text-[9px] bg-slate-200/60 font-bold px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-wide">
                              {u.loginMethod || "Email"}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500 truncate mt-0.5">{u.email}</p>
                          
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/50">
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100 font-medium">✨ {u.interest}</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100 font-medium">💰 {u.budget}</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100 font-medium">👥 {u.companion}</span>
                            {u.phone && <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-semibold text-[10px]">📞 {u.phone}</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0 self-start pt-1">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setUserEditForm({ ...u });
                            }}
                            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                            title="Edit User Profile"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Stats & Tools footer */}
              <div className="p-3 bg-slate-100/55 border border-slate-200/50 rounded-xl text-[10.5px] text-slate-500 flex justify-between items-center">
                <span>Active Database: <strong>{usersList.length} User(s)</strong></span>
                <button
                  onClick={() => {
                    if (window.confirm("Restore Default Seed Travelers? This will reset all traveler accounts.")) {
                      localStorage.removeItem("travelbharat_all_users");
                      window.location.reload();
                    }
                  }}
                  className="hover:text-amber-600 font-bold bg-transparent border-none cursor-pointer p-0 uppercase text-[10px]"
                >
                  🔄 Reset Seed Accounts
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD TAB */}
          {tab === "password" && (
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Current Password</label>
                <input 
                  type="password" 
                  className={inputStyle} 
                  placeholder="••••••••" 
                  value={curPass} 
                  onChange={(e) => setCurPass(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">New Password (6+ chars)</label>
                <input 
                  type="password" 
                  className={inputStyle} 
                  placeholder="••••••••" 
                  value={newPass} 
                  onChange={(e) => setNewPass(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
                <input 
                  type="password" 
                  className={inputStyle} 
                  placeholder="••••••••" 
                  value={confirmPass} 
                  onChange={(e) => setConfirmPass(e.target.value)} 
                />
              </div>

              <button 
                onClick={handlePasswordChange}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Change Admin Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
