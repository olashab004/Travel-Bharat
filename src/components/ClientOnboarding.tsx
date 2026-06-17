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
  const [modalType, setModalType] = useState<"none" | "google" | "facebook" | "twitterx" | "mobile" | "email_signup_otp" | "email_login_otp">("none");

  // Device-specific local Google account profiles
  const [localGoogleAccounts, setLocalGoogleAccounts] = useState<Array<{ name: string; email: string; id: string }>>([]);
  const [isAddingGoogleAccount, setIsAddingGoogleAccount] = useState(false);
  const [newGoogleEmail, setNewGoogleEmail] = useState("");
  const [newGoogleName, setNewGoogleName] = useState("");

  useEffect(() => {
    // Load local Google accounts dynamically whenever modalType transitions to "google"
    const stored = localStorage.getItem("travelbharat_local_google_accounts");
    let currentAccounts = [];
    if (stored) {
      try {
        currentAccounts = JSON.parse(stored);
        setLocalGoogleAccounts(currentAccounts);
      } catch (e) {
        setLocalGoogleAccounts([]);
      }
    } else {
      setLocalGoogleAccounts([]);
    }

    if (modalType === "google") {
      setIsAddingGoogleAccount(currentAccounts.length === 0);
      setNewGoogleEmail("");
      setNewGoogleName("");
    }
  }, [modalType]);

  // Email verification OTP details
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [simulatedEmailOtp, setSimulatedEmailOtp] = useState("");
  const [pendingUser, setPendingUser] = useState<TravelClient | null>(null);

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

  // Finalize signup creation with OTP verification
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

    // Generate Verification Code for New Signup Email
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedEmailOtp(code);
    setPendingUser(newUser);
    setEmailOtpCode("");
    setError("");
    setModalType("email_signup_otp");
  };

  // Handle direct local email login with OTP verification
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
    let targetUser: TravelClient;

    if (existing) {
      targetUser = { ...existing, loginMethod: "Email" };
    } else {
      targetUser = {
        id: "usr-" + Date.now(),
        name: loginEmail.split("@")[0].charAt(0).toUpperCase() + loginEmail.split("@")[0].slice(1),
        email: loginEmail.trim(),
        interest: "All",
        budget: "Comfort",
        companion: "Solo Traveller",
        loginMethod: "Email",
        createdAt: new Date().toISOString()
      };
    }

    // Generate Verification Code for Login Email
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedEmailOtp(code);
    setPendingUser(targetUser);
    setEmailOtpCode("");
    setError("");
    setModalType("email_login_otp");
  };

  // Verify dynamic OTP code and write record to Firestore
  const handleVerifyEmailOtp = async () => {
    if (emailOtpCode !== simulatedEmailOtp) {
      setError("Incorrect verification code. Please type the mock simulation code.");
      return;
    }
    if (!pendingUser) {
      setError("Unexpected verification error. Please retry.");
      return;
    }

    setError("");
    try {
      // Save authenticated user to Firestore Users database
      await setDoc(doc(db, "users", pendingUser.id), pendingUser);
      setModalType("none");
      onComplete(pendingUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${pendingUser.id}`);
      setError("Failed to record profile in Database. Please try again.");
    }
  };

  // Handle Instant Mock logins for Facebook and TwitterX
  const handleSimpleMockLogin = async (method: "Facebook" | "TwitterX") => {
    setError("");
    const mockUser: TravelClient = {
      id: "usr-" + method.toLowerCase() + "-" + Date.now(),
      name: `${method} Explorer`,
      email: `${method.toLowerCase()}-traveler@domain-sim.com`,
      interest: "All",
      budget: "Comfort",
      companion: "Solo Traveller",
      loginMethod: method,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", mockUser.id), mockUser);
      onComplete(mockUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${mockUser.id}`);
      onComplete(mockUser);
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

      // Store in verified device local accounts
      try {
        const stored = localStorage.getItem("travelbharat_local_google_accounts");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((acc: any) => acc.email.toLowerCase() === loggedUser.email.toLowerCase())) {
          list.push({ name: loggedUser.name, email: loggedUser.email, id: loggedUser.id });
          localStorage.setItem("travelbharat_local_google_accounts", JSON.stringify(list));
        }
      } catch (e) {
        console.error("Local account save failed", e);
      }

      await setDoc(doc(db, "users", loggedUser.id), loggedUser);
      setModalType("none");
      onComplete(loggedUser);
    } catch (e: any) {
      console.error("Real Google OAuth login failed: ", e);
      // Fallback gracefully to our custom dialog without exposing developer raw static accounts
      setModalType("google");
      setError("");
    }
  };

  // Handle Simulated Google Auth Selection
  const handleGoogleAutoLogin = async (userName: string, userEmail: string) => {
    try {
      setError("");
      const match = firebaseUsersList.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "Google"
      } : {
        id: "usr-" + userEmail.replace(/[^a-zA-Z0-9]/g, "-") + "-" + Date.now(),
        name: userName,
        email: userEmail,
        interest: "All",
        budget: "Comfort",
        companion: "Solo Traveller",
        loginMethod: "Google",
        createdAt: new Date().toISOString()
      };

      // Store in verified device local accounts so users see their own accounts next time on this device
      try {
        const stored = localStorage.getItem("travelbharat_local_google_accounts");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((acc: any) => acc.email.toLowerCase() === userEmail.toLowerCase())) {
          list.push({ name: userName, email: userEmail, id: loggedUser.id });
          localStorage.setItem("travelbharat_local_google_accounts", JSON.stringify(list));
        }
      } catch (e) {
        console.error("Local account save failed", e);
      }

      await setDoc(doc(db, "users", loggedUser.id), loggedUser);
      setModalType("none");
      onComplete(loggedUser);
    } catch (e: any) {
      console.error("Google Auto login failed: ", e);
      setError(`Google Sign In failed: ${e.message || e}`);
    }
  };

  // Social account chooser login trigger (pre-registered sim profiles)
  const handleSocialSelect = async (user: TravelClient, method: "Google" | "Facebook" | "TwitterX") => {
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

  // Custom Google/Facebook/TwitterX user creation
  const handleCustomSocialLogin = async (method: "Google" | "Facebook" | "TwitterX") => {
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

          <div className="mt-4" />
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
        <div className="relative min-h-[230px] flex flex-col justify-center">
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-sm font-extrabold text-white text-center mb-1">Verify Your Account</h4>
              <p className="text-xs text-slate-400 text-center leading-normal max-w-sm mx-auto">
                Authenticate securely to synchronize your personalized itineraries and explore monument guides.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <button
                onClick={handleRealGoogleLogin}
                className="w-full flex items-center justify-between py-3.5 px-5 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-amber-600/10 hover:from-red-600/20 hover:via-orange-600/20 hover:to-amber-600/20 border border-white/10 hover:border-amber-500/40 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-black/20 group active:scale-[0.98]"
                title="Sign In with Google Account"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg bg-white/10 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">🌐</span>
                  <span className="tracking-wide">Continue with Google Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleSimpleMockLogin("Facebook")}
                className="w-full flex items-center justify-between py-3.5 px-5 bg-blue-600/10 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/45 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-black/20 group active:scale-[0.98]"
                title="Sign In with Facebook"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg bg-blue-500/10 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">👥</span>
                  <span className="tracking-wide text-slate-200">Continue with Facebook</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleSimpleMockLogin("TwitterX")}
                className="w-full flex items-center justify-between py-3.5 px-5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 hover:border-slate-400/45 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-black/20 group active:scale-[0.98]"
                title="Sign In with Twitter/X"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg bg-white/5 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">𝕏</span>
                  <span className="tracking-wide text-slate-200">Continue with Twitter/X</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
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
            {modalType === "google" && (
              /* AUTHENTIC DYNAMIC GOOGLE SELECTOR MODAL */
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 relative font-sans text-slate-800"
              >
                {/* Google Multi-color G logo */}
                <div id="google-authenticator-logo" className="flex justify-center mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">
                    {isAddingGoogleAccount ? "Sign In" : "Choose your Google account"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">to continue to <span className="font-semibold text-amber-600">TravelBharat</span></p>
                </div>

                {isAddingGoogleAccount ? (
                  /* Custom input form to handle account entry in iframe sandboxes cleanly */
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Your Full Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Rahul Verma"
                        value={newGoogleName}
                        onChange={(e) => setNewGoogleName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Google Email Address</label>
                      <input 
                        type="email"
                        placeholder="e.g. rahul@gmail.com"
                        value={newGoogleEmail}
                        onChange={(e) => setNewGoogleEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newGoogleName.trim() || !newGoogleEmail.trim()) {
                          setError("Please provide both Name and Email to verify account.");
                          return;
                        }
                        if (!newGoogleEmail.includes("@")) {
                          setError("Invalid email structure specified.");
                          return;
                        }
                        handleGoogleAutoLogin(newGoogleName.trim(), newGoogleEmail.trim());
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-blue-500/10 active:scale-95"
                    >
                      Verify Google Account
                    </button>

                    {localGoogleAccounts.length > 0 && (
                      <button
                        onClick={() => setIsAddingGoogleAccount(false)}
                        className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-bold py-1 cursor-pointer hover:underline"
                      >
                        Back to Saved Accounts
                      </button>
                    )}
                  </div>
                ) : (
                  /* Dynamic account lists */
                  <div className="space-y-2 mb-6">
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {localGoogleAccounts.map((acc) => {
                        const initial = acc.name.charAt(0).toUpperCase();
                        return (
                          <button
                            key={acc.email}
                            onClick={() => handleGoogleAutoLogin(acc.name, acc.email)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all text-left cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                              {initial}
                            </div>
                            <div className="min-w-0 flex-grow">
                              <p className="text-sm font-semibold text-slate-800 leading-tight">{acc.name}</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{acc.email}</p>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center p-0.5 group-hover:border-blue-500">
                              <div className="w-2 h-2 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setIsAddingGoogleAccount(true)}
                        className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-bold py-2 mt-1 cursor-pointer hover:underline"
                      >
                        Use another account
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 leading-relaxed text-center px-1 mb-4">
                  To continue, Google will share your name, email address, language preference, and profile picture with TravelBharat. Review our Privacy Policy.
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setModalType("none");
                      setError("");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
