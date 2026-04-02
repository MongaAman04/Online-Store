import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { User } from "lucide-react";

export const Nav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("hos_users") || "null");

  // Website-only styles
  const navLinkStyles = ({ isActive }) =>
    `relative py-1 transition-all duration-300 ${isActive ? "text-rose-600 font-semibold" : "text-gray-600 hover:text-rose-400"
    }`;

  return (
    <nav className="w-full bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-6">

        {/* --- LOGO (Shared) --- */}
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <h1 className="text-2xl md:text-3xl font-serif tracking-tighter italic font-bold text-gray-900">
              House of Sole<span className="text-rose-400 not-italic">.</span>
            </h1>
          </motion.div>
        </Link>

      {/* Navigation Links with Staggered Fade-in */}
      <ul className="hidden md:flex gap-10 font-light uppercase text-xs tracking-[0.2em]">
        {["Home", "Products", "About", "Contact"].map((item) => (
          <motion.li key={item} variants={itemVariants}>
            <NavLink
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={navLinkStyles}
            >
              {item}
              {/* Animated underline for active/hover state */}
              <motion.div className="absolute bottom-0 left-0 w-0 h-[1px] bg-rose-400" whileHover={{ width: "100%" }} />
            </NavLink>
          </motion.li>
        ))}
      </ul>
      {
        !user ? <div className="flex justify-center items-center">
          <Link to={`/signup`}>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(244, 63, 94, 0.1), 0 8px 10px -6px rgba(244, 63, 94, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="group relative flex items-center gap-3 bg-rose-500 border border-rose-100 px-8 py-3 rounded-full transition-all duration-300 hover:bg-rose-600"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white group-hover:text-white transition-colors">
               Login/Sign up
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-rose-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
           </Link>
        </div>
          :
          <div className="flex items-center gap-6 text-gray-700">
            <motion.div whileHover={{ scale: 1.2, color: "#e11d48" }} className="cursor-pointer">
              <NavLink to="/cart" className="relative">
                <FaShoppingCart size={20} />
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </NavLink>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <NavLink to={user.role == 'admin' ? '/profile/admin' : '/profile/user'} className="relative group">
               
                <span className="flex items-center justify-center w-12 h-12 bg-rose-50 text-rose-500 rounded-full border border-rose-100 transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-200">
                  <User size={22} strokeWidth={1.5} />
                </span>
              </NavLink>
            </div>
          )}
        </div>

        {/* --- MOBILE USER ACTIONS (Only text, visible on Mobile only) --- */}
        <div className="flex md:hidden items-center gap-4">
          {!user ? (
            <Link to="/signup" className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <Link to="/cart" className="text-gray-600">   <FaShoppingCart size={20} />
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">2</span></Link>
              <span className="text-gray-300">|</span>
              <Link to={user.role === 'admin' ? '/profile/admin' : '/profile/user'} className="text-rose-500"> <span className="flex items-center justify-center w-12 h-12 bg-rose-50 text-rose-500 rounded-full border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                <User size={22} strokeWidth={1.5} />
              </span></Link>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE NAVIGATION LINKS (Visible on Mobile only, no icons) --- */}
      <div className="md:hidden border-t border-gray-50 overflow-x-auto no-scrollbar">
        <ul className="flex justify-between items-center px-6 py-3 gap-6">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <li key={item} className="flex-shrink-0">
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-[10px] uppercase tracking-[0.15em] ${isActive ? "text-rose-600 border-b border-rose-600" : "text-gray-500"}`
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};