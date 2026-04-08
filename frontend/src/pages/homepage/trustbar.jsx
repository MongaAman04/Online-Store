import { motion } from "framer-motion";
import { FaTruck, FaRegHeart, FaUndoAlt, FaShieldAlt } from "react-icons/fa";

export const TrustBar = () => {
  const values = [
    { icon: <FaTruck />, title: "Free Shipping", desc: "On all orders above ₹1999" },
    { icon: <FaUndoAlt />, title: "7-Day Exchange", desc: "Hassle-free exchanges" },
    { icon: <FaShieldAlt />, title: "Secure Checkout", desc: "100% Protected payments" },
    { icon: <FaRegHeart />, title: "Crafted with Love", desc: "Ergonomic feminine design" },
  ];

  return (
    <div className="bg-rose-50/30 border-y border-rose-100 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {values.map((v, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="text-rose-400 text-2xl mb-1">{v.icon}</div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-gray-800">{v.title}</h4>
            <p className="text-xs text-gray-500 font-light">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};