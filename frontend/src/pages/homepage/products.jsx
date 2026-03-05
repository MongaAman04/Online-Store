import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data for a Female Footwear Brand
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Velvet Rose Stilettos",
    price: 4999,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Luna Strappy Sandals",
    price: 2499,
    image: "https://images.unsplash.com/photo-1562273103-912067decb6a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Ivory Pearl Pumps",
    price: 3799,
    image: "https://images.unsplash.com/photo-1596702994230-a00ef644ae1c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Suede Ankle Muses",
    price: 5299,
    image: "https://images.unsplash.com/photo-1605812383198-051f777f3588?q=80&w=800&auto=format&fit=crop",
  },
];

export const Products = () => {
  // Using local state instead of Redux
  const [cart, setCart] = useState([]);

  const addCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const deleteCart = (product) => {
    setCart((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Animation Config
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mt-16 px-4">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
          className="text-xs uppercase text-rose-500 font-bold mb-2"
        >
          Curated Collection
        </motion.h2>
        <h1 className="text-4xl font-serif italic text-gray-800">Bestselling Footwear</h1>
        <div className="h-1 w-20 bg-rose-200 mx-auto mt-4 rounded-full"></div>
      </div>

      <section className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap -m-4"
        >
          {MOCK_PRODUCTS.map((item) => {
            const { id, image, title, price } = item;
            const isItemInCart = cart.some((p) => p.id === id);

            return (
              <motion.div
                key={id}
                variants={cardVariants}
                className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-50/50">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-rose-50">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                      className="h-full w-full object-cover object-center"
                      src={image}
                      alt={title}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Details */}
                  <div className="p-6 bg-white">
                    <h3 className="text-gray-400 text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">
                      Limited Edition
                    </h3>
                    <h1 className="text-gray-800 font-medium text-lg mb-2 truncate">
                      {title}
                    </h1>
                    <p className="text-rose-600 font-serif text-xl mb-4">
                      ₹{price.toLocaleString()}
                    </p>

                    {/* Action Button */}
                    <AnimatePresence mode="wait">
                      {isItemInCart ? (
                        <motion.button
                          key="remove"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => deleteCart(item)}
                          className="w-full py-3 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors uppercase tracking-widest"
                        >
                          Remove
                        </motion.button>
                      ) : (
                        <motion.button
                          key="add"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addCart(item)}
                          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-gray-200 uppercase"
                        >
                          Add to Bag
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};