import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, limit, startAfter, getDocs, where } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import MyContext from "../context/mycontext";
import Loader from "../../componets/loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BATCH_SIZE = 8;

const categoryList = [
  { name: "sneakers" }, { name: "heels" }, { name: "sandals" },
  { name: "boots" }, { name: "flats" }, { name: "loafers" },
  { name: "sports" }, { name: "formal" }, { name: "Juttis" }
];

export const ProductList = () => {
  const { cart, addToCart, deleteFromCart } = useContext(MyContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const lastDocRef = useRef(null);

  const buildQuery = (lastDoc = null, category = null) => {
    let constraints = [orderBy("createdAt", "desc"), limit(BATCH_SIZE)];
    if (category) constraints = [where("category", "==", category), ...constraints];
    if (lastDoc) constraints = [...constraints.slice(0, -1), startAfter(lastDoc), limit(BATCH_SIZE)];
    return query(collection(Firedb, "products"), ...constraints);
  };

  const fetchInitialProducts = async (category = null) => {
    setLoading(true);
    lastDocRef.current = null;
    try {
      const snapshot = await getDocs(buildQuery(null, category));
      if (snapshot.empty) {
        setProducts([]);
        setHasMore(false);
        return;
      }
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      setHasMore(snapshot.docs.length === BATCH_SIZE);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreProducts = async () => {
    if (!hasMore || loadingMore || !lastDocRef.current) return;
    setLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const snapshot = await getDocs(buildQuery(lastDocRef.current, selectedCategory));
      if (snapshot.empty) { setHasMore(false); return; }
      setProducts(prev => [...prev, ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))]);
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      setHasMore(snapshot.docs.length === BATCH_SIZE);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load more products.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchInitialProducts(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
  };

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

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {/* "All" pill */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border
              ${selectedCategory === null
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-500 border-rose-100 hover:border-rose-300 hover:text-rose-500"
              }`}
          >
            All
          </motion.button>

          {categoryList.map(({ name }) => (
            <motion.button
              key={name}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(name)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border
                ${selectedCategory === name
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100"
                  : "bg-white text-gray-500 border-rose-100 hover:border-rose-300 hover:text-rose-500"
                }`}
            >
              {name}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              key="filter-label"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-center mt-4"
            >
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                Showing results for{" "}
                <span className="text-rose-500 font-bold">{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-gray-300 hover:text-rose-400 transition-colors"
                >
                  ✕
                </button>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-widest">No products found.</p>
          </div>
        ) : (
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap -m-4"
          >
            {products.map((item) => {
              const { id, thumbnail, name, price, originalPrice, discount } = item;
              const isItemInCart = cart.some((p) => p.id === id);

              return (
                <a href={`/productdetails/${id}`}  className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <motion.div
                  key={id}
                  variants={cardVariants}
                  // onClick={() => navigate(``)}
                >
                 
                  <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-50/50">
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
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
                    <div className="p-6 bg-white">
                      <h3 className="text-gray-400 text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">
                        {item.brand || "New Arrival"}
                      </h3>
                      <h1 className="text-gray-800 font-medium text-lg mb-2 truncate">{name}</h1>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-rose-600 font-serif text-xl">₹{price?.toLocaleString()}</p>
                        {originalPrice && (
                          <p className="text-gray-400 line-through text-sm">₹{originalPrice?.toLocaleString()}</p>
                        )}
                      </div>
                      <AnimatePresence mode="wait">
                        {isItemInCart ? (
                          <motion.button
                            key="remove"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={(e) => { e.stopPropagation(); deleteFromCart(item); toast("Removed from bag 🛍️"); }}
                            className="w-full py-3 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors uppercase tracking-widest"
                          >
                            Remove
                          </motion.button>
                        ) : (
                          <motion.button
                            key="add"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); addToCart(item); toast.success("Added to bag!"); }}
                            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-gray-200 uppercase"
                          >
                            Add to Bag
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
                </a>
              );
            })}
          </motion.div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchMoreProducts}
              disabled={loadingMore}
              className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-full font-bold tracking-widest text-xs hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {loadingMore ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Loading...</>
              ) : "LOAD MORE"}
            </motion.button>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-center text-gray-400 text-xs uppercase tracking-widest mt-10">
            You've seen all products ✨
          </p>
        )}
      </section>
    </div>
  );
};