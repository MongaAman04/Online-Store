import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Package, Calendar, CreditCard, ChevronRight, RefreshCw, ShoppingBag, MapPin, Clock } from "lucide-react";
import Cookies from "js-cookie";
import { collection, onSnapshot, orderBy, query, where,addDoc,Timestamp } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_STYLES = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "🟡" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", dot: "🔵" },
    shipped: { bg: "bg-purple-100", text: "text-purple-700", dot: "🟣" },
    delivered: { bg: "bg-green-100", text: "text-green-700", dot: "🟢" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "🔴" },
};

export const Userpage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(Cookies.get("users") || "null") || { name: "Guest", email: "Not Available" };

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    // ✅ Fetch only this user's orders
    useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(Firedb, "orders"),
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user?.uid]);


    const isReturnEligible = (order) => {
        if (!order.createdAt) return false;
        const orderDate = order.createdAt.toDate?.() || new Date(order.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && order.status === "delivered";
    };


    const returnDaysLeft = (order) => {
        if (!order.createdAt) return 0;
        const orderDate = order.createdAt.toDate?.() || new Date(order.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        return Math.max(0, 7 - diffDays);
    };


const handleReplace = async (order, item, type = "replace") => {
    if (!isReturnEligible(order)) {
        toast.error("Return window has expired (7 days only).");
        return;
    }
    const reason = window.prompt("Please briefly describe the reason for return/replace:");
    if (!reason) return;

    try {
        await addDoc(collection(Firedb, "returnRequests"), {
            orderId: order.id,
            uid: user.uid,
            type,                          
            status: "pending",
            reason,
            item: {
                name: item.name,
                brand: item.brand,
                thumbnail: item.thumbnail,
                price: item.price,
                selectedSize: item.selectedSize,
                quantity: item.quantity,
                productId: item.productId,
            },
            userInfo: {
                name: order.userInfo?.name,
                email: order.userInfo?.email,
                phone: order.userInfo?.phone,
            },
            deliveryAddress: order.deliveryAddress,
            createdAt: Timestamp.now(),
            date: new Date().toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
            }),
        });
        toast.success("Return/Replace request submitted! We'll contact you shortly.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to submit request.");
    }
};

    const handleLogout = () => {
        Cookies.remove("users");
        navigate("/login");
        toast.success("Logged out successfully!");
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">

                {/* ── Profile Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-rose-50 rounded-[3rem] p-8 md:p-12 mb-12 border border-rose-100 overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                                alt="User Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-500 mb-2">Member Profile</h2>
                            <h1 className="text-4xl font-serif italic text-gray-900 mb-1">{user.name}</h1>
                            <p className="text-gray-500 font-light">{user.email}</p>
                            {user.phone && (
                                <p className="text-gray-400 text-sm mt-1">+91 {user.phone}</p>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Orders</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {orders.filter(o => o.status === "delivered").length}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Delivered</p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full text-xs font-bold tracking-widest shadow-sm hover:text-rose-500 transition-colors"
                        >
                            <LogOut size={16} /> LOGOUT
                        </motion.button>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl" />
                </motion.div>

                {/* ── Orders Section ── */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif italic text-gray-900">Purchase History</h2>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            {orders.length} Total Order{orders.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && orders.length === 0 && (
                        <div className="text-center py-20 bg-rose-50/30 rounded-[2.5rem] border border-rose-100">
                            <ShoppingBag size={48} className="text-rose-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif italic text-gray-700 mb-2">No orders yet</h3>
                            <p className="text-gray-400 text-sm mb-6">Looks like you haven't placed any orders.</p>
                            <button
                                onClick={() => navigate("/products")}
                                className="px-8 py-3 bg-gray-900 text-white rounded-full text-xs font-bold tracking-widest hover:bg-rose-600 transition-colors"
                            >
                                SHOP NOW
                            </button>
                        </div>
                    )}

                    {/* ✅ Orders list */}
                    <AnimatePresence>
                        {orders.map((order) => {
                            const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                            const isExpanded = expandedOrder === order.id;
                            const eligible = isReturnEligible(order);
                            const daysLeft = returnDaysLeft(order);

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-lg shadow-gray-100/50"
                                >
                                    {/* ── Order Header ── */}
                                    <div
                                        className="flex flex-col lg:flex-row cursor-pointer"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        {/* Left sidebar */}
                                        <div className="w-full lg:w-72 bg-rose-50/30 p-8 border-b lg:border-b-0 lg:border-r border-rose-50 flex-shrink-0">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Package size={16} className="text-rose-400" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</p>
                                                        <p className="text-sm font-mono font-medium">#{order.id.slice(0, 10)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={16} className="text-rose-400" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Date</p>
                                                        <p className="text-sm font-medium">{order.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CreditCard size={16} className="text-rose-400" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Paid</p>
                                                        <p className="text-sm font-bold">₹{order.pricing?.grandTotal?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={16} className="text-rose-400" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Deliver To</p>
                                                        <p className="text-xs text-gray-600">
                                                            {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status badge */}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${style.bg} ${style.text}`}>
                                                    {style.dot} {order.status}
                                                </span>

                                                {/* ✅ Return window indicator */}
                                                {order.status === "delivered" && (
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold
                                                        ${eligible ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                                                    >
                                                        <Clock size={12} />
                                                        {eligible
                                                            ? `Return eligible · ${daysLeft}d left`
                                                            : "Return window expired"
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right — items preview */}
                                        <div className="flex-1 bg-white p-8">
                                            <ul className="divide-y divide-rose-50">
                                                {order.items?.map((item, i) => (
                                                    <li key={i} className="py-5 first:pt-0 last:pb-0 flex items-center gap-4">
                                                        <div className="h-20 w-20 flex-shrink-0 bg-rose-50 rounded-2xl p-2 border border-rose-100">
                                                            <img
                                                                src={item.thumbnail}
                                                                alt={item.name}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.brand}</p>
                                                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                                                <span>Size: {item.selectedSize}</span>
                                                                <span>·</span>
                                                                <span>Qty: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0 space-y-2">
                                                            <p className="text-sm font-bold text-gray-900">
                                                                ₹{(item.price * item.quantity).toLocaleString()}
                                                            </p>

                                                            {/* ✅ Replace/Return button */}
                                                            {order.status === "delivered" && eligible && (
                                                                <div className="flex gap-2 mt-1">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleReplace(order, item, "return");
                                                                        }}
                                                                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:underline"
                                                                    >
                                                                        <RefreshCw size={10} /> Return
                                                                    </button>
                                                                    <span className="text-gray-300">|</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleReplace(order, item, "replace");
                                                                        }}
                                                                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-500 hover:underline"
                                                                    >
                                                                        <RefreshCw size={10} /> Replace
                                                                    </button>
                                                                </div>
                                                            )}

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/productdetails/${item.productId}`);
                                                                }}
                                                                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                                                            >
                                                                View Item <ChevronRight size={10} />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>


                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-100 bg-gray-50/50"
                                            >
                                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                                                    {/* Delivery address */}
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                                                            Delivery Address
                                                        </p>
                                                        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-1">
                                                            <p className="font-bold text-gray-900">{order.userInfo?.name}</p>
                                                            <p className="text-sm text-gray-600">{order.deliveryAddress?.address}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                                                            </p>
                                                            <p className="text-sm text-gray-500 pt-1">📞 {order.userInfo?.phone}</p>
                                                        </div>
                                                    </div>

                                                    {/* Price breakdown */}
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                                                            Price Breakdown
                                                        </p>
                                                        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2 text-sm">
                                                            <div className="flex justify-between text-gray-500">
                                                                <span>Subtotal</span>
                                                                <span>₹{order.pricing?.subtotal?.toLocaleString()}</span>
                                                            </div>
                                                            {order.pricing?.discount > 0 && (
                                                                <div className="flex justify-between text-green-600">
                                                                    <span>Discount</span>
                                                                    <span>- ₹{order.pricing?.discount?.toLocaleString()}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between text-gray-500">
                                                                <span>Shipping</span>
                                                                <span>{order.pricing?.shipping === 0 ? "Free 🎉" : `₹${order.pricing?.shipping}`}</span>
                                                            </div>
                                                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                                                                <span>Total</span>
                                                                <span>₹{order.pricing?.grandTotal?.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider pt-1">
                                                                <span>Payment</span>
                                                                <span>{order.paymentMethod}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};