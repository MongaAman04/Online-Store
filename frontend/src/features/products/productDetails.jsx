import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import MyContext from "../context/mycontext";
import Loader from "../../componets/loader";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

export const ProductList = () => {
  const { cart, addToCart, deleteFromCart } = useContext(MyContext);
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(Firedb, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error("Failed to load products.");
      setLoading(false);
    });

    return () => unsubscribe(); // ✅ Cleanup listener on unmount
  }, []);
  const handleOnclick = (id)=>{
      navigate(`/productdetails/${id}`)
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) return <Loader />;

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
        <div className="h-1 w-20 bg-rose-200 mx-auto mt-4 rounded-full"></div>
      </div>

      <section className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-widest">No products listed yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap -m-4"
          >
            {products.map((item) => {
              const { id, thumbnail, name, price, originalPrice, discount } = item;
              const isItemInCart = cart.some((p) => p.id === id);

              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  onClick={()=>handleOnclick(id)}
                  className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-50/50">

                    {/* Discount Badge */}
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
                        {item.brand || "New Arrival"}
                      </h3>
                      <h1 className="text-gray-800 font-medium text-lg mb-2 truncate">{name}</h1>

                      {/* Price */}
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

                      {/* Button */}
                      <AnimatePresence mode="wait">
                        {isItemInCart ? (
                          <motion.button
                            key="remove"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => {
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
                            onClick={() => {
                              addToCart(item);
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
      </section>
    </div>
  );
};