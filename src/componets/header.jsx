import { FaShoppingCart, FaSearch, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Nav } from "./nav";

export const Header = () => {
  
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  
  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-rose-100"
    >
     <Nav/>
    </motion.header>
  );
};