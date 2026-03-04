import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
export const Nav = ()=>{
    const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const navLinkStyles = ({ isActive }) => 
    `relative py-1 transition-all duration-300 ${
      isActive ? "text-rose-600 font-semibold" : "text-gray-600 hover:text-rose-400"
    }`;

    return (
         <nav className="max-w-7xl mx-auto flex justify-between items-center p-6">
        
        {/* Brand Identity */}
        <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
          <h1 className="text-3xl font-serif tracking-tighter italic font-bold text-gray-900">
            PKS<span className="text-rose-400 not-italic">.</span>
          </h1>
        </motion.div>

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

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          <motion.div whileHover={{ scale: 1.2, color: "#e11d48" }} className="cursor-pointer">
            <FaSearch size={18} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.2, color: "#e11d48" }} className="cursor-pointer">
             <NavLink to="/cart" className="relative">
                <FaShoppingCart size={20} />
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  2
                </span>
             </NavLink>
          </motion.div>
        </div>
      </nav>
    )
}