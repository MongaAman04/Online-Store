import { NavLink, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import MyContext from "../context/mycontext";
import { doc, getDoc } from "firebase/firestore";
import { Firedb } from "../../firebase/firebaseConfig";
import { Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export const SingleProduct = () => {
    const { id } = useParams();
    const { loading, setLoading } = useContext(MyContext);
    const [product, setProduct] = useState({
        title: "Nike Air Force 1 '07 LV8",
        price: 12499,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/54a510de-a406-41b2-8d62-7f8c587c9a7e/air-force-1-07-lv8-shoes-9KwrSk.png",
        category: "shoes",
        description: "The radiance lives on in the Nike Air Force 1 '07 LV8...",
        quantity: 10
    });

    // const getSingleProductFunction = async () => {
    //     setLoading(true);
    //     try {
    //         const getitem = await getDoc(doc(Firedb, "products", id));
    //         if (getitem.exists()) {
    //             setProduct(getitem.data());
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     getSingleProductFunction();
    // }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-64 h-64 bg-rose-50 rounded-3xl" />
            <div className="h-4 w-48 bg-rose-50 rounded" />
        </div>
    </div>;

    if (!product) return null;

    return (
        <section className="py-12 lg:py-24 bg-white">
            <div className="max-w-7xl px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* --- Product Image Visual --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="sticky top-24 group relative bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 aspect-square flex items-center justify-center p-8">
                            <img
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                src={product.image}
                                alt={product.title}
                            />
                            <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                Premium Edition
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Product Content --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                    >
                        <div className="space-y-6">
                            {/* Rating & Title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    <span className="text-gray-400 text-xs font-medium ml-2">(48 Reviews)</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900 leading-tight">
                                    {product.title}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold text-rose-500">₹{product.price}</span>
                                <span className="text-gray-400 line-through text-lg">₹{Math.round(product.price * 1.2)}</span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed font-light text-lg">
                                {product.description || "Indulge in the perfect blend of heritage and modern craftsmanship. These sneakers feature premium materials designed for long-lasting comfort and undeniable style."}
                            </p>

                            <hr className="border-gray-100" />

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 py-4">
                                <div className="text-center space-y-2">
                                    <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                        <Truck size={18} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Fast Delivery</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Authentic</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                        <RotateCcw size={18} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">14 Day Return</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6">
                                <NavLink to={`/product/${id}/${encodeURIComponent(product.title)}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full md:w-auto px-12 py-5 bg-gray-900 text-white rounded-full font-bold tracking-[0.2em] uppercase text-xs shadow-2xl shadow-gray-200 hover:bg-rose-500 transition-colors"
                                    >
                                        Proceed to Order
                                    </motion.button>
                                </NavLink>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};