import { useContext } from "react";
import { Trash, Plus, Minus, ShoppingBag } from "lucide-react";
import MyContext from "../context/mycontext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const Cart = () => {
    const { cart, deleteFromCart, incrementCart, decrementCart } = useContext(MyContext);
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const originalTotal = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const totalDiscount = originalTotal - subtotal;
    const shipping = subtotal > 999 ? 0 : 99;
    const grandTotal = subtotal + shipping;

    const handleDelete = (item) => {
        deleteFromCart(item);
        toast("Removed from bag 🛍️");
    };

    // ✅ Empty cart state
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                <ShoppingBag size={64} className="text-rose-200" />
                <h2 className="text-3xl font-serif italic text-gray-800">Your bag is empty</h2>
                <p className="text-gray-400 text-sm uppercase tracking-widest">Looks like you haven't added anything yet.</p>
                <Link
                    to="/products"
                    className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-full text-xs font-bold tracking-widest hover:bg-rose-600 transition-colors"
                >
                    EXPLORE COLLECTION
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl py-12">
                <h1 className="text-4xl font-serif italic text-gray-900 mb-2">Your Shopping Bag</h1>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-10">
                    {cart.length} item{cart.length !== 1 ? "s" : ""} in your bag
                </p>

                <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">

                    {/* ── Product List ── */}
                    <section className="lg:col-span-8">
                        <ul className="divide-y divide-rose-50 border-t border-rose-50">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="flex py-8 sm:py-10"
                                    >
                                        {/* Image */}
                                        <div className="flex-shrink-0 bg-rose-50 rounded-2xl p-2">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl object-contain"
                                            />
                                        </div>

                                        <div className="ml-6 flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-serif text-gray-900">{item.name}</h3>
                                                    <div className="mt-1 flex text-xs uppercase tracking-widest text-gray-400 font-bold gap-3">
                                                        <span>{item.brand}</span>
                                                        <span className="border-l border-gray-200" />
                                                        <span>{item.category}</span>
                                                        {item.selectedSize && (
                                                            <>
                                                                <span className="border-l border-gray-200" />
                                                                <span>Size: {item.selectedSize}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Stock warning */}
                                                    {item.stock <= 5 && (
                                                        <p className="text-amber-500 text-xs font-bold mt-1">
                                                            Only {item.stock} left!
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                {/* ✅ Quantity Selector */}
                                                <div className="flex items-center border border-rose-100 rounded-full px-2 py-1 gap-1">
                                                    <button
                                                        onClick={() => decrementCart(item.id)}
                                                        className="p-1 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => incrementCart(item.id)}
                                                        className="p-1 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    {item.originalPrice && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                                                        </p>
                                                    )}
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    {item.discount > 0 && (
                                                        <p className="text-xs font-bold text-green-600">{item.discount}% off</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </section>

                    {/* ── Order Summary ── */}
                    <section className="mt-16 lg:col-span-4 lg:mt-0 sticky top-6">
                        <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100/50">
                            <h2 className="text-xl font-serif italic text-gray-900 mb-6">Order Summary</h2>

                            <dl className="-my-4 divide-y divide-rose-100 text-sm">
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-500">
                                        Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})
                                    </dt>
                                    <dd className="font-medium text-gray-900">₹{originalTotal.toLocaleString()}</dd>
                                </div>

                                {totalDiscount > 0 && (
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-500">Discount</dt>
                                        <dd className="font-medium text-green-600">- ₹{totalDiscount.toLocaleString()}</dd>
                                    </div>
                                )}

                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-500">Shipping</dt>
                                    <dd className={shipping === 0
                                        ? "font-bold text-rose-500 uppercase text-[10px] tracking-widest"
                                        : "font-medium text-gray-900"
                                    }>
                                        {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                                    </dd>
                                </div>

                                {shipping === 99 && (
                                    <div className="py-2">
                                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                                            Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between py-6">
                                    <dt className="text-lg font-bold text-gray-900">Total Amount</dt>
                                    <dd className="text-lg font-bold text-gray-900">₹{grandTotal.toLocaleString()}</dd>
                                </div>
                            </dl>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/placeorder")}
                                className="mt-8 w-full bg-gray-900 text-white py-4 rounded-full font-bold tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
                            >
                                PROCEED TO CHECKOUT
                            </motion.button>

                            <Link
                                to="/products"
                                className="mt-3 w-full block text-center py-3 rounded-full border border-rose-200 text-rose-500 text-xs font-bold tracking-widest hover:bg-rose-50 transition-colors"
                            >
                                CONTINUE SHOPPING
                            </Link>

                            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-tighter">
                                Secure Payment • Easy Returns • Authentic Quality
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};