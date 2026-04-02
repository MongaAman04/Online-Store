import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import heroImage from "../../assets/products/sample5.png"; 

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-rose-50">
      
      <div className="absolute inset-0 z-0">
       
        <motion.img 
          initial={{ scale: 1.1, x: 50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          src={heroImage} 
          alt="Luxury Collection" 
          className="w-full h-full object-cover object-right-center opacity-90 md:opacity-100"
        />
        
        {/* Soft Warm Overlays */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-rose-50/10 via-rose-50/10 to-transparent" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-rose-100/20 via-transparent to-transparent" /> */}
      </div>

      {/* --- Floating Organic Blobs for Feminine Energy --- */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-72 h-72 bg-rose-200/50 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 40, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl"
      />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/20 border border-white/40 shadow-2xl shadow-rose-200/50"
        >
          {/* Subtle Tagline */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-rose-500"></span>
            <span className="text-rose-600 text-xs font-bold uppercase tracking-[0.3em]">
              Made for Her
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-[1.1] mb-6">
            Grace in Every <br />
            <span className="text-rose-500 italic">Footstep.</span>
          </h1>

          <p className="text-base md:text-lg text-gray-700 mb-10 font-light leading-relaxed">
            Curated footwear for the woman who values <strong>elegance without compromise</strong>. 
            Each pair is a tribute to feminine strength and timeless beauty.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <NavLink to="/products">
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgb(244 63 94 / 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-rose-500 text-white font-bold rounded-full tracking-wider text-sm shadow-lg shadow-rose-500/20 transition-all"
              >
                SHOP THE EDIT
              </motion.button>
            </NavLink>

            <NavLink to="/about">
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                className="px-10 py-4 border-2 border-rose-500/20 text-rose-600 font-bold rounded-full text-sm bg-white/50 transition-all"
              >
                THE CRAFTSMANSHIP
              </motion.button>
            </NavLink>
          </div>

          {/* Luxury Metric Tags */}
          <div className="mt-12 pt-8 border-t border-rose-200/50 flex gap-8">
            <div>
              <p className="text-xl font-serif text-rose-500 italic">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Vegan Leather</p>
            </div>
            <div>
              <p className="text-xl font-serif text-rose-500 italic">Global</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Shipping</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Side Social Links or Decorative text --- */}
      <div className="hidden xl:flex absolute right-10 top-0 h-full items-center flex-col justify-center gap-24 py-10">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-rose-300 to-transparent"></div>
        <p className="text-rose-400 text-[10px] tracking-[0.8em] uppercase rotate-90 whitespace-nowrap">
          House Of Sole LUXURY COLLECTION
        </p>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-rose-300 to-transparent"></div>
      </div>

    </section>
  );
};