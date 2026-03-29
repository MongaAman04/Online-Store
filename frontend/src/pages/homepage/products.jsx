import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import MyContext from "../../features/context/mycontext";

export const Products = () => {
  const { getAllProduct, cart, addToCart, deleteFromCart } = useContext(MyContext);
  const navigate = useNavigate();

  const featuredProducts = getAllProduct.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mt-16 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
          className="text-xs uppercase text-rose-500 font-bold mb-2"
        >
          Curated Collection
        </motion.h2>
        <h1 className="text-4xl font-serif italic text-gray-800">Bestselling Footwear</h1>
        <div className="h-1 w-20 bg-rose-200 mx-auto mt-4 rounded-full" />
      </div>

      <section className="max-w-7xl mx-auto">


        {featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              No products available yet.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap -m-4"
          >
            {featuredProducts.map((item) => {
              const { id, thumbnail, name, price, originalPrice, discount, brand } = item;
              const isItemInCart = cart.some((p) => p.id === id);

              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-50/50 cursor-pointer"
                    onClick={() => navigate(`/productdetails/${id}`)}
                  >
                    {/* Discount badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-80 overflow-hidden bg-rose-50">
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6 }}
                        className="h-full w-full object-cover object-center"
                        src={thumbnail}
                        alt={name}
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Details */}
                    <div className="p-6 bg-white">
                      <h3 className="text-gray-400 text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">
                        {brand || "New Arrival"}
                      </h3>
                      <h1 className="text-gray-800 font-medium text-lg mb-2 truncate">
                        {name}
                      </h1>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-rose-600 font-serif text-xl">
                          ₹{price?.toLocaleString()}
                        </p>
                        {originalPrice && (
                          <p className="text-gray-400 line-through text-sm">
                            ₹{originalPrice?.toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Cart button */}
                      <AnimatePresence mode="wait">
                        {isItemInCart ? (
                          <motion.button
                            key="remove"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFromCart(item);
                              toast("Removed from bag 🛍️");
                            }}
                            className="w-full py-3 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors uppercase tracking-widest"
                          >
                            Remove
                          </motion.button>
                        ) : (
                          <motion.button
                            key="add"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({ ...item, quantity: 1 });
                              toast.success("Added to bag!");
                            }}
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
        )}

        {getAllProduct.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-full font-bold tracking-widest text-xs hover:bg-rose-600 transition-colors shadow-xl shadow-gray-200"
            >
              EXPLORE ALL {getAllProduct.length} PRODUCTS
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </section>
    </div>
  );
};