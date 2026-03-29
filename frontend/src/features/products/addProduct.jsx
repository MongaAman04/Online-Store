import { useContext, useState, useRef } from "react";
import MyContext from "../context/mycontext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "../../componets/loader";
import { Firedb } from "../../config/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    PlusCircle, ImageIcon, Tag, IndianRupee,
    AlignLeft, Layers, Upload, X, Percent, Package, Plus, Minus
} from "lucide-react";
import { uploadImage } from "../../config/cloudinary-config";

const categoryList = [
    { name: "sneakers" }, { name: "heels" }, { name: "sandals" },
    { name: "boots" }, { name: "flats" }, { name: "loafers" },
    { name: "sports" }, { name: "formal" }
];

const genderList = ["men", "women", "unisex", "kids"];
const sizeOptions = [5, 6, 7, 8, 9, 10, 11, 12];

export const AddProductPage = () => {
    const { loading, setLoading } = useContext(MyContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [products, setProducts] = useState({
        name: "",
        description: "",
        brand: "",
        category: "",
        subCategory: "",
        price: "",
        originalPrice: "",
        discount: 0,
        // ✅ sizeInventory replaces flat stock & sizes
        // { 6: 10, 7: 5, 8: 0 } etc.
        sizeInventory: {},
        images: [],
        thumbnail: "",
        isFeatured: false,
        isActive: true,
        isTrending: false,
        tags: "",
        gender: "",
        rating: 0,
        totalReviews: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});

    // ✅ Toggle size — adds with qty 1, removes if toggled off
    const toggleSize = (size) => {
        setProducts(prev => {
            const updated = { ...prev.sizeInventory };
            if (updated[size] !== undefined) {
                delete updated[size]; // remove size
            } else {
                updated[size] = 1;   // add size with default qty 1
            }
            return { ...prev, sizeInventory: updated };
        });
    };

    // ✅ Update quantity for a specific size
    const updateSizeQty = (size, delta) => {
        setProducts(prev => {
            const current = prev.sizeInventory[size] ?? 1;
            const newQty = Math.max(1, current + delta); // min qty = 1
            return {
                ...prev,
                sizeInventory: { ...prev.sizeInventory, [size]: newQty }
            };
        });
    };

    // ✅ Total stock = sum of all size quantities
    const totalStock = Object.values(products.sizeInventory).reduce((a, b) => a + b, 0);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imagePreviews.length > 4) {
            toast.error("Maximum 4 images allowed.");
            return;
        }
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handlePriceChange = (field, value) => {
        const updated = { ...products, [field]: value };
        if (updated.originalPrice && updated.price) {
            updated.discount = Math.round(
                ((updated.originalPrice - updated.price) / updated.originalPrice) * 100
            );
        }
        setProducts(updated);
    };

    const validate = () => {
        const newErrors = {};
        if (!products.name.trim()) newErrors.name = "Product name is required.";
        if (!products.brand.trim()) newErrors.brand = "Brand is required.";
        if (!products.category) newErrors.category = "Category is required.";
        if (!products.gender) newErrors.gender = "Gender is required.";
        if (!products.price || isNaN(products.price)) newErrors.price = "Valid price is required.";
        if (!products.originalPrice || isNaN(products.originalPrice)) newErrors.originalPrice = "Valid original price is required.";
        if (Number(products.price) > Number(products.originalPrice)) newErrors.price = "Price cannot exceed original price.";
        if (!products.description.trim()) newErrors.description = "Description is required.";
        if (Object.keys(products.sizeInventory).length === 0) newErrors.sizes = "Select at least one size.";
        if (imageFiles.length === 0) newErrors.images = "At least one image is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addProductFunction = async () => {
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setLoading(true);
        try {
            const uploadedUrls = await Promise.all(
                imageFiles.map(file => uploadImage(file))
            );

            const productData = {
                ...products,
                name: products.name.trim(),
                brand: products.brand.trim(),
                description: products.description.trim(),
                price: Number(products.price),
                originalPrice: Number(products.originalPrice),
                // ✅ Save sizeInventory as object + totalStock as convenience field
                sizeInventory: products.sizeInventory,
                stock: totalStock,
                sizes: Object.keys(products.sizeInventory).map(Number), // [6, 7, 8]
                images: uploadedUrls,
                thumbnail: uploadedUrls[0],
                tags: products.tags.split(",").map(t => t.trim()).filter(Boolean),
                updatedAt: Timestamp.now(),
            };

            const productRef = collection(Firedb, "products");
            await addDoc(productRef, productData);

            toast.success("Product listed successfully!");
            setLoading(false);
            navigate("/profile/admin");

        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error("Failed to add product. Please try again.");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">

                <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400 mb-1">Admin Panel</p>
                    <h1 className="text-4xl font-serif italic text-gray-900">Add New Product</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    {/* ── Form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100 space-y-5"
                    >
                        {/* Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={products.name}
                                    onChange={(e) => {
                                        setProducts({ ...products, name: e.target.value });
                                        setErrors(p => ({ ...p, name: "" }));
                                    }}
                                    className={`w-full bg-white border px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 transition-all
                                        ${errors.name ? "border-red-400" : "border-rose-100"}`}
                                />
                                <Tag className="absolute left-3 top-3.5 text-rose-300" size={18} />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                        </div>

                        {/* Brand */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Brand (e.g. Nike, Puma)"
                                    value={products.brand}
                                    onChange={(e) => {
                                        setProducts({ ...products, brand: e.target.value });
                                        setErrors(p => ({ ...p, brand: "" }));
                                    }}
                                    className={`w-full bg-white border px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 transition-all
                                        ${errors.brand ? "border-red-400" : "border-rose-100"}`}
                                />
                                <Layers className="absolute left-3 top-3.5 text-rose-300" size={18} />
                            </div>
                            {errors.brand && <p className="text-red-500 text-xs mt-1 ml-2">{errors.brand}</p>}
                        </div>

                        {/* Price + Original Price */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Sale Price"
                                        value={products.price}
                                        onChange={(e) => {
                                            handlePriceChange("price", e.target.value);
                                            setErrors(p => ({ ...p, price: "" }));
                                        }}
                                        className={`w-full bg-white border px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 transition-all
                                            ${errors.price ? "border-red-400" : "border-rose-100"}`}
                                    />
                                    <IndianRupee className="absolute left-3 top-3.5 text-rose-300" size={18} />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1 ml-2">{errors.price}</p>}
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Original Price"
                                        value={products.originalPrice}
                                        onChange={(e) => {
                                            handlePriceChange("originalPrice", e.target.value);
                                            setErrors(p => ({ ...p, originalPrice: "" }));
                                        }}
                                        className={`w-full bg-white border px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 transition-all
                                            ${errors.originalPrice ? "border-red-400" : "border-rose-100"}`}
                                    />
                                    <Percent className="absolute left-3 top-3.5 text-rose-300" size={18} />
                                </div>
                                {errors.originalPrice && <p className="text-red-500 text-xs mt-1 ml-2">{errors.originalPrice}</p>}
                            </div>
                        </div>

                        {products.discount > 0 && (
                            <p className="text-green-600 text-xs font-bold ml-2">
                                ✅ {products.discount}% discount auto-calculated
                            </p>
                        )}

                        {/* Category + Gender */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <select
                                    className={`w-full bg-white border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 text-gray-600 transition-all
                                        ${errors.category ? "border-red-400" : "border-rose-100"}`}
                                    value={products.category}
                                    onChange={(e) => {
                                        setProducts({ ...products, category: e.target.value });
                                        setErrors(p => ({ ...p, category: "" }));
                                    }}
                                >
                                    <option value="" disabled>Category</option>
                                    {categoryList.map((cat, i) => (
                                        <option key={i} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1 ml-2">{errors.category}</p>}
                            </div>
                            <div className="flex-1">
                                <select
                                    className={`w-full bg-white border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 text-gray-600 transition-all
                                        ${errors.gender ? "border-red-400" : "border-rose-100"}`}
                                    value={products.gender}
                                    onChange={(e) => {
                                        setProducts({ ...products, gender: e.target.value });
                                        setErrors(p => ({ ...p, gender: "" }));
                                    }}
                                >
                                    <option value="" disabled>Gender</option>
                                    {genderList.map((g, i) => (
                                        <option key={i} value={g}>{g}</option>
                                    ))}
                                </select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1 ml-2">{errors.gender}</p>}
                            </div>
                        </div>

                        {/* ✅ Size + Quantity Manager */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">
                                    Sizes & Quantity
                                </p>
                                {totalStock > 0 && (
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                        Total Stock: {totalStock}
                                    </span>
                                )}
                            </div>

                            {/* Size toggle buttons */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {sizeOptions.map(size => {
                                    const isSelected = products.sizeInventory[size] !== undefined;
                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                toggleSize(size);
                                                setErrors(p => ({ ...p, sizes: "" }));
                                            }}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all
                                                ${isSelected
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-500 border-rose-100 hover:border-rose-400"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ✅ Quantity controls for selected sizes */}
                            <AnimatePresence>
                                {Object.keys(products.sizeInventory).length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white rounded-2xl border border-rose-100 p-4 space-y-3"
                                    >
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                            Set quantity per size
                                        </p>
                                        {Object.entries(products.sizeInventory)
                                            .sort(([a], [b]) => Number(a) - Number(b))
                                            .map(([size, qty]) => (
                                                <div key={size} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 bg-gray-900 text-white text-xs font-bold rounded-lg flex items-center justify-center">
                                                            {size}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">UK Size {size}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Qty control */}
                                                        <div className="flex items-center border border-rose-100 rounded-full px-2 py-1 gap-1 bg-rose-50/50">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateSizeQty(Number(size), -1)}
                                                                className="p-1 hover:text-rose-500 transition-colors"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                                                                {qty}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateSizeQty(Number(size), 1)}
                                                                className="p-1 hover:text-rose-500 transition-colors"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                        {/* Stock badge */}
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                                            ${qty > 10 ? "bg-green-100 text-green-600"
                                                            : qty > 3 ? "bg-amber-100 text-amber-600"
                                                            : "bg-red-100 text-red-500"}`}
                                                        >
                                                            {qty > 10 ? "In Stock" : qty > 3 ? "Low" : "Critical"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {errors.sizes && <p className="text-red-500 text-xs mt-1 ml-2">{errors.sizes}</p>}
                        </div>

                        {/* Tags */}
                        <input
                            type="text"
                            placeholder="Tags (comma separated: nike, running, men)"
                            value={products.tags}
                            onChange={(e) => setProducts({ ...products, tags: e.target.value })}
                            className="w-full bg-white border border-rose-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 transition-all"
                        />

                        {/* Description */}
                        <div>
                            <div className="relative">
                                <textarea
                                    placeholder="Product Description"
                                    rows="3"
                                    value={products.description}
                                    onChange={(e) => {
                                        setProducts({ ...products, description: e.target.value });
                                        setErrors(p => ({ ...p, description: "" }));
                                    }}
                                    className={`w-full bg-white border px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-gray-300 resize-none transition-all
                                        ${errors.description ? "border-red-400" : "border-rose-100"}`}
                                />
                                <AlignLeft className="absolute left-3 top-3.5 text-rose-300" size={18} />
                            </div>
                            {errors.description && <p className="text-red-500 text-xs mt-1 ml-2">{errors.description}</p>}
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-4 flex-wrap">
                            {[
                                { key: "isFeatured", label: "Featured" },
                                { key: "isTrending", label: "Trending" },
                                { key: "isActive", label: "Active" },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setProducts(p => ({ ...p, [key]: !p[key] }))}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${products[key] ? "bg-rose-500" : "bg-gray-200"}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${products[key] ? "left-5" : "left-0.5"}`} />
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">{label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
                                Product Images (max 4)
                            </p>
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={`w-full border-2 border-dashed rounded-2xl py-6 flex flex-col items-center justify-center cursor-pointer transition-all
                                    ${errors.images ? "border-red-400 bg-red-50" : "border-rose-200 bg-white hover:border-rose-400 hover:bg-rose-50"}`}
                            >
                                <Upload className="text-rose-300 mb-2" size={24} />
                                <p className="text-gray-400 text-sm">Click to upload images</p>
                                <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB each</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {errors.images && <p className="text-red-500 text-xs mt-1 ml-2">{errors.images}</p>}

                            <AnimatePresence>
                                {imagePreviews.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3 mt-3 flex-wrap"
                                    >
                                        {imagePreviews.map((src, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose-100"
                                            >
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                {i === 0 && (
                                                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-rose-500 text-white font-bold py-0.5">
                                                        COVER
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow"
                                                >
                                                    <X size={10} className="text-gray-600" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={addProductFunction}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors shadow-lg shadow-gray-200"
                        >
                            <PlusCircle size={18} /> List Product
                        </motion.button>
                    </motion.div>

                    {/* ── Live Preview ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block sticky top-12"
                    >
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400 mb-6 text-center">Live Preview</p>
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-2xl shadow-rose-100/50">
                            <div className="aspect-square bg-gray-50 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center">
                                {imagePreviews[0] ? (
                                    <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-200" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                        {products.category || "Category"}
                                    </span>
                                    {products.gender && (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            · {products.gender}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-serif italic text-gray-900">{products.name || "Product Name"}</h3>
                                <p className="text-gray-400 text-xs line-clamp-2">{products.description || "Description will appear here..."}</p>
                                <div className="flex items-center gap-3 pt-1">
                                    <p className="text-2xl font-bold text-gray-900">₹{products.price || "0"}</p>
                                    {products.originalPrice && (
                                        <p className="text-gray-400 line-through text-sm">₹{products.originalPrice}</p>
                                    )}
                                    {products.discount > 0 && (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {products.discount}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* ✅ Live preview of sizes with qty */}
                                {Object.keys(products.sizeInventory).length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Sizes</p>
                                        <div className="flex gap-1 flex-wrap">
                                            {Object.entries(products.sizeInventory)
                                                .sort(([a], [b]) => Number(a) - Number(b))
                                                .map(([size, qty]) => (
                                                    <div key={size} className="flex flex-col items-center">
                                                        <span className="text-xs border border-gray-200 px-2 py-0.5 rounded-lg text-gray-600 font-bold">
                                                            {size}
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 mt-0.5">x{qty}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            Total Stock: <span className="font-bold text-gray-600">{totalStock}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};