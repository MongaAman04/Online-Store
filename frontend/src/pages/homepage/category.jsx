import { motion } from "framer-motion";
import sample3 from "../../assets/products/sample3.png";

const categories = [
  { 
    title: "The Stiletto Edit", 
    tag: "Evening & Party", 
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80", 
    grid: "md:col-span-1" 
  },
  { 
    title: "PKS Special", 
    tag: "Exclusive Design", 
    img: sample3, // Fixed: removed the curly braces around sample3
    grid: "md:col-span-2" 
  },
  { 
    title: "Cloud Walkers", 
    tag: "Everyday Luxury", 
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80", 
    grid: "md:col-span-2" 
  },
  { 
    title: "Modern Muse", 
    tag: "Work & Beyond", 
    img: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80", 
    grid: "md:col-span-1" 
  },
];

export const CategorySection = () => {
  return (
    <section className="bg-rose-50/30">
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            className="h-[2px] bg-rose-500 mb-6 mx-auto md:mx-0"
          />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Shop by Vibe</h2>
          <p className="text-gray-500 tracking-widest uppercase text-xs font-medium">
            Handpicked collections for every version of you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`group relative overflow-hidden rounded-[2.5rem] h-[550px] cursor-pointer bg-gray-100 ${cat.grid}`}
            >
              {/* Image Layer */}
              <motion.img 
                src={cat.img} 
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
              />
              
              {/* Warm Gradient Overlay - Shifted to Rose/Pink tones */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-900/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" /> */}
              
              {/* Content Layer */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-rose-300 text-xs font-bold uppercase tracking-[0.4em] mb-3">
                    {cat.tag}
                  </p>
                  <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
                    {cat.title}
                  </h3>
                  
                  {/* Subtle Interactive Button */}
                  <div className="relative overflow-hidden inline-flex items-center group/btn">
                    <span className="text-white text-xs font-bold tracking-[0.2em] uppercase pb-1 border-b border-rose-400/50 group-hover/btn:border-rose-400 transition-colors">
                      Explore Collection
                    </span>
                    <motion.span 
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 5, opacity: 1 }}
                      className="ml-2 text-rose-400"
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </div>

              {/* Top Right Accent */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white text-xl">↗</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};