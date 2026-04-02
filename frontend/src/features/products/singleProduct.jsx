import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import MyContext from "../context/mycontext";
import { doc, getDoc } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import { Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, Heart, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SizeChart } from "../../componets/sizeChart";

export const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, setLoading, cart, addToCart, deleteFromCart } = useContext(MyContext);

    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [wishlist, setWishlist] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isInCart = cart.some(p => p.id === id && p.selectedSize === selectedSize);

    useEffect(() => {
        const getSingleProduct = async () => {
            setLoading(true);
            try {
                const docSnap = await getDoc(doc(Firedb, "products", id));
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    toast.error("Product not found.");
                    navigate("/products");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product.");
            } finally {
                setLoading(false);
            }
        };
        getSingleProduct();
    }, [id]);


    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size first.");
            return;
        }
        const cartItem = {
            ...product,
            selectedSize,
            quantity: 1,
            id: `${product.id}_${selectedSize}`,
            productId: product.id,
        };
        addToCart(cartItem);
        toast.success(`Size ${selectedSize} added to bag!`);
    };

    const handleRemoveFromCart = () => {
        deleteFromCart({ id: `${product.id}_${selectedSize}` });
        toast("Removed from bag 🛍️");
    };
    const handleBuyNow = () => {
        if (!selectedSize) {
            toast.error("Please select a size first.");
            return;
        }
        const orderItem = {
            ...product,
            selectedSize,
            quantity: 1,
            id: `${product.id}_${selectedSize}`,
            productId: product.id,
        };

        sessionStorage.setItem("buyNowItem", JSON.stringify(orderItem));
        navigate("/placeorder");
    };
    const selectedSizeStock = selectedSize
        ? product?.sizeInventory?.[selectedSize] ?? 0
        : null;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col lg:flex-row gap-12 max-w-7xl w-full px-6">
                <div className="w-full lg:w-1/2 aspect-square bg-rose-50 rounded-[3rem]" />
                <div className="w-full lg:w-1/2 space-y-6 py-8">
                    <div className="h-4 w-24 bg-rose-50 rounded" />
                    <div className="h-10 w-3/4 bg-gray-100 rounded" />
                    <div className="h-6 w-1/3 bg-gray-100 rounded" />
                    <div className="h-24 bg-gray-50 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    if (!product) return null;

    const images = product.images?.length > 0 ? product.images : [product.thumbnail];
    const availableSizes = product.sizeInventory
        ? Object.entries(product.sizeInventory).sort(([a], [b]) => Number(a) - Number(b))
        : [];

    const ImageModal = ({ isOpen, onClose, src, alt }) => (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
                >
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </motion.button>

                    {/* Close instruction */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                        Click anywhere to close
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="max-w-7xl px-6 mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8 text-sm font-medium"
                >
                    <ChevronLeft size={18} /> Back
                </button>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    <ImageModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        src={images[selectedImage]}
                        alt={product.name}
                    />
                    {/* ── Image Gallery ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="sticky top-24 space-y-4">
                            {/* Main Image */}
                            <div onClick={() => setIsModalOpen(true)} className="group relative bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 aspect-square flex items-center justify-center p-8">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        src={images[selectedImage]}
                                        alt={product.name}
                                    />
                                </AnimatePresence>
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm p-3 rounded-full text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                </div>
                                {/* Discount badge */}
                                {product.discount > 0 && (
                                    <div className="absolute top-6 left-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                                        {product.discount}% OFF
                                    </div>
                                )}

                                {/* Share */}

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied!");
                                    }}
                                    className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                                >
                                    <Share2 size={18} />
                                </button>

                                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                    {product.brand || "Premium Edition"}
                                </div>
                            </div>

                            {/* ✅ Thumbnail strip */}
                            {images.length > 1 && (
                                <div className="flex gap-3 justify-center">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all
                                                ${selectedImage === i
                                                    ? "border-gray-900 scale-105"
                                                    : "border-gray-100 hover:border-rose-300"
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Product Info ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                    >
                        <div className="space-y-6">

                            {/* Category + Gender */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                    {product.category}
                                </span>
                                {product.gender && (
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        · {product.gender}
                                    </span>
                                )}
                            </div>

                            {/* Rating & Title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                                        />
                                    ))}
                                    <span className="text-gray-400 text-xs font-medium ml-2">
                                        ({product.totalReviews || 0} Reviews)
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold text-rose-500">
                                    ₹{product.price?.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-gray-400 line-through text-lg">
                                        ₹{product.originalPrice?.toLocaleString()}
                                    </span>
                                )}
                                {product.discount > 0 && (
                                    <span className="text-green-600 text-sm font-bold">
                                        {product.discount}% off
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed font-light text-base">
                                {product.description}
                            </p>

                            <hr className="border-gray-100" />

                            {/* ✅ Size Selector with stock awareness */}
                            {availableSizes.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                                            Select Size (IN)
                                        </p>
                                        {selectedSize && selectedSizeStock !== null && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                                                ${selectedSizeStock > 10 ? "bg-green-100 text-green-600"
                                                    : selectedSizeStock > 3 ? "bg-amber-100 text-amber-600"
                                                        : selectedSizeStock > 0 ? "bg-red-100 text-red-500"
                                                            : "bg-gray-100 text-gray-400"}`}
                                            >
                                                {selectedSizeStock > 10 ? `${selectedSizeStock} in stock`
                                                    : selectedSizeStock > 0 ? `Only ${selectedSizeStock} left!`
                                                        : "Out of stock"}
                                            </span>
                                        )}
                                        <SizeChart />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {availableSizes.map(([size, qty]) => {
                                            const outOfStock = qty === 0;
                                            const isSelected = selectedSize === Number(size);
                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    disabled={outOfStock}
                                                    onClick={() => setSelectedSize(Number(size))}
                                                    className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all relative
                                                        ${outOfStock
                                                            ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                                                            : isSelected
                                                                ? "border-gray-900 bg-gray-900 text-white scale-110 shadow-lg"
                                                                : "border-gray-200 text-gray-700 hover:border-rose-400"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!selectedSize && (
                                        <p className="text-gray-400 text-xs mt-2">
                                            Select a size to add to bag
                                        </p>
                                    )}
                                </div>
                            )}
                           

                            {/* Tags */}
                            {product.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 py-4">
                                {[
                                    { icon: <Truck size={18} />, label: "Fast Delivery" },
                                    { icon: <ShieldCheck size={18} />, label: "Authentic" },
                                    { icon: <RotateCcw size={18} />, label: "14 Day Return" },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="text-center space-y-2">
                                        <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                            {icon}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{label}</p>
                                    </div>
                                ))}
                            </div>


                            <div className="flex w-full justify-between pt-2 gap-2">
                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key="buy"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBuyNow}
                                        className="w-2xs py-4 bg-rose-500 text-white rounded-full font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors shadow-xl shadow-gray-200"
                                    >
                                        Buy Now
                                    </motion.button>

                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    {isInCart ? (
                                        <motion.button
                                            key="remove"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            onClick={handleRemoveFromCart}
                                            className="w-2xs py-4 border-2 border-rose-300 text-rose-500 rounded-full font-bold tracking-widest text-xs hover:bg-rose-50 transition-colors"
                                        >
                                            REMOVE FROM BAG
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            key="add"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAddToCart}
                                            className="w-2xs py-4 bg-gray-900 text-white rounded-full font-bold tracking-widest text-xs hover:bg-rose-500 transition-colors shadow-xl shadow-gray-200"
                                        >
                                            ADD TO BAG
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* Share button */}


                            </div>
                            {/* Go to cart CTA */}
                            {isInCart && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="w-full py-3 border border-gray-200 rounded-full text-xs font-bold tracking-widest uppercase text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        VIEW BAG →
                                    </button>
                                </motion.div>
                            )}
                        </div>

                    </motion.div>


                </div>
            </div>
        </section>
    );
};