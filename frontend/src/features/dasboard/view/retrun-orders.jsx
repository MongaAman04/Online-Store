import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    RefreshCw, Search, Filter, Package,
    CheckCircle, XCircle, Clock, Phone,
    Mail, MapPin, ChevronDown
} from "lucide-react";
import { Firedb } from "../../../config/firebaseConfig";

const STATUS_OPTIONS = ["pending", "approved", "rejected", "completed"];

const STATUS_STYLES = {
    pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    approved: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    rejected: { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
    completed: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
};

const TYPE_STYLES = {
    return: { bg: "bg-rose-50", text: "text-rose-500", label: "Return" },
    replace: { bg: "bg-purple-50", text: "text-purple-600", label: "Replace" },
};

export const ReturnManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // ✅ Fetch return requests real-time
    useEffect(() => {
        const q = query(
            collection(Firedb, "returnRequests"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            toast.error("Failed to load requests.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Update request status
    const updateStatus = async (requestId, newStatus) => {
        setUpdatingId(requestId);
        try {
            await updateDoc(doc(Firedb, "returnRequests", requestId), {
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === "approved" && { approvedAt: new Date() }),
                ...(newStatus === "completed" && { completedAt: new Date() }),
            });
            toast.success(`Request marked as ${newStatus}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    // ✅ Filter + search
    const filtered = requests.filter(r => {
        const matchSearch =
            r.userInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.userInfo?.phone?.includes(search) ||
            r.orderId?.toLowerCase().includes(search.toLowerCase()) ||
            r.item?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        const matchType = filterType === "all" || r.type === filterType;
        return matchSearch && matchStatus && matchType;
    });

    // ✅ Stats
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        approved: requests.filter(r => r.status === "approved").length,
        completed: requests.filter(r => r.status === "completed").length,
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400 mb-1">Admin Panel</p>
                        <h1 className="text-3xl font-serif italic text-gray-900">Return & Replace Requests</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, order ID, product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border border-gray-200 pl-10 pr-6 py-2.5 rounded-full w-full md:w-80 outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all shadow-sm text-sm"
                        />
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: stats.total, color: "bg-gray-900", icon: <Package size={18} /> },
                        { label: "Pending", value: stats.pending, color: "bg-amber-500", icon: <Clock size={18} /> },
                        { label: "Approved", value: stats.approved, color: "bg-blue-500", icon: <CheckCircle size={18} /> },
                        { label: "Completed", value: stats.completed, color: "bg-green-500", icon: <RefreshCw size={18} /> },
                    ].map(({ label, value, color, icon }) => (
                        <div key={label} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center flex-shrink-0`}>
                                {icon}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
                                <p className="text-2xl font-bold text-gray-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-wrap gap-3 items-center">
                    <Filter size={14} className="text-gray-400" />

                    {/* Status filters */}
                    <div className="flex gap-2 flex-wrap">
                        {["all", ...STATUS_OPTIONS].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                    ${filterStatus === s
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Type filters */}
                    {["all", "return", "replace"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                ${filterType === t
                                    ? "bg-rose-500 text-white"
                                    : "bg-white border border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {filtered.length} request{filtered.length !== 1 ? "s" : ""} found
                </p>

                {/* ── Requests List ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                        <RefreshCw size={40} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm uppercase tracking-widest">No requests found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filtered.map((req) => {
                                const statusStyle = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
                                const typeStyle = TYPE_STYLES[req.type] || TYPE_STYLES.return;
                                const isExpanded = expandedId === req.id;

                                return (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
                                    >
                                        {/* ── Request Row ── */}
                                        <div
                                            className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
                                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                        >
                                            {/* Product image */}
                                            <img
                                                src={req.item?.thumbnail}
                                                alt={req.item?.name}
                                                className="w-16 h-16 rounded-2xl object-cover bg-rose-50 border border-rose-100 flex-shrink-0"
                                            />

                                            {/* Product info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                                                        {typeStyle.label}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        #{req.orderId?.slice(0, 8)}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-gray-900 truncate">{req.item?.name}</p>
                                                <div className="flex gap-3 text-xs text-gray-400 font-bold uppercase mt-1">
                                                    <span>{req.item?.brand}</span>
                                                    <span>·</span>
                                                    <span>Size: {req.item?.selectedSize}</span>
                                                    <span>·</span>
                                                    <span>Qty: {req.item?.quantity}</span>
                                                </div>
                                            </div>

                                            {/* Client */}
                                            <div className="text-sm flex-shrink-0">
                                                <p className="font-semibold text-gray-900">{req.userInfo?.name}</p>
                                                <p className="text-gray-400 text-xs">{req.userInfo?.phone}</p>
                                            </div>

                                            {/* Reason */}
                                            <div className="hidden md:block max-w-[180px] flex-shrink-0">
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Reason</p>
                                                <p className="text-xs text-gray-600 line-clamp-2">{req.reason || "Not specified"}</p>
                                            </div>

                                            {/* Date */}
                                            <div className="text-xs text-gray-400 flex-shrink-0">
                                                {req.date}
                                            </div>

                                            {/* ✅ Status dropdown */}
                                            <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
                                                <div className="relative">
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => updateStatus(req.id, e.target.value)}
                                                        disabled={updatingId === req.id}
                                                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer outline-none disabled:opacity-50
                                                            ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                                                    >
                                                        {STATUS_OPTIONS.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={10} className={`absolute right-2 top-2 ${statusStyle.text}`} />
                                                </div>
                                            </div>

                                            {/* Expand chevron */}
                                            <ChevronDown
                                                size={16}
                                                className={`text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                                            />
                                        </div>

                                        {/* ── Expanded Details ── */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-100"
                                                >
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/30">

                                                        {/* Reason + notes */}
                                                        <div className="md:col-span-1">
                                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Request Details</p>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Type</p>
                                                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                                                                        {typeStyle.label}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Reason</p>
                                                                    <p className="text-sm text-gray-700">{req.reason || "Not specified"}</p>
                                                                </div>
                                                                {req.notes && (
                                                                    <div>
                                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Additional Notes</p>
                                                                        <p className="text-sm text-gray-600">{req.notes}</p>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Requested On</p>
                                                                    <p className="text-sm text-gray-700">{req.date}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Product detail */}
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Product</p>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                                                <div className="flex gap-3 items-center mb-3">
                                                                    <img
                                                                        src={req.item?.thumbnail}
                                                                        alt={req.item?.name}
                                                                        className="w-14 h-14 rounded-xl object-cover bg-rose-50"
                                                                    />
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 text-sm">{req.item?.name}</p>
                                                                        <p className="text-xs text-gray-400">{req.item?.brand}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div className="bg-gray-50 rounded-xl p-2">
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Size</p>
                                                                        <p className="font-bold text-gray-900">{req.item?.selectedSize}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-xl p-2">
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Qty</p>
                                                                        <p className="font-bold text-gray-900">{req.item?.quantity}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-xl p-2">
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
                                                                        <p className="font-bold text-gray-900">₹{req.item?.price?.toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-xl p-2">
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Order ID</p>
                                                                        <p className="font-bold text-gray-900 font-mono text-[10px]">#{req.orderId?.slice(0, 8)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Client contact */}
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Client Info</p>
                                                            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
                                                                        <Phone size={13} className="text-rose-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                                                                        <p className="text-sm font-medium text-gray-900">{req.userInfo?.phone}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
                                                                        <Mail size={13} className="text-rose-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                                                                        <p className="text-xs font-medium text-gray-900 truncate">{req.userInfo?.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center mt-0.5">
                                                                        <MapPin size={13} className="text-rose-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Address</p>
                                                                        <p className="text-xs text-gray-700 leading-relaxed">
                                                                            {req.deliveryAddress?.address}, {req.deliveryAddress?.city}, {req.deliveryAddress?.state} - {req.deliveryAddress?.pincode}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* ✅ Quick action buttons */}
                                                            <div className="flex gap-2 mt-3">
                                                                <button
                                                                    onClick={() => updateStatus(req.id, "approved")}
                                                                    disabled={req.status === "approved" || req.status === "completed" || updatingId === req.id}
                                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                >
                                                                    <CheckCircle size={13} /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => updateStatus(req.id, "rejected")}
                                                                    disabled={req.status === "rejected" || req.status === "completed" || updatingId === req.id}
                                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                                >
                                                                    <XCircle size={13} /> Reject
                                                                </button>
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
                )}
            </div>
        </div>
    );
};