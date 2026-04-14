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
        <a href="/">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <h1 className="text-2xl md:text-3xl font-serif tracking-tighter italic font-bold text-gray-900">
              House of Sole<span className="text-rose-400 not-italic"></span>
            </h1>
          </motion.div>
        </a>

        {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
        <ul className="hidden md:flex gap-10 font-light uppercase text-xs tracking-[0.2em]">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <motion.li key={item}>
              <a
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={navLinkStyles}
              >
                {item}
                <motion.div className="absolute bottom-0 left-0 w-0 h-[1px] bg-rose-400" whileHover={{ width: "100%" }} />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* --- DESKTOP USER ACTIONS (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <a href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-rose-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.3em]"
              >
                Login/Sign up
              </motion.button>
            </a>
          ) : (
            <div className="flex items-center gap-6 text-gray-700">
              <a href="/cart" className="relative hover:text-rose-500">
                <FaShoppingCart size={20} />
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </a>
              <a href={user.role === 'admin' ? '/profile/admin' : '/profile/user'}>
                <span className="flex items-center justify-center w-12 h-12 bg-rose-50 text-rose-500 rounded-full border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                  <User size={22} strokeWidth={1.5} />
                </span>
              </a>
            </div>
          )}
        </div>

        {/* --- MOBILE USER ACTIONS (Only text, visible on Mobile only) --- */}
        <div className="flex md:hidden items-center gap-4">
          {!user ? (
            <a href="/signup" className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
              Sign In
            </a>
          ) : (
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <a href="/cart" className="text-gray-600"> <FaShoppingCart size={20} />
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">2</span></a>
              <span className="text-gray-300">|</span>
              <a href={user.role === 'admin' ? '/profile/admin' : '/profile/user'} className="text-rose-500"> <span className="flex items-center justify-center w-12 h-12 bg-rose-50 text-rose-500 rounded-full border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                <User size={22} strokeWidth={1.5} />
              </span></a>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE NAVIGATION LINKS (Visible on Mobile only, no icons) --- */}
      <div className="md:hidden border-t border-gray-50 overflow-x-auto no-scrollbar">
        <ul className="flex justify-between items-center px-6 py-3 gap-6">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <li key={item} className="flex-shrink-0">
              <a
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-[10px] uppercase tracking-[0.15em] ${isActive ? "text-rose-600 border-b border-rose-600" : "text-gray-500"}`
                }
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};