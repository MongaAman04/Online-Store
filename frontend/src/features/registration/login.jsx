import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Auth, Firedb } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import Loader from "../../componets/loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Timestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

const Login = () => {
    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userLogin, setUserLogin] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });


    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(Auth, provider);
            const googleUser = result.user;

            const q = query(
                collection(Firedb, "user"),
                where("uid", "==", googleUser.uid)
            );

            const unsubscribe = onSnapshot(q, async (snapshot) => {
                let user;

                if (snapshot.empty) {
                    user = {
                        name: googleUser.displayName,
                        email: googleUser.email,
                        phone: googleUser.phoneNumber || "",
                        uid: googleUser.uid,
                        role: "user",
                        photoURL: googleUser.photoURL,
                        authProvider: "google",
                        time: Timestamp.now(),
                        date: new Date().toLocaleString("en-US", {
                            month: "short", day: "2-digit", year: "numeric"
                        }),
                    };
                    await setDoc(doc(Firedb, "user", googleUser.uid), user);
                } else {
                    snapshot.forEach(d => user = d.data());
                }

                Cookies.set("hos_users", JSON.stringify(user), { expires: 15 });
                toast.success(`Welcome, ${user.name}! `);
                setLoading(false);
                unsubscribe();

                if (user.role === "admin") {
                    navigate("/profile/admin");
                } else {
                    navigate("/products");
                }
            });

        } catch (error) {
            console.error(error);
            setLoading(false);
            if (error.code === "auth/popup-closed-by-user") {
                toast.error("Sign in cancelled.");
            } else if (error.code === "auth/popup-blocked") {
                toast.error("Popup blocked. Please allow popups for this site.");
            } else {
                toast.error("Google sign in failed. Try again.");
            }
        }
    };

    const validate = () => {
        let newErrors = { email: "", password: "" };
        let isValid = true;
        if (!userLogin.email.trim()) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userLogin.email)) {
            newErrors.email = "Enter a valid email address.";
            isValid = false;
        }
        if (!userLogin.password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (userLogin.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const userLoginFunction = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(Auth, userLogin.email, userLogin.password);
            const q = query(collection(Firedb, "user"), where("uid", "==", users.user.uid));
            const data = onSnapshot(q, (QuerySnapshot) => {
                let user;
                QuerySnapshot.forEach(doc => user = doc.data());
                Cookies.set("hos_users", JSON.stringify(user), { expires: 15 });
                setUserLogin({ email: "", password: "" });
                setErrors({ email: "", password: "" });
                toast.success(`Welcome Back ${user.name}!`);
                setLoading(false);
                if (user.role === "user") {
                    navigate("/products");
                } else {
                    navigate("/profile/admin");
                }
            });
            return () => data;
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setErrors(prev => ({ ...prev, email: "No account found with this email." }));
            } else if (error.code === "auth/wrong-password") {
                setErrors(prev => ({ ...prev, password: "Incorrect password. Try again." }));
            } else if (error.code === "auth/too-many-requests") {
                toast.error("Too many failed attempts. Please try again later.");
            } else if (error.code === "auth/invalid-credential") {
                toast.error("Email or Password is incorrect.");
            } else {
                toast.error("Login failed. Please try again.");
            }
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2] px-4 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-rose-200 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-pink-200 rounded-full blur-[120px] opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-rose-200/50 border border-white">

                    {/* Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif italic font-bold text-gray-900 mb-2">
                            PKS<span className="text-rose-500">.</span>
                        </h1>
                        <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-bold">
                            Welcome Back, Muse
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-sm text-gray-700 hover:border-rose-300 hover:shadow-md transition-all shadow-sm mb-2"
                    >
                        {/* Google SVG icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </motion.button>

                    {/* ✅ Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-rose-100" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            or sign in with email
                        </span>
                        <div className="flex-1 h-px bg-rose-100" />
                    </div>

                    {/* Email + Password */}
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 mb-2 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={userLogin.email}
                                onChange={(e) => {
                                    setUserLogin({ ...userLogin, email: e.target.value });
                                    setErrors(prev => ({ ...prev, email: "" }));
                                }}
                                className={`w-full bg-white/50 border px-4 py-3 rounded-2xl outline-none focus:ring-1 transition-all placeholder-rose-200 text-gray-700
                                    ${errors.email
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-rose-100 focus:border-rose-400 focus:ring-rose-400"
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1 mb-2 block">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={userLogin.password}
                                onChange={(e) => {
                                    setUserLogin({ ...userLogin, password: e.target.value });
                                    setErrors(prev => ({ ...prev, password: "" }));
                                }}
                                className={`w-full bg-white/50 border px-4 py-3 rounded-2xl outline-none focus:ring-1 transition-all placeholder-rose-200 text-gray-700
                                    ${errors.password
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-rose-100 focus:border-rose-400 focus:ring-rose-400"
                                    }`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={userLoginFunction}
                            className="w-full bg-gray-900 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold tracking-widest text-xs transition-colors shadow-lg shadow-gray-200"
                        >
                            SIGN IN
                        </motion.button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-light">
                            Don't have an account?{" "}
                            <Link className="text-rose-500 font-bold hover:underline transition-all" to="/signup">
                                Join the Club
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;