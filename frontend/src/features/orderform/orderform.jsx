import { useNavigate } from "react-router-dom";
import { useState, useContext, useCallback } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, ShoppingBag, CheckCircle, Mail, Building, Hash } from "lucide-react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import MyContext from "../context/mycontext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { PhoneOTPVerifier } from "./phone-otp";
export const OrderForm = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useContext(MyContext);

    const buyNowItem = JSON.parse(sessionStorage.getItem("buyNowItem") || "null");
    const sessionCart = JSON.parse(sessionStorage.getItem("orderItems") || "null");
    const orderItems = buyNowItem ? [buyNowItem] : (sessionCart || cart);

    const user = JSON.parse(Cookies.get("hos_users") || "null");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // ✅ Separate state for each field — stops focus loss
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [state, setState] = useState("");
    // const [phoneVerified, setPhoneVerified] = useState(false);
    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = orderItems.reduce((acc, item) =>
        acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0
    );
    const shipping = subtotal > 999 ? 0 : 99;
    const grandTotal = subtotal + shipping;

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required.";
        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email.";
        if (!phone.trim()) newErrors.phone = "Phone is required.";
        else if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Enter valid 10-digit number.";
        if (!address.trim()) newErrors.address = "Address is required.";
        if (!city.trim()) newErrors.city = "City is required.";
        if (!pincode.trim()) newErrors.pincode = "Pincode is required.";
        else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter valid 6-digit pincode.";
        if (!state.trim()) newErrors.state = "State is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill all required fields.");
            return;
        }
        
        if (orderItems.length === 0) {
            toast.error("No items to order.");
            return;
        }
        // if (!phoneVerified) {
        //     toast.error("Please verify your phone number first.");
        //     return;
        // }

        setLoading(true);
        try {
            const order = {
                uid: user?.uid || "guest",
                userInfo: { name, email, phone },
                deliveryAddress: { address, city, pincode, state },
                items: orderItems.map(item => ({
                    productId: item.productId || item.id,
                    name: item.name,
                    brand: item.brand,
                    thumbnail: item.thumbnail,
                    price: item.price,
                    originalPrice: item.originalPrice || item.price,
                    discount: item.discount || 0,
                    selectedSize: item.selectedSize,
                    quantity: item.quantity,
                })),
                pricing: { subtotal, discount: totalDiscount, shipping, grandTotal },
                status: "pending",
                paymentMethod: "COD",
                paymentStatus: "unpaid",
                createdAt: Timestamp.now(),
                date: new Date().toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric"
                }),
            };

            await addDoc(collection(Firedb, "orders"), order);

            sessionStorage.removeItem("buyNowItem");
            sessionStorage.removeItem("orderItems");
            sessionStorage.removeItem("orderForm");

            if (!buyNowItem) clearCart();

            if (Notification.permission === "granted") {
                new Notification("PKS Luxe: Order Confirmed 🎉", {
                    body: `Your order of ₹${grandTotal.toLocaleString()} has been placed!`,
                    icon: "https://cdn-icons-png.flaticon.com/128/1008/1008010.png"
                });
            } else {
                Notification.requestPermission();
            }

            toast.success("Order placed successfully! 🎉");
            setLoading(false);
            navigate("/profile/user");

        } catch (error) {
            console.error(error);
            toast.error("Failed to place order. Please try again.");
            setLoading(false);
        }
    };

    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <ShoppingBag size={48} className="text-rose-200" />
                <p className="text-gray-400 text-sm uppercase tracking-widest">No items to order.</p>
                <button onClick={() => navigate("/products")}
                    className="px-8 py-3 bg-gray-900 text-white rounded-full text-xs font-bold tracking-widest hover:bg-rose-600 transition-colors">
                    SHOP NOW
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/* ── Left: Form ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-rose-100/30 p-8 border border-gray-100"
                >
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-50 rounded-full mb-4">
                            <ShoppingBag className="text-rose-500" size={24} />
                        </div>
                        <h2 className="text-2xl font-serif italic font-bold text-gray-900">Delivery Details</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors(p => ({ ...p, name: "" }));
                                    }}
                                    className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                        ${errors.name ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors(p => ({ ...p, email: "" }));
                                    }}
                                    className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                        ${errors.email ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                        setPhone(val);
                                        setErrors(p => ({ ...p, phone: "" }));
                                    }}
                                    className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                        ${errors.phone ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                <textarea
                                    rows="3"
                                    placeholder="House no, Street, Area"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setErrors(p => ({ ...p, address: "" }));
                                    }}
                                    className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all resize-none
                                        ${errors.address ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                />
                            </div>
                            {errors.address && <p className="text-red-500 text-xs mt-1 ml-2">{errors.address}</p>}
                        </div>

                        {/* City + Pincode */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <Building className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            setErrors(p => ({ ...p, city: "" }));
                                        }}
                                        className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                            ${errors.city ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                    />
                                </div>
                                {errors.city && <p className="text-red-500 text-xs mt-1 ml-2">{errors.city}</p>}
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <Hash className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={pincode}
                                        maxLength={6}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                            setPincode(val);
                                            setErrors(p => ({ ...p, pincode: "" }));
                                        }}
                                        className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                            ${errors.pincode ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                    />
                                </div>
                                {errors.pincode && <p className="text-red-500 text-xs mt-1 ml-2">{errors.pincode}</p>}
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setErrors(p => ({ ...p, state: "" }));
                                    }}
                                    className={`w-full bg-white border pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all
                                        ${errors.state ? "border-red-400" : "border-gray-200 focus:border-rose-300"}`}
                                />
                            </div>
                            {errors.state && <p className="text-red-500 text-xs mt-1 ml-2">{errors.state}</p>}
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-lg shadow-rose-200 mt-4 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Placing Order...
                                </>
                            ) : "CONFIRM ORDER"}
                        </motion.button>
                    </form>
                </motion.div>

                {/* ── Right: Order Summary ── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 lg:sticky lg:top-8"
                >
                    {/* Items */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-serif italic text-gray-900 mb-5">
                            {buyNowItem ? "Your Item" : `Order Items (${orderItems.length})`}
                        </h3>
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                            {orderItems.map((item, i) => (
                                <div key={i} className="flex gap-4 items-center py-2 border-b border-gray-50 last:border-0">
                                    <img src={item.thumbnail} alt={item.name}
                                        className="w-16 h-16 rounded-2xl object-cover bg-rose-50 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-400 font-bold">{item.brand}</p>
                                        <div className="flex gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                            <span>Size: {item.selectedSize}</span>
                                            <span>·</span>
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        {item.discount > 0 && <p className="text-green-600 text-[10px] font-bold">{item.discount}% off</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100">
                        <h3 className="text-lg font-serif italic text-gray-900 mb-4">Price Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Subtotal</dt>
                                <dd className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</dd>
                            </div>
                            {totalDiscount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Discount</dt>
                                    <dd className="font-medium text-green-600">- ₹{totalDiscount.toLocaleString()}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Shipping</dt>
                                <dd className={shipping === 0 ? "font-bold text-rose-500 text-[10px] uppercase tracking-widest" : "font-medium"}>
                                    {shipping === 0 ? "Free 🎉" : `₹${shipping}`}
                                </dd>
                            </div>
                            <div className="border-t border-rose-100 pt-3 flex justify-between">
                                <dt className="font-bold text-gray-900">Total</dt>
                                <dd className="font-bold text-gray-900 text-lg">₹{grandTotal.toLocaleString()}</dd>
                            </div>
                        </dl>
                        <div className="mt-4 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-rose-100">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Cash on Delivery</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};