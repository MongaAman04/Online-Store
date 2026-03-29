import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Firedb } from "../../../config/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    Search, Trash2, ToggleLeft, ToggleRight,
    Package, Filter, ChevronDown, Edit3, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FILTERS = ["all", "active", "inactive", "featured", "trending"];

export const InventoryManager = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    // ✅ Fetch products real-time
    useEffect(() => {
        const q = query(collection(Firedb, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(data);
            setFiltered(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            toast.error("Failed to load inventory.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Search + Filter
    useEffect(() => {
        let result = [...products];

        if (search.trim()) {
            result = result.filter(p =>
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.brand?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (activeFilter === "active") result = result.filter(p => p.isActive);
        if (activeFilter === "inactive") result = result.filter(p => !p.isActive);
        if (activeFilter === "featured") result = result.filter(p => p.isFeatured);
        if (activeFilter === "trending") result = result.filter(p => p.isTrending);

        setFiltered(result);
    }, [search, activeFilter, products]);

    // ✅ Toggle isActive
    const toggleActive = async (product) => {
        try {
            await updateDoc(doc(Firedb, "products", product.id), {
                isActive: !product.isActive
            });
            toast.success(`${product.name} marked as ${!product.isActive ? "Active" : "Inactive"}`);
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    // ✅ Toggle isFeatured
    const toggleFeatured = async (product) => {
        try {
            await updateDoc(doc(Firedb, "products", product.id), {
                isFeatured: !product.isFeatured
            });
            toast.success(`${product.name} ${!product.isFeatured ? "added to" : "removed from"} Featured`);
        } catch (err) {
            toast.error("Failed to update.");
        }
    };

    // ✅ Toggle isTrending
    const toggleTrending = async (product) => {
        try {
            await updateDoc(doc(Firedb, "products", product.id), {
                isTrending: !product.isTrending
            });
            toast.success(`${product.name} ${!product.isTrending ? "marked as" : "removed from"} Trending`);
        } catch (err) {
            toast.error("Failed to update.");
        }
    };

    // ✅ Delete product
    const deleteProduct = async (product) => {
        setDeletingId(product.id);
        try {
            await deleteDoc(doc(Firedb, "products", product.id));
            toast.success(`${product.name} deleted.`);
        } catch (err) {
            toast.error("Failed to delete product.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ── Toolbar ── */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, brand, category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200 text-sm transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-gray-400" />
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                ${activeFilter === f
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Count ── */}
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>

            {/* ── Table ── */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm uppercase tracking-widest">No products found</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Product</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Category</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Price</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Stock</th>
                                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Active</th>
                                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Featured</th>
                                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Trending</th>
                                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filtered.map((product) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white hover:bg-rose-50/30 transition-colors"
                                    >
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 truncate max-w-[140px]">{product.name}</p>
                                                    <p className="text-gray-400 text-xs">{product.brand}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full capitalize">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-gray-900">₹{product.price?.toLocaleString()}</p>
                                            {product.discount > 0 && (
                                                <p className="text-green-500 text-xs font-bold">{product.discount}% off</p>
                                            )}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full
                                                ${product.stock > 10
                                                    ? "bg-green-100 text-green-600"
                                                    : product.stock > 0
                                                    ? "bg-amber-100 text-amber-600"
                                                    : "bg-red-100 text-red-500"
                                                }`}>
                                                {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                                            </span>
                                        </td>

                                        {/* Active Toggle */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleActive(product)}
                                                className="flex items-center justify-center mx-auto transition-transform hover:scale-110"
                                            >
                                                {product.isActive ? (
                                                    <ToggleRight size={28} className="text-green-500" />
                                                ) : (
                                                    <ToggleLeft size={28} className="text-gray-300" />
                                                )}
                                            </button>
                                            <p className={`text-[10px] font-bold mt-0.5 ${product.isActive ? "text-green-500" : "text-gray-400"}`}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </p>
                                        </td>

                                        {/* Featured Toggle */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleFeatured(product)}
                                                className="flex items-center justify-center mx-auto transition-transform hover:scale-110"
                                            >
                                                {product.isFeatured ? (
                                                    <ToggleRight size={28} className="text-rose-500" />
                                                ) : (
                                                    <ToggleLeft size={28} className="text-gray-300" />
                                                )}
                                            </button>
                                            <p className={`text-[10px] font-bold mt-0.5 ${product.isFeatured ? "text-rose-500" : "text-gray-400"}`}>
                                                {product.isFeatured ? "Yes" : "No"}
                                            </p>
                                        </td>

                                        {/* Trending Toggle */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleTrending(product)}
                                                className="flex items-center justify-center mx-auto transition-transform hover:scale-110"
                                            >
                                                {product.isTrending ? (
                                                    <ToggleRight size={28} className="text-amber-500" />
                                                ) : (
                                                    <ToggleLeft size={28} className="text-gray-300" />
                                                )}
                                            </button>
                                            <p className={`text-[10px] font-bold mt-0.5 ${product.isTrending ? "text-amber-500" : "text-gray-400"}`}>
                                                {product.isTrending ? "Yes" : "No"}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => navigate(`/editproduct/${product.id}`)}
                                                    className="p-2 rounded-xl bg-gray-100 hover:bg-rose-100 hover:text-rose-600 text-gray-500 transition-colors"
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => deleteProduct(product)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === product.id ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};