import { useEffect, useState, useContext } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle, Trash2, Search, ChevronDown, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import MyContext from "../../context/mycontext";
import { Firedb } from "../../../config/firebaseConfig";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
    pending:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100"  },
    confirmed: { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100"   },
    shipped:   { bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-100" },
    delivered: { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-100"  },
    cancelled: { bg: "bg-red-50",     text: "text-red-500",     border: "border-red-100"    },
};

export const OrderManagement = () => {
    const { setLoading } = useContext(MyContext);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // ✅ Fetch orders real-time
    useEffect(() => {
        const q = query(collection(Firedb, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const orderArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setOrders(orderArray);
            setLocalLoading(false);
        }, (error) => {
            console.error(error);
            toast.error("Failed to load orders.");
            setLocalLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Update order status
    const updateStatus = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(Firedb, "orders", orderId), { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status.");
        }
    };

    // ✅ Delete order
    const deleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(Firedb, "orders", id));
            toast.success("Order deleted.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete order.");
        } finally {
            setDeletingId(null);
        }
    };

    // ✅ Filter + Search
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userInfo?.phone?.includes(searchTerm) ||
            order.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // ✅ Real stats from data
    const stats = {
        total: orders.length,
        inTransit: orders.filter(o => o.status === "shipped").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        pending: orders.filter(o => o.status === "pending").length,
    };

    if (localLoading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-10">

            {/* ── Header ── */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-serif italic text-gray-900">Order Registry</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {orders.length} total orders
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, phone, email, order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-200 pl-12 pr-6 py-2.5 rounded-full w-full md:w-96 outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* ✅ Real Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    <StatCard icon={<ShoppingBag size={20} />} label="Total Orders" value={stats.total} color="bg-blue-500" />
                    <StatCard icon={<Package size={20} />} label="Pending" value={stats.pending} color="bg-amber-500" />
                    <StatCard icon={<Truck size={20} />} label="In Transit" value={stats.inTransit} color="bg-purple-500" />
                    <StatCard icon={<CheckCircle size={20} />} label="Delivered" value={stats.delivered} color="bg-emerald-500" />
                </div>

                {/* ✅ Status filter tabs */}
                <div className="flex gap-2 flex-wrap mt-6">
                    {["all", ...STATUS_OPTIONS].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                ${filterStatus === status
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-rose-300 hover:text-rose-500"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Orders Table ── */}
            <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package size={40} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm uppercase tracking-widest">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Order ID</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Items</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Client</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Amount</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Date</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence>
                                    {filteredOrders.map((order) => {
                                        const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                                        const isExpanded = expandedOrder === order.id;

                                        return (
                                            <>
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="hover:bg-rose-50/20 transition-colors cursor-pointer"
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                >
                                                    {/* Order ID */}
                                                    <td className="px-6 py-4 font-mono text-xs text-gray-400 uppercase">
                                                        #{order.id.slice(0, 8)}
                                                    </td>

                                                    {/* Items preview */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex -space-x-2">
                                                                {order.items?.slice(0, 3).map((item, i) => (
                                                                    <img
                                                                        key={i}
                                                                        src={item.thumbnail}
                                                                        alt={item.name}
                                                                        className="w-8 h-8 rounded-lg object-cover border-2 border-white bg-gray-100"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">
                                                                {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Client */}
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-gray-900">{order.userInfo?.name}</p>
                                                        <p className="text-xs text-gray-400">{order.userInfo?.phone}</p>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-bold text-gray-900">
                                                            ₹{order.pricing?.grandTotal?.toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                                            {order.paymentMethod}
                                                        </p>
                                                    </td>

                                                    {/* ✅ Status Dropdown */}
                                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                        <div className="relative">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer outline-none
                                                                    ${style.bg} ${style.text} ${style.border}`}
                                                            >
                                                                {STATUS_OPTIONS.map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown size={10} className={`absolute right-2 top-2 ${style.text}`} />
                                                        </div>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-6 py-4 text-xs text-gray-500">
                                                        {order.date}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => deleteOrder(order.id)}
                                                                disabled={deletingId === order.id}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                                                            >
                                                                {deletingId === order.id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                                ) : (
                                                                    <Trash2 size={16} />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                                                            >
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>

                                                {/* ✅ Expanded order details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.tr
                                                            key={`${order.id}-expanded`}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                        >
                                                            <td colSpan={7} className="px-6 pb-6 bg-gray-50/50">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">

                                                                    {/* Items detail */}
                                                                    <div className="md:col-span-2 space-y-3">
                                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                                                                            Order Items
                                                                        </p>
                                                                        {order.items?.map((item, i) => (
                                                                            <div key={i} className="flex gap-3 items-center bg-white rounded-2xl p-3 border border-gray-100">
                                                                                <img
                                                                                    src={item.thumbnail}
                                                                                    alt={item.name}
                                                                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                                                                                />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                                                    <div className="flex gap-3 text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                                                        <span>{item.brand}</span>
                                                                                        <span>·</span>
                                                                                        <span>Size: {item.selectedSize}</span>
                                                                                        <span>·</span>
                                                                                        <span>Qty: {item.quantity}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                                                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                                                </p>
                                                                            </div>
                                                                        ))}

                                                                        {/* Pricing summary */}
                                                                        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-sm space-y-2">
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
                                                                                <span>{order.pricing?.shipping === 0 ? "Free" : `₹${order.pricing?.shipping}`}</span>
                                                                            </div>
                                                                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                                                                                <span>Total</span>
                                                                                <span>₹{order.pricing?.grandTotal?.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Client + Delivery Info */}
                                                                    <div className="space-y-3">
                                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                                                                            Client & Delivery
                                                                        </p>
                                                                        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                    <Phone size={14} className="text-rose-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
                                                                                    <p className="text-gray-900 font-medium">{order.userInfo?.phone}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                    <Mail size={14} className="text-rose-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
                                                                                    <p className="text-gray-900 font-medium text-xs truncate">{order.userInfo?.email}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-start gap-2 text-sm">
                                                                                <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                    <MapPin size={14} className="text-rose-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Address</p>
                                                                                    <p className="text-gray-900 font-medium text-xs leading-relaxed">
                                                                                        {order.deliveryAddress?.address}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);