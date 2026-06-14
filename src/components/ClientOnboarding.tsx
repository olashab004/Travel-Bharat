import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Plane, 
  MapPin, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Check,
  Phone,
  LogIn,
  AlertCircle,
  Laptop,
  Users,
  Award,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, auth, googleProvider, handleFirestoreError, OperationType } from "../firebase";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export interface TravelClient {
  id: string;
  name: string;
  email: string;
  interest: string; // Heritage | Nature | Religious | Adventure | All
  budget: string; // Eco-friendly | Comfort | Luxury
  companion: string; // Solo Traveller | Couple | Family | Group Tour
  loginMethod?: string; // Google | Facebook | Mobile | Signup | Email
  phone?: string;
  createdAt?: string;
}

interface ClientOnboardProps {
  onComplete: (client: TravelClient) => void;
}

const BACKGROUND_SLIDES = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
    title: "The Timeless Taj Mahal",
    desc: "Varanasi ghats and Agra marble monuments reflecting centuries of rich culture."
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Munnar_Overview.jpg",
    title: "Lush Tea Valleys of Munnar",
    desc: "Silent emerald valleys, spice-rich plantations, and peaceful tea trails."
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/House_Boat_DSW.jpg",
    title: "Serene Backwaters of Kerala",
    desc: "Gliding along peaceful palm-fringed rivers on comfortable houseboats."
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/de/Snow_Rohtang_Range_Manali_May24_A7CR_00128.jpg",
    title: "Majestic Snowy Peaks of Manali",
    desc: "Downhill skiing and thrilling mountain pass tracking in the Himalayas."
  }
];

// Seed users database helper
const getStoredUsers = (): TravelClient[] => {
  const raw = localStorage.getItem("travelbharat_all_users");
  if (!raw) {
    const defaultUsers: TravelClient[] = [
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
    localStorage.setItem("travelbharat_all_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export default function ClientOnboarding({ onComplete }: ClientOnboardProps) {
  const [onboardMode, setOnboardMode] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState(1);
  const [slideIdx, setSlideIdx] = useState(0);
  const [error, setError] = useState("");

  const [firebaseUsersList, setFirebaseUsersList] = useState<TravelClient[]>(() => getStoredUsers());

  useEffect(() => {
    // Synchronize user profiles on snapshot
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const dbUsers: TravelClient[] = [];
      snapshot.forEach((doc) => {
        dbUsers.push(doc.data() as TravelClient);
      });

      if (dbUsers.length > 0) {
        setFirebaseUsersList(dbUsers);
        localStorage.setItem("travelbharat_all_users", JSON.stringify(dbUsers));
      } else {
        // Automatically seed cold Firestore with seed data
        const defaultUsers = getStoredUsers();
        defaultUsers.forEach(async (u) => {
          try {
            await setDoc(doc(db, "users", u.id), u);
          } catch (e) {
            console.error("Error seeding to Firestore: ", e);
          }
        });
      }
    }, (err) => {
      console.error("Firestore users live sync error: ", err);
    });

    return () => unsubscribe();
  }, []);

  // Sign up state
  const [form, setForm] = useState({
    name: "",
    email: "",
    interest: "Heritage",
    budget: "Comfort",
    companion: "Solo Traveller"
  });

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [modalType, setModalType] = useState<"none" | "google" | "facebook" | "mobile">("none");

  // Mobile login details
  const [mobileNum, setMobileNum] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("4321");

  // Custom Social input for new accounts
  const [customSocialName, setCustomSocialName] = useState("");
  const [customSocialEmail, setCustomSocialEmail] = useState("");

  // Cycle slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const validateStep1 = () => {
    if (!form.name.trim()) {
      setError("Please write down your name so we can personalize your dashboard.");
      return false;
    }
    if (form.name.trim().length < 2) {
      setError("Name should be at least 2 characters.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Please provide a valid email address to complete your profile creation.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please provide a legally valid email address format (e.g. wanderer@domain.com).");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  // Finalize signup creation
  const handleSignupSubmit = async () => {
    const newUser: TravelClient = {
      id: "usr-" + Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      interest: form.interest,
      budget: form.budget,
      companion: form.companion,
      loginMethod: "Signup",
      createdAt: new Date().toISOString()
    };

    try {
      // Save user to Firestore Users database
      await setDoc(doc(db, "users", newUser.id), newUser);
      onComplete(newUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${newUser.id}`);
      setError("Failed to create profile in Database. Please try again.");
    }
  };

  // Handle direct local email login
  const handleEmailLogin = async () => {
    if (!loginEmail.trim()) {
      setError("Please type your email address first.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setError("Please type a valid email format.");
      return;
    }

    const existing = firebaseUsersList.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());

    if (existing) {
      setError("");
      try {
        const updated = { ...existing, loginMethod: "Email" };
        await setDoc(doc(db, "users", existing.id), updated);
        onComplete(updated);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${existing.id}`);
        onComplete({ ...existing, loginMethod: "Email" });
      }
    } else {
      // Auto register unrecognized email silently in Firestore
      const generatedUser: TravelClient = {
        id: "usr-" + Date.now(),
        name: loginEmail.split("@")[0].charAt(0).toUpperCase() + loginEmail.split("@")[0].slice(1),
        email: loginEmail.trim(),
        interest: "All",
        budget: "Comfort",
        companion: "Solo Traveller",
        loginMethod: "Email",
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, "users", generatedUser.id), generatedUser);
        setError("");
        onComplete(generatedUser);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${generatedUser.id}`);
        setError("Error setting up direct email account.");
      }
    }
  };

  // Handle Real Google Authenticator Popup
  const handleRealGoogleLogin = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user) return;

      const match = firebaseUsersList.find(u => u.email.toLowerCase() === (user.email || "").toLowerCase());
      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "Google"
      } : {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Google Traveler",
        email: user.email || "",
        interest: "All",
        budget: "Comfort",
        companion: "Solo Traveller",
        loginMethod: "Google",
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", loggedUser.id), loggedUser);
      setModalType("none");
      onComplete(loggedUser);
    } catch (e: any) {
      console.error("Real Google OAuth login failed: ", e);
      setError(`Real Google Sign In failed: ${e.message || e}`);
    }
  };

  // Social account chooser login trigger (pre-registered sim profiles)
  const handleSocialSelect = async (user: TravelClient, method: "Google" | "Facebook") => {
    const loggedUser = { ...user, loginMethod: method };
    
    // update login method in DB
    try {
      await setDoc(doc(db, "users", user.id), loggedUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.id}`);
    }
    
    setModalType("none");
    onComplete(loggedUser);
  };

  // Custom Google/Facebook user creation
  const handleCustomSocialLogin = async (method: "Google" | "Facebook") => {
    if (!customSocialName.trim() || !customSocialEmail.trim()) {
      setError("Please enter both Name and Email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customSocialEmail)) {
      setError("Please specify a valid email format.");
      return;
    }

    const generatedUser: TravelClient = {
      id: "usr-" + Date.now(),
      name: customSocialName.trim(),
      email: customSocialEmail.trim(),
      interest: "All",
      budget: "Comfort",
      companion: "Solo Traveller",
      loginMethod: method,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", generatedUser.id), generatedUser);
      setCustomSocialName("");
      setCustomSocialEmail("");
      setModalType("none");
      onComplete(generatedUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${generatedUser.id}`);
      setError("Failed to create profile in Firestore.");
    }
  };

  // Trigger mobile verification code delivery
  const handleSendOtp = () => {
    if (!mobileNum.trim() || mobileNum.trim().length < 8) {
      setError("Please enter a correct phone number first.");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  // Verify mobile OTP and finish log in
  const handleVerifyOtpAndLogin = async () => {
    if (otpCode !== simulatedOtp) {
      setError("Incorrect verification code. Please type the mock simulation code '4321'.");
      return;
    }

    // Attempt to match pre-existing user with phone or log in with new
    const cleanPhone = `${countryCode} ${mobileNum.trim()}`;
    const existing = firebaseUsersList.find(u => u.phone === cleanPhone || (u.phone && u.phone.replace(/\s+/g, "") === cleanPhone.replace(/\s+/g, "")));

    if (existing) {
      setError("");
      setModalType("none");
      try {
        const updated = { ...existing, loginMethod: "Mobile" };
        await setDoc(doc(db, "users", existing.id), updated);
        onComplete(updated);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${existing.id}`);
        onComplete({ ...existing, loginMethod: "Mobile" });
      }
    } else {
      // Create new account
      const generatedUser: TravelClient = {
        id: "usr-" + Date.now(),
        name: `Mobile Guest (${mobileNum.slice(-4)})`,
        email: `${mobileNum.trim()}@mobile-traveler.in`,
        interest: "All",
        budget: "Comfort",
        companion: "Solo Traveller",
        loginMethod: "Mobile",
        phone: cleanPhone,
        createdAt: new Date().toISOString()
      };
      
      try {
        await setDoc(doc(db, "users", generatedUser.id), generatedUser);
        setError("");
        setModalType("none");
        onComplete(generatedUser);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${generatedUser.id}`);
        setError("Failed to store mobile profile in database.");
      }
    }
  };

  const handleFastTrack = () => {
    onComplete({
      id: "usr-guest",
      name: "Incredible Guest",
      email: "guest@travelbharat.org",
      interest: "All",
      budget: "Comfort",
      companion: "Solo Traveller",
      loginMethod: "Email",
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans p-4 sm:p-6 md:p-8">
      {/* Background Image Slideshow with smooth crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKGROUND_SLIDES[slideIdx].url})` }}
          />
        </AnimatePresence>
        {/* Soft dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
      </div>

      {/* Slide descriptor badge on bottom left */}
      <div className="absolute bottom-6 left-6 hidden md:block z-10 max-w-sm border-l-2 border-amber-400 pl-4 py-1">
        <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">LANDSCAPE GALLERY</p>
        <p className="text-white font-bold text-sm leading-tight mt-0.5">{BACKGROUND_SLIDES[slideIdx].title}</p>
        <p className="text-slate-400 text-xs mt-1 leading-normal font-light">{BACKGROUND_SLIDES[slideIdx].desc}</p>
      </div>

      {/* Main card container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8 md:p-10"
      >
        {/* Decorative corner glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 items-center justify-center shadow-lg shadow-orange-500/20 mb-3.5 transform hover:rotate-6 transition-transform">
            <span className="text-xl">🇮🇳</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
            Travel<span className="text-amber-400">Bharat</span>
          </h2>
          <p className="text-xs text-slate-300 font-normal">
            Your Premium Personalized Odyssey Curator
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl mt-6 border border-white/5">
            <button
              onClick={() => {
                setOnboardMode("signup");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                onboardMode === "signup"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🧙‍♂️ Customized Sign Up
            </button>
            <button
              onClick={() => {
                setOnboardMode("login");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                onboardMode === "login"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔑 Speed Log In
            </button>
          </div>
        </div>

        {/* Error reporting alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-500/15 border border-red-500/25 rounded-xl text-xs text-red-300 font-bold mb-5 flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="leading-normal">{error}</span>
          </motion.div>
        )}

        {/* Form area */}
        <div className="relative min-h-[290px]">
          <AnimatePresence mode="wait">
            {onboardMode === "signup" ? (
              /* SIGN UP FLOW (WIZARD STEPS) */
              <motion.div
                key="signup-flow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {step === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-white mb-1">Create Your Explorer Persona</h4>
                      <p className="text-xs text-slate-400 leading-normal">Configure custom tour settings matching your target monuments.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-amber-400 tracking-wider uppercase block">YOUR NAME</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-amber-400/50 rounded-xl text-sm focus:outline-none transition-colors text-white font-semibold placeholder-slate-505 placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-amber-400 tracking-wider uppercase block">EMAIL ADDRESS</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="e.g. aarav@gmail.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-amber-400/50 rounded-xl text-sm focus:outline-none transition-colors text-white font-semibold placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button 
                        onClick={handleNext}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md shadow-amber-500/10 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Choose Core Interests</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-white mb-1">Curation Settings</h4>
                      <p className="text-xs text-slate-400 leading-normal">Tell us about your core travel interests to filters top places.</p>
                    </div>

                    {/* Vibe Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block">TRAVEL VIBE</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { cat: "Heritage", label: "🏰 Heritage Seek" },
                          { cat: "Nature", label: "🌿 Nature Escape" },
                          { cat: "Religious", label: "🕌 Spiritual Trail" },
                          { cat: "Adventure", label: "⛰️ Adventure Peak" }
                        ].map((item) => {
                          const selected = form.interest === item.cat;
                          return (
                            <button
                              key={item.cat}
                              onClick={() => setForm({ ...form, interest: item.cat })}
                              className={`p-3 text-left rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                selected
                                  ? "border-amber-500 bg-amber-550/10 bg-amber-500/10 text-white ring-2 ring-amber-400/40"
                                  : "border-white/10 bg-white/5 hover:bg-white/10 text-slate-300"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{item.label}</span>
                                {selected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-400 block">COMPANION MODE</label>
                        <select
                          value={form.companion}
                          onChange={(e) => setForm({ ...form, companion: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:border-amber-400"
                        >
                          <option value="Solo Traveller">👤 Solo Walk</option>
                          <option value="Couple">💕 Companion Couple</option>
                          <option value="Family">👨‍👩‍👧 Family Trip</option>
                          <option value="Group Tour">🎒 Group Safari</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-400 block">BUDGET SCALE</label>
                        <select
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:border-amber-400"
                        >
                          <option value="Eco-friendly">₹ Pocket-Friendly</option>
                          <option value="Comfort">₹₹ Cozy Comfort</option>
                          <option value="Luxury">₹₹₹ Luxury Elite</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5 pt-2">
                      <button 
                        onClick={() => setStep(1)}
                        className="py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs uppercase cursor-pointer transition-colors flex items-center justify-center gap-1 border border-white/5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button 
                        onClick={handleSignupSubmit}
                        className="col-span-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl font-black text-xs tracking-wider uppercase shadow-md shadow-orange-500/10 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Launch Journey</span>
                        <Sparkles className="w-4 h-4 fill-slate-950/20" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* LOGIN FLOW (VARIOUS LOGIN METHODS) */
              <motion.div
                key="login-flow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Select Login Method</h4>
                  <p className="text-xs text-slate-400 leading-normal">Authenticate via simulated social platforms or mobile verification.</p>
                </div>

                {/* Grid of Social and Mobile buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      setModalType("google");
                      setError("");
                    }}
                    className="flex sm:flex-col items-center justify-center gap-2.5 py-3 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">🌐</span>
                    <span>Google</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType("facebook");
                      setError("");
                    }}
                    className="flex sm:flex-col items-center justify-center gap-2.5 py-3 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-blue-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">👥</span>
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType("mobile");
                      setError("");
                      setOtpSent(false);
                      setMobileNum("");
                      setOtpCode("");
                    }}
                    className="flex sm:flex-col items-center justify-center gap-2.5 py-3 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-emerald-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    <span>Mobile SMS</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">or Quick Email Login</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Email Login form */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-400 tracking-wider">EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. aarav@gmail.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleEmailLogin}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Authenticate Email</span>
                  </button>
                </div>

                {/* Quick Hint message */}
                <div className="text-[10px] bg-white/5 p-2 rounded-lg text-slate-400 text-center">
                  💡 Hint: Enter <strong className="text-white hover:underline cursor-pointer" onClick={() => setLoginEmail("aarav@gmail.com")}>aarav@gmail.com</strong> or <strong className="text-white hover:underline cursor-pointer" onClick={() => setLoginEmail("priya.patel@yahoo.com")}>priya.patel@yahoo.com</strong> to log in instantly.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info skip section */}
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Stated database kept local</span>
          <button 
            onClick={handleFastTrack}
            className="hover:text-amber-400 font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer p-0"
          >
            Skip & Explore as Guest
          </button>
        </div>
      </motion.div>

      {/* DETAILED DIALOG/MODALS AREA FOR SOCIAL AND MOBILE LOGINS */}
      <AnimatePresence>
        {modalType !== "none" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden p-6 relative shadow-2xl"
            >
              {/* Top decorator */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              
              <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
                <span>{modalType === "google" ? "🌐 Google Live OAuth" : modalType === "facebook" ? "👥 Facebook Secure Sign In" : "📱 Mobile SMS Authentication"}</span>
              </h3>
              
              {/* GOOGLE & FACEBOOK ACCOUNT PICKER */}
              {(modalType === "google" || modalType === "facebook") && (
                <div className="space-y-4 py-2">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select a simulated test profile or log in with a custom {modalType === "google" ? "Google G-Suite" : "Facebook Connect"} profile to sync your companion details.
                  </p>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pre-registered Profiles</p>
                    {firebaseUsersList.map((u) => {
                      const initial = u.name.charAt(0);
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSocialSelect(u, modalType === "google" ? "Google" : "Facebook")}
                          className="w-full flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                            </div>
                          </div>
                          <span className="text-[10.5px] bg-white/5 px-2 py-0.5 rounded-md text-amber-300 font-semibold uppercase">{u.interest}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Google Authenticator Live OAuth Button */}
                  {modalType === "google" && (
                    <button
                      onClick={handleRealGoogleLogin}
                      className="w-full py-2.5 bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <span>🌐</span>
                      <span>Sign In with Real Google Account</span>
                    </button>
                  )}

                  {/* Divider */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-3 text-slate-500 text-[9px] font-semibold uppercase tracking-widest">Connect New Account</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Custom Account Input */}
                  <div className="space-y-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-amber-400 block uppercase">FULL NAME</label>
                      <input 
                        type="text" 
                        value={customSocialName}
                        onChange={(e) => setCustomSocialName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-1.5 bg-slate-800 border border-white/5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-amber-400 block uppercase">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        value={customSocialEmail}
                        onChange={(e) => setCustomSocialEmail(e.target.value)}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full px-3 py-1.5 bg-slate-800 border border-white/5 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleCustomSocialLogin(modalType === "google" ? "Google" : "Facebook")}
                      className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg text-xs font-bold uppercase transition-colors hover:from-amber-600 hover:to-orange-600"
                    >
                      Authenticate as New User
                    </button>
                  </div>
                </div>
              )}

              {/* MOBILE LOGIN SMS AREA */}
              {modalType === "mobile" && (
                <div className="space-y-4 py-2">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verify using your mobile phone number. Enter the simulated validation code sent to finalize login.
                  </p>

                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-amber-400 tracking-wider">YOUR MOBILE NUMBER</label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="bg-slate-800 border border-white/10 rounded-xl px-2 text-xs text-slate-200 focus:outline-none"
                          >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+971">🇦🇪 +971</option>
                          </select>
                          <input 
                            type="tel"
                            maxLength={10}
                            value={mobileNum}
                            onChange={(e) => setMobileNum(e.target.value.replace(/\D/g, ""))}
                            placeholder="9876543210"
                            className="flex-grow pl-3 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                            onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                          />
                        </div>
                      </div>

                      {/* Display test mobile numbers */}
                      <div className="bg-white/5 p-2 rounded-lg text-[9.5px] text-slate-400">
                        📞 Pre-registered: <strong className="text-white cursor-pointer" onClick={() => setMobileNum("9876543210")}>98765 43210</strong> (Logs into Devendra Singh) or type any number to generate a new profile.
                      </div>

                      <button
                        onClick={handleSendOtp}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase transition-colors"
                      >
                        Send Verification Code
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Live alert box with simulation code */}
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping flex-shrink-0" />
                        <div>
                          <span>Simulation Code Transmitted to <strong className="font-extrabold text-white">{countryCode} {mobileNum}</strong>!</span>
                          <span className="block mt-0.5 text-emerald-400 font-extrabold">Enter code: <span className="underline decoration-wavy">{simulatedOtp}</span> to verify.</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-amber-400 tracking-wider block">ENTER VERIFICATION OTP CODE</label>
                        <input 
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g. 4321"
                          className="w-full text-center tracking-widest text-lg font-black py-2 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                          onKeyDown={(e) => e.key === "Enter" && handleVerifyOtpAndLogin()}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setOtpSent(false)}
                          className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase"
                        >
                          Change Number
                        </button>
                        <button
                          onClick={handleVerifyOtpAndLogin}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold uppercase"
                        >
                          Verify & Sign In
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Close Button Row */}
              <div className="flex justify-end pt-3 mt-4 border-t border-white/5 text-xs text-slate-500">
                <button
                  onClick={() => {
                    setModalType("none");
                    setError("");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-350 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
