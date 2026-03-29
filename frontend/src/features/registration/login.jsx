import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../context/mycontext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth, Firedb } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Loader from "../../componets/loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Login = () => {
  const context = useContext(MyContext);
  const { loading, setLoading } = context;
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: ""
  });

 
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });


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
      try {
        const q = query(
          collection(Firedb, "user"),
          where("uid", "==", users.user.uid)
        );
        const data = onSnapshot(q, (QuerySnapshot) => {
          let user;
          QuerySnapshot.forEach(doc => user = doc.data());
          Cookies.set("users", JSON.stringify(user), { expires: 15 });
          setUserLogin({ email: "", password: "" });
          setErrors({ email: "", password: "" }); 
          toast.success(`Welcome Back ${user.name}!`);
          setLoading(false);
          if (user.role === "user") {
            navigate(`/products`);
          } else {
            navigate(`/profile/admin`);
          }
        });
        return () => data;
      } catch (error) {
        toast.error("Failed to fetch user data.");
        setLoading(false);
      }
    } catch (error) {
      
      if (error.code === "auth/user-not-found") {
        setErrors(prev => ({ ...prev, email: "No account found with this email." }));
      } else if (error.code === "auth/wrong-password") {
        setErrors(prev => ({ ...prev, password: "Incorrect password. Try again." }));
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid credentials. Please check and try again.");
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

          {/* Brand Logo & Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif italic font-bold text-gray-900 mb-2">PKS<span className="text-rose-500">.</span></h1>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400 font-bold">Welcome Back, Muse</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
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
                  setErrors(prev => ({ ...prev, email: "" })); // ✅ Clear error on type
                }}
                className={`w-full bg-white/50 border px-4 py-3 rounded-2xl outline-none focus:ring-1 transition-all placeholder-rose-200 text-gray-700
                  ${errors.email 
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"      // ✅ Red border on error
                    : "border-rose-100 focus:border-rose-400 focus:ring-rose-400"   // Normal border
                  }`}
              />
              {/* ✅ Inline error message */}
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
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
                  setErrors(prev => ({ ...prev, password: "" })); // ✅ Clear error on type
                }}
                className={`w-full bg-white/50 border px-4 py-3 rounded-2xl outline-none focus:ring-1 transition-all placeholder-rose-200 text-gray-700
                  ${errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-rose-100 focus:border-rose-400 focus:ring-rose-400"
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
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

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-light">
              Don't have an account?{' '}
              <Link className="text-rose-500 font-bold hover:underline transition-all" to={'/signup'}>
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