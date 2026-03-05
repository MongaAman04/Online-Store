import { motion } from "framer-motion";

const categories = [
  { 
    title: "The Stiletto Edit", 
    tag: "Evening & Party", 
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80", 
    grid: "md:col-span-1" 
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
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h2 className="text-4xl font-serif italic text-gray-900">Shop by Vibe</h2>
        <p className="text-gray-500 mt-2 tracking-wide">Handpicked collections for every version of you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className={`relative overflow-hidden rounded-[2rem] h-[500px] group cursor-pointer shadow-xl shadow-rose-100/20 ${cat.grid}`}
          >
            {/* Image with zoom effect */}
            <img 
              src={cat.img} 
              alt={cat.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Content Container */}
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-xs tracking-[0.4em] uppercase mb-3 text-rose-300 font-bold"
              >
                {cat.tag}
              </motion.p>
              <h3 className="text-4xl font-serif leading-tight">{cat.title}</h3>
              
              {/* Animated Button that appears on hover */}
              <motion.div 
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase border-b border-white pb-1 overflow-hidden"
              >
                Explore More
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};