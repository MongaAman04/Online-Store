import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { Auth, Firedb } from "../../config/firebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../../componets/loader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import sample2 from "../../assets/products/sample4.png"
const Signup = () => {
    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignUp, setUserSignUp] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "user"
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    // ✅ Validation function
    const validate = () => {
        let newErrors = { name: "", email: "", password: "", phone: "" };
        let isValid = true;

        if (!userSignUp.name.trim()) {
            newErrors.name = "Full name is required.";
            isValid = false;
        } else if (userSignUp.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters.";
            isValid = false;
        }

        if (!userSignUp.email.trim()) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userSignUp.email)) {
            newErrors.email = "Enter a valid email address.";
            isValid = false;
        }

        if (!userSignUp.password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (userSignUp.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        } else if (!/(?=.*[A-Z])/.test(userSignUp.password)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
            isValid = false;
        } else if (!/(?=.*[0-9])/.test(userSignUp.password)) {
            newErrors.password = "Password must contain at least one number.";
            isValid = false;
        }

        if (!userSignUp.phone.trim()) {
            newErrors.phone = "Phone number is required.";
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(userSignUp.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number.";
            isValid = false;
        } else if (/^(\d)\1{9}$/.test(userSignUp.phone)) {
           
            newErrors.phone = "Enter a valid phone number.";
            isValid = false;
        } else if (["1234567890", "0987654321", "1234512345", "9876543210"].includes(userSignUp.phone)) {
          
            newErrors.phone = "Enter a valid phone number.";
            isValid = false;
        } else if (/^(\d{5})\1$/.test(userSignUp.phone)) {
          
            newErrors.phone = "Enter a valid phone number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const userSignupFunction = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(Auth, userSignUp.email, userSignUp.password);

            const user = {
                name: userSignUp.name,
                email: users.user.email,
                phone: userSignUp.phone,
                uid: users.user.uid,
                role: userSignUp.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            };

            const UserRef = collection(Firedb, "user");
            await addDoc(UserRef, user);
            Cookies.set("users", JSON.stringify(user), { expires: 15 });
            setUserSignUp({ name: "", email: "", password: "", phone: "", role: "user" });
            setErrors({ name: "", email: "", password: "", phone: "" });
            setLoading(false);
            toast.success("Welcome to Store!");
            navigate("/");

        } catch (error) {
            setLoading(false);
            if (error.code === "auth/email-already-in-use") {
                setErrors(prev => ({ ...prev, email: "This email is already registered." }));
            } else if (error.code === "auth/invalid-email") {
                setErrors(prev => ({ ...prev, email: "Invalid email address." }));
            } else if (error.code === "auth/weak-password") {
                setErrors(prev => ({ ...prev, password: "Password is too weak." }));
            } else {
                toast.error("Signup failed. Please try again.");
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">

            {/* Left Side: Editorial Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden md:flex md:w-1/2 bg-rose-50 relative overflow-hidden"
            >
                <img
                    src={sample2}
                    alt="Fashion Lifestyle"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-rose-900/20 backdrop-blur-[2px]" />
                <div className="relative z-10 m-auto text-center p-12">
                    <h2 className="text-white text-5xl font-serif italic mb-4">Step Into Your Power</h2>
                    <p className="text-rose-50 text-sm tracking-[0.2em] uppercase">The Inner Circle Awaits</p>
                </div>
            </motion.div>

            {/* Right Side: Signup Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10">
                        <h1 className="text-3xl font-serif italic text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500 font-light text-sm">Join PKS Luxe for exclusive early access and style updates.</p>
                    </div>

                    <div className="space-y-6">

                        {/* Full Name */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your elegant name"
                                value={userSignUp.name}
                                onChange={(e) => {
                                    setUserSignUp({ ...userSignUp, name: e.target.value });
                                    setErrors(prev => ({ ...prev, name: "" }));
                                }}
                                className={`w-full border-b py-3 outline-none transition-colors bg-transparent placeholder-gray-300
                                    ${errors.name ? "border-red-400" : "border-gray-200 focus:border-rose-400"}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={userSignUp.email}
                                onChange={(e) => {
                                    setUserSignUp({ ...userSignUp, email: e.target.value });
                                    setErrors(prev => ({ ...prev, email: "" }));
                                }}
                                className={`w-full border-b py-3 outline-none transition-colors bg-transparent placeholder-gray-300
                                    ${errors.email ? "border-red-400" : "border-gray-200 focus:border-rose-400"}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={userSignUp.password}
                                onChange={(e) => {
                                    setUserSignUp({ ...userSignUp, password: e.target.value });
                                    setErrors(prev => ({ ...prev, password: "" }));
                                }}
                                className={`w-full border-b py-3 outline-none transition-colors bg-transparent placeholder-gray-300
                                    ${errors.password ? "border-red-400" : "border-gray-200 focus:border-rose-400"}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Phone</label>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                value={userSignUp.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setUserSignUp({ ...userSignUp, phone: val });
                                    setErrors(prev => ({ ...prev, phone: "" }));
                                }}
                                className={`w-full border-b py-3 outline-none transition-colors bg-transparent placeholder-gray-300
                                    ${errors.phone ? "border-red-400" : "border-gray-200 focus:border-rose-400"}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="button"
                            onClick={userSignupFunction}
                            className="w-full bg-gray-900 text-white py-4 rounded-full font-bold tracking-widest text-xs mt-4 hover:bg-rose-600 transition-colors shadow-xl shadow-gray-200"
                        >
                            JOIN THE CLUB
                        </motion.button>
                    </div>

                    <div className="mt-8 text-center text-sm font-light text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-rose-500 font-bold hover:underline">
                            Login here
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;