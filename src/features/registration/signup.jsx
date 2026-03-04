import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { Auth, Firedb } from "../../firebase/firebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../../componets/loader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";

const Signup = () => {
    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignUp, setUserSignUp] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const userSignupFunction = async () => {
        if (userSignUp.name === "" || userSignUp.email === "" || userSignUp.password === "") {
            return alert("Please fill in your details to join our inner circle.");
        }
        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(Auth, userSignUp.email, userSignUp.password);

            const user = {
                name: userSignUp.name,
                email: users.user.email,
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

            setUserSignUp({ name: "", email: "", password: "", role: "user" });
            setLoading(false);
            alert("Welcome to PKS Luxe!");
            navigate("/login");
        } catch (error) {
            setLoading(false);
            console.error(error);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {loading && <Loader />}

            {/* Left Side: Editorial Image */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden md:flex md:w-1/2 bg-rose-50 relative overflow-hidden"
            >
                <img 
                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop" 
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

                    <form className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your elegant name"
                                value={userSignUp.name}
                                onChange={(e) => setUserSignUp({ ...userSignUp, name: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={userSignUp.email}
                                onChange={(e) => setUserSignUp({ ...userSignUp, email: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={userSignUp.password}
                                onChange={(e) => setUserSignUp({ ...userSignUp, password: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300"
                            />
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
                    </form>

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