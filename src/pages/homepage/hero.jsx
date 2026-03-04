import { motion, useMotionValue, useTransform } from "framer-motion";
import { NavLink } from "react-router-dom";

export const HeroSection = () => {
  // --- 1. Tilt Effect Logic (Faux-3D) ---
  // These motion values capture the cursor's x/y position relative to the center.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map the cursor position (-0.5 to 0.5) to a tilt rotation (-15 to 15 degrees).
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate relative position (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    // Smoothly reset the tilt when the mouse leaves the area
    x.set(0);
    y.set(0);
  }

  // --- 2. Animation Variants for Text ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom "Cubic Bezier" ease-out for elegance
    },
  };

  return (
    <section className="relative w-full min-h-[85vh] bg-rose-50/50 overflow-hidden flex items-center">
      {/* Background Decorative Element */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* --- Left Column: Text Content --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left"
        >
          <motion.span 
            variants={textVariants}
            className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-[0.2em] mb-4"
          >
            Spring '24 Collection
          </motion.span>

          <motion.h1 
            variants={textVariants}
            className="text-5xl md:text-7xl font-serif italic text-gray-900 leading-tight mb-6"
          >
            Step into<br />
            <span className="text-rose-500 not-italic font-bold">Elegance<span className="text-gray-900">.</span></span>
          </motion.h1>

          <motion.p 
            variants={textVariants}
            className="text-lg text-gray-600 mb-10 max-w-md mx-auto md:mx-0 font-light leading-relaxed"
          >
            Discover footwear designed not just for walking, but for making an entrance. Crafted for comfort, styled for the modern woman.
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <NavLink to="/products">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#e11d48" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 rounded-full bg-gray-900 text-white font-bold tracking-widest text-sm shadow-xl shadow-gray-200"
              >
                SHOP THE COLLECTION
              </motion.button>
            </NavLink>
            
            <NavLink to="/about">
              <button className="px-12 py-4 rounded-full border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white transition-colors">
                Our Story
              </button>
            </NavLink>
          </motion.div>
        </motion.div>

        {/* --- Right Column: Interactive 3D/Image --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 1, delay: 0.5, ease: "easeOut" } }}
          className="relative flex justify-center items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          // "style" is used by motion values, but needs perspective on the parent for 3D effect
          style={{ perspective: 1000 }} 
        >
          {/* Decorative "Halo" Ring behind the shoe */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[120%] h-[120%] border-2 border-dashed border-rose-200 rounded-full opacity-60"
          />

          {/* The Tilted Shoe Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d", // Required for true 3D effect
            }}
            className="relative cursor-grab active:cursor-grabbing"
          >
            {/* *** IMPORTANT ***
              Replace 'YOUR_SHOE_IMAGE_URL' with a high-res, 
              transparent PNG of a stylish shoe (like a heel or premium sneaker).
              A slight side-profile angle works best for this tilt effect.
            */}
            <img 
              src="YOUR_SHOE_IMAGE_URL_HERE.png" 
              alt="Featured PKS Luxury Footwear"
              className="w-full max-w-lg drop-shadow-[0_35px_35px_rgba(225,29,72,0.15)]"
              // The drop-shadow uses a tint of the rose color to make it glow
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};