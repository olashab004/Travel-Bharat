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

  // Device-specific local accounts
  const [localGoogleAccounts, setLocalGoogleAccounts] = useState<Array<{ name: string; email: string; id: string }>>([]);
  const [isAddingGoogleAccount, setIsAddingGoogleAccount] = useState(false);
  const [newGoogleEmail, setNewGoogleEmail] = useState("");
  const [newGoogleName, setNewGoogleName] = useState("");

  const [localFacebookAccounts, setLocalFacebookAccounts] = useState<Array<{ name: string; email: string; id: string }>>([]);
  const [isAddingFacebookAccount, setIsAddingFacebookAccount] = useState(false);
  const [newFacebookEmail, setNewFacebookEmail] = useState("");
  const [newFacebookName, setNewFacebookName] = useState("");

  const [localTwitterXAccounts, setLocalTwitterXAccounts] = useState<Array<{ name: string; email: string; id: string }>>([]);
  const [isAddingTwitterXAccount, setIsAddingTwitterXAccount] = useState(false);
  const [newTwitterXEmail, setNewTwitterXEmail] = useState("");
  const [newTwitterXName, setNewTwitterXName] = useState("");

  useEffect(() => {
    // Load local accounts dynamically whenever modalType transitions
    const loadAccounts = (key: string, setter: any) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setter(parsed);
          return parsed;
        } catch (e) {
          setter([]);
        }
      } else {
        setter([]);
      }
      return [];
    };

    const gAccs = loadAccounts("travelbharat_local_google_accounts", setLocalGoogleAccounts);
    const fbAccs = loadAccounts("travelbharat_local_facebook_accounts", setLocalFacebookAccounts);
    const twAccs = loadAccounts("travelbharat_local_twitterx_accounts", setLocalTwitterXAccounts);

    if (modalType === "google") {
      setIsAddingGoogleAccount(gAccs.length === 0);
      setNewGoogleEmail("");
      setNewGoogleName("");
    } else if (modalType === "facebook") {
      setIsAddingFacebookAccount(fbAccs.length === 0);
      setNewFacebookEmail("");
      setNewFacebookName("");
    } else if (modalType === "twitterx") {
      setIsAddingTwitterXAccount(twAccs.length === 0);
      setNewTwitterXEmail("");
      setNewTwitterXName("");
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

  // Finalize signup creation (directly without OTP)
  const handleSignupSubmit = async () => {
    setError("");
    const cleanEmail = form.email.trim().toLowerCase();
    const exists = firebaseUsersList.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      setError("This email address is already registered. Please go to the 'Sign In' tab instead.");
      return;
    }

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
      // Save authenticated user to Firestore Users database directly
      await setDoc(doc(db, "users", newUser.id), newUser);
      setModalType("none");
      onComplete(newUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${newUser.id}`);
      setError("Failed to record profile in Database. Please try again.");
    }
  };

  // Handle direct local email login (directly without OTP)
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

    const cleanEmail = loginEmail.trim().toLowerCase();
    const existing = firebaseUsersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setError(`No registered TravelBharat account was found for email "${cleanEmail}". Enter a registered email or switch to the "Register & Onboard" tab to create your profile first.`);
      return;
    }

    const targetUser: TravelClient = { ...existing, loginMethod: "Email" };

    try {
      setError("");
      setModalType("none");
      onComplete(targetUser);
    } catch (e) {
      console.error("Direct login failed", e);
      setError("Failed to sign in. Please try again.");
    }
  };

  // Handle Real Google Authenticator Popup
  const handleRealGoogleLogin = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user) return;

      const userEmail = (user.email || "").toLowerCase();
      const match = firebaseUsersList.find(u => u.email.toLowerCase() === userEmail);

      if (onboardMode === "login" && !match) {
        setError(`Account not found: "${userEmail}" is not registered. Please switch to the "Register & Onboard" tab to create your personalized profile first.`);
        return;
      }

      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "Google"
      } : {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Google Traveler",
        email: user.email || "",
        interest: form.interest || "All",
        budget: form.budget || "Comfort",
        companion: form.companion || "Solo Traveller",
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
      setModalType("google");
      setError("");
    }
  };

  // Handle Simulated Google Auth Selection
  const handleGoogleAutoLogin = async (userName: string, userEmail: string) => {
    try {
      setError("");
      const cleanEmail = userEmail.trim().toLowerCase();
      const match = firebaseUsersList.find(u => u.email.toLowerCase() === cleanEmail);

      if (onboardMode === "login" && !match) {
        setError(`No registered TravelBharat account was found for Google email "${cleanEmail}". Enter a registered email or switch to "Register & Onboard" tab to create a new profile.`);
        return;
      }

      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "Google"
      } : {
        id: "usr-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "-") + "-" + Date.now(),
        name: userName.trim(),
        email: cleanEmail,
        interest: form.interest || "All",
        budget: form.budget || "Comfort",
        companion: form.companion || "Solo Traveller",
        loginMethod: "Google",
        createdAt: new Date().toISOString()
      };

      // Store in verified device local accounts so users see their own accounts next time on this device
      try {
        const stored = localStorage.getItem("travelbharat_local_google_accounts");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((acc: any) => acc.email.toLowerCase() === cleanEmail)) {
          list.push({ name: userName.trim(), email: cleanEmail, id: loggedUser.id });
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

  // Handle Facebook Auth Selection
  const handleFacebookAutoLogin = async (userName: string, userEmail: string) => {
    try {
      setError("");
      const cleanEmail = userEmail.trim().toLowerCase();
      const match = firebaseUsersList.find(u => u.email.toLowerCase() === cleanEmail);

      if (onboardMode === "login" && !match) {
        setError(`No registered TravelBharat account was found for Facebook email "${cleanEmail}". Enter a registered email or register under "Register & Onboard".`);
        return;
      }

      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "Facebook"
      } : {
        id: "usr-fb-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "-") + "-" + Date.now(),
        name: userName.trim(),
        email: cleanEmail,
        interest: form.interest || "All",
        budget: form.budget || "Comfort",
        companion: form.companion || "Solo Traveller",
        loginMethod: "Facebook",
        createdAt: new Date().toISOString()
      };

      // Store in verified device local accounts so users see their own accounts next time on this device
      try {
        const stored = localStorage.getItem("travelbharat_local_facebook_accounts");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((acc: any) => acc.email.toLowerCase() === cleanEmail)) {
          list.push({ name: userName.trim(), email: cleanEmail, id: loggedUser.id });
          localStorage.setItem("travelbharat_local_facebook_accounts", JSON.stringify(list));
        }
      } catch (e) {
        console.error("Local account save failed", e);
      }

      await setDoc(doc(db, "users", loggedUser.id), loggedUser);
      setModalType("none");
      onComplete(loggedUser);
    } catch (e: any) {
      console.error("Facebook login failed: ", e);
      setError(`Facebook Sign In failed: ${e.message || e}`);
    }
  };

  // Handle Twitter/X Auth Selection
  const handleTwitterXAutoLogin = async (userName: string, userEmail: string) => {
    try {
      setError("");
      const cleanEmail = userEmail.trim().toLowerCase();
      const match = firebaseUsersList.find(u => u.email.toLowerCase() === cleanEmail);

      if (onboardMode === "login" && !match) {
        setError(`No registered TravelBharat account was found for Twitter/X email "${cleanEmail}". Enter a registered email or register under "Register & Onboard".`);
        return;
      }

      const loggedUser: TravelClient = match ? {
        ...match,
        loginMethod: "TwitterX"
      } : {
        id: "usr-tw-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "-") + "-" + Date.now(),
        name: userName.trim(),
        email: cleanEmail,
        interest: form.interest || "All",
        budget: form.budget || "Comfort",
        companion: form.companion || "Solo Traveller",
        loginMethod: "TwitterX",
        createdAt: new Date().toISOString()
      };

      // Store in verified device local accounts so users see their own accounts next time on this device
      try {
        const stored = localStorage.getItem("travelbharat_local_twitterx_accounts");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((acc: any) => acc.email.toLowerCase() === cleanEmail)) {
          list.push({ name: userName.trim(), email: cleanEmail, id: loggedUser.id });
          localStorage.setItem("travelbharat_local_twitterx_accounts", JSON.stringify(list));
        }
      } catch (e) {
        console.error("Local account save failed", e);
      }

      await setDoc(doc(db, "users", loggedUser.id), loggedUser);
      setModalType("none");
      onComplete(loggedUser);
    } catch (e: any) {
      console.error("TwitterX login failed: ", e);
      setError(`Twitter/X Sign In failed: ${e.message || e}`);
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

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 mb-6 relative z-10">
          <button
            onClick={() => {
              setOnboardMode("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              onboardMode === "login" 
                ? "text-white bg-gradient-to-r from-amber-500/20 to-orange-500/25 border border-amber-500/30" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => {
              setOnboardMode("signup");
              setStep(1);
              setError("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              onboardMode === "signup" 
                ? "text-white bg-gradient-to-r from-amber-500/20 to-orange-500/25 border border-amber-500/30" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            Register & Onboard
          </button>
        </div>

        {/* Form area */}
        <div className="relative min-h-[230px] flex flex-col justify-center">
          {onboardMode === "login" ? (
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
                  onClick={() => {
                    setError("");
                    setModalType("facebook");
                  }}
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
                  onClick={() => {
                    setError("");
                    setModalType("twitterx");
                  }}
                  className="w-full flex items-center justify-between py-3.5 px-5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 hover:border-slate-400/45 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-black/20 group active:scale-[0.98]"
                  title="Sign In with Twitter/X"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg bg-white/5 w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">𝕏</span>
                    <span className="tracking-wide text-slate-200">Continue with Twitter/X</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">or registered email</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="space-y-2.5">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="Enter registered email address..."
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-400/35 transition-all font-medium"
                    />
                  </div>
                  <button
                    onClick={handleEmailLogin}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Direct Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ONBOARDING REGISTER FORM STEP BY STEP */
            <div className="py-1">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white text-center mb-1">Step 1: Create Profile</h4>
                    <p className="text-xs text-slate-400 text-center leading-normal max-w-xs mx-auto">
                      Provide your name and preferred email to initialize custom travel recommendations.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="e.g. Priyanshu Sharma"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-400/40 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          placeholder="e.g. wanderer@domain.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 text-white placeholder-slate-600 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-400/40 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (validateStep1()) {
                          const exists = firebaseUsersList.some(u => u.email.toLowerCase() === form.email.trim().toLowerCase());
                          if (exists) {
                            setError("This email address is already registered. Please go to the 'Sign In' tab instead.");
                            return;
                          }
                          setStep(2);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-lg active:scale-[0.98] mt-4"
                    >
                      Continue & Select Preferences
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white text-center mb-1">Step 2: Personalize Preferences</h4>
                    <p className="text-xs text-slate-400 text-center leading-normal max-w-xs mx-auto">
                      Choose preferences so we can customize historical sights and itineraries for you.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Travel Interest</span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Heritage", "Nature", "Religious", "Adventure", "All"].map((interest) => (
                          <button
                            key={interest}
                            onClick={() => setForm({ ...form, interest })}
                            className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                              form.interest === interest
                                ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-inner"
                                : "bg-slate-950/30 text-slate-400 border-white/5 hover:border-white/10"
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Level</span>
                        <div className="space-y-1.5">
                          {["Eco-friendly", "Comfort", "Luxury"].map((budget) => (
                            <button
                              key={budget}
                              onClick={() => setForm({ ...form, budget })}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                                form.budget === budget
                                  ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-inner"
                                  : "bg-slate-950/30 text-slate-400 border-white/5 hover:border-white/10"
                              }`}
                            >
                              {budget}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travel Group</span>
                        <div className="space-y-1.5">
                          {["Solo Traveller", "Couple", "Family", "Group Tour"].map((companion) => (
                            <button
                              key={companion}
                              onClick={() => setForm({ ...form, companion })}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                                form.companion === companion
                                  ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-inner"
                                  : "bg-slate-950/30 text-slate-400 border-white/5 hover:border-white/10"
                              }`}
                            >
                              {companion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-3">
                      <button
                        onClick={() => { setError(""); setStep(1); }}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-2xl transition-all cursor-pointer border border-white/5"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => { setError(""); setStep(3); }}
                        className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                      >
                        Next: Secure ID Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white text-center mb-1">Step 3: Secure Your Profile</h4>
                    <p className="text-xs text-slate-400 text-center leading-normal max-w-sm mx-auto">
                      Verify or link your social profile to complete the creation of your account <span className="text-amber-400">"{form.name}"</span>. Next time, you can log in instantly using this provider.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={async () => {
                        setNewGoogleName(form.name);
                        setNewGoogleEmail(form.email);
                        setModalType("google");
                      }}
                      className="w-full flex items-center justify-between py-3 px-5 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-amber-600/10 hover:from-red-600/15 hover:via-orange-600/15 hover:to-amber-600/15 border border-white/10 hover:border-amber-500/40 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer group shadow-lg shadow-black/10 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center">🌐</span>
                        <span className="tracking-wide">Link Google Account</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={async () => {
                        setNewFacebookName(form.name);
                        setNewFacebookEmail(form.email);
                        setModalType("facebook");
                      }}
                      className="w-full flex items-center justify-between py-3 px-5 bg-blue-600/10 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/40 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer group shadow-lg shadow-black/10 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-blue-500/10 w-7 h-7 rounded-lg flex items-center justify-center">👥</span>
                        <span className="tracking-wide text-slate-200">Link Facebook Secure</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={async () => {
                        setNewTwitterXName(form.name);
                        setNewTwitterXEmail(form.email);
                        setModalType("twitterx");
                      }}
                      className="w-full flex items-center justify-between py-3 px-5 bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 hover:border-slate-400/40 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer group shadow-lg shadow-black/10 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-white/5 w-7 h-7 rounded-lg flex items-center justify-center">𝕏</span>
                        <span className="tracking-wide text-slate-200">Link Twitter/X Secure</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-white/5"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-slate-600 uppercase tracking-widest font-bold">or use email registration</span>
                      <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    <button
                      onClick={handleSignupSubmit}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/25 border border-amber-500/30 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-orange-500/40 text-slate-200 hover:text-amber-300 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                    >
                      Complete Email Registration
                    </button>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={() => { setError(""); setStep(2); }}
                        className="w-full py-2 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Back to preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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

            {modalType === "facebook" && (
              /* AUTHENTIC DYNAMIC FACEBOOK SELECTOR MODAL */
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 relative font-sans text-slate-800"
              >
                {/* Facebook Blue Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-black text-2xl font-serif">
                    f
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {isAddingFacebookAccount ? "Sign In" : "Choose your Facebook account"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">to continue to <span className="font-semibold text-blue-600">TravelBharat</span></p>
                </div>

                {isAddingFacebookAccount ? (
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Facebook Profile Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Priyanshu Sharma"
                        value={newFacebookName}
                        onChange={(e) => setNewFacebookName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Facebook Email / Username</label>
                      <input 
                        type="email"
                        placeholder="e.g. priyanshu@facebook.com"
                        value={newFacebookEmail}
                        onChange={(e) => setNewFacebookEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newFacebookName.trim() || !newFacebookEmail.trim()) {
                          setError("Please provide both Name and Email to verify Facebook login.");
                          return;
                        }
                        if (!newFacebookEmail.includes("@")) {
                          setError("Invalid email structure specified.");
                          return;
                        }
                        handleFacebookAutoLogin(newFacebookName.trim(), newFacebookEmail.trim());
                      }}
                      className="w-full py-3 bg-[#1877F2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      Verify Facebook Login
                    </button>

                    {localFacebookAccounts.length > 0 && (
                      <button
                        onClick={() => setIsAddingFacebookAccount(false)}
                        className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-bold py-1 cursor-pointer hover:underline"
                      >
                        Back to Saved Accounts
                      </button>
                    )}
                  </div>
                ) : (
                  /* Dynamic Facebook lists */
                  <div className="space-y-2 mb-6">
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {localFacebookAccounts.map((acc) => {
                        const initial = acc.name.charAt(0).toUpperCase();
                        return (
                          <button
                            key={acc.email}
                            onClick={() => handleFacebookAutoLogin(acc.name, acc.email)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all text-left cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white font-extrabold text-base flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                              {initial}
                            </div>
                            <div className="min-w-0 flex-grow">
                              <p className="text-sm font-semibold text-slate-800 leading-tight">{acc.name}</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{acc.email}</p>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center p-0.5 group-hover:border-blue-500">
                              <div className="w-2 h-2 rounded-full bg-[#1877F2] scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setIsAddingFacebookAccount(true)}
                        className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-bold py-2 mt-1 cursor-pointer hover:underline"
                      >
                        Connect another profile
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 leading-relaxed text-center px-1 mb-4">
                  To continue, Facebook secure linker will sync your profile email and permissions with TravelBharat. Review our Privacy Policy.
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

            {modalType === "twitterx" && (
              /* AUTHENTIC 𝕏 SELECTOR MODAL */
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative font-sans text-white"
              >
                {/* 𝕏 White minimalist logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">
                    𝕏
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black tracking-tight text-white">
                    {isAddingTwitterXAccount ? "Sign in to 𝕏" : "Choose 𝕏 Profile"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">to authorize <span className="font-semibold text-amber-500">TravelBharat</span></p>
                </div>

                {isAddingTwitterXAccount ? (
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Priyanshu Sharma"
                        value={newTwitterXName}
                        onChange={(e) => setNewTwitterXName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email"
                        placeholder="e.g. priyandhu@x.com"
                        value={newTwitterXEmail}
                        onChange={(e) => setNewTwitterXEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all font-medium"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newTwitterXName.trim() || !newTwitterXEmail.trim()) {
                          setError("Please provide both Name and Email to verify Twitter/X auth.");
                          return;
                        }
                        if (!newTwitterXEmail.includes("@")) {
                          setError("Invalid email structure specified.");
                          return;
                        }
                        handleTwitterXAutoLogin(newTwitterXName.trim(), newTwitterXEmail.trim());
                      }}
                      className="w-full py-3 bg-white hover:bg-slate-100 text-black rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      Sign In with 𝕏 Secure
                    </button>

                    {localTwitterXAccounts.length > 0 && (
                      <button
                        onClick={() => setIsAddingTwitterXAccount(false)}
                        className="w-full text-center text-xs text-white hover:text-slate-300 font-bold py-1 cursor-pointer hover:underline"
                      >
                        Back to Saved Profiles
                      </button>
                    )}
                  </div>
                ) : (
                  /* Dynamic Twitter/X list */
                  <div className="space-y-2 mb-6">
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {localTwitterXAccounts.map((acc) => {
                        const initial = acc.name.charAt(0).toUpperCase();
                        return (
                          <button
                            key={acc.email}
                            onClick={() => handleTwitterXAutoLogin(acc.name, acc.email)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 border border-white/5 rounded-2xl transition-all text-left cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-white text-black font-extrabold text-base flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                              {initial}
                            </div>
                            <div className="min-w-0 flex-grow">
                              <p className="text-sm font-semibold text-white leading-tight">{acc.name}</p>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{acc.email}</p>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center p-0.5 group-hover:border-white">
                              <div className="w-2 h-2 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <button
                        onClick={() => setIsAddingTwitterXAccount(true)}
                        className="w-full text-center text-xs text-slate-300 hover:text-white font-bold py-2 mt-1 cursor-pointer hover:underline"
                      >
                        Link another handle
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 leading-relaxed text-center px-1 mb-4">
                  To continue, authorize TravelBharat to access public profile info and secure verification hooks. Review Privacy Guidelines.
                </div>

                <div className="flex justify-end pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      setModalType("none");
                      setError("");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Modals removed for direct login experience */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
