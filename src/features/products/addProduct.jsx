import { useContext, useState } from "react";
import MyContext from "../context/mycontext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "../../componets/loader";
import { Firedb } from "../../firebase/firebaseConfig";
import { motion } from "framer-motion";
import { PlusCircle, Image as ImageIcon, Tag, IndianRupee, AlignLeft } from "lucide-react";

const categoryList = [
    { name: 'shoes' }, { name: 'fashion' }, { name: 'shirt' },
    { name: 'jacket' }, { name: 'mobile' }, { name: 'laptop' },
    { name: 'home' }, { name: 'books' }
];

export const AddProductPage = () => {
    const context = useContext(MyContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [products, setProducts] = useState({
        title: "",
        price: "",
        image: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    });

    const addProductFunction = async () => {
        if (!products.title || !products.price || !products.category || !products.image || !products.description) {
            return alert("Please fill all fields to maintain catalog quality.");
        }
        setLoading(true);
        try {
            const productRef = collection(Firedb, 'products');
            await addDoc(productRef, products);
            alert("Product added to luxury catalog!");
            setLoading(false);
            navigate("/admin-dashboard"); // Updated to a standard route
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
            {loading && <Loader />}
            
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* --- Form Section --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-rose-50/50 p-8 md:p-10 rounded-[3rem] border border-rose-100 shadow-sm"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-serif italic text-gray-900">Add New Masterpiece</h2>
                        <p className="text-gray-500 text-sm mt-2">Enter the details to list a new item in your boutique.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Title Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Product Title"
                                value={products.title}
                                onChange={(e) => setProducts({ ...products, title: e.target.value })}
                                className="w-full bg-white border border-rose-100 px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-gray-300"
                            />
                            <Tag className="absolute left-3 top-3.5 text-rose-300" size={18} />
                        </div>

                        {/* Price & Quantity */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={products.price}
                                    onChange={(e) => setProducts({ ...products, price: e.target.value })}
                                    className="w-full bg-white border border-rose-100 px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-gray-300"
                                />
                                <IndianRupee className="absolute left-3 top-3.5 text-rose-300" size={18} />
                            </div>
                            <input
                                type="number"
                                placeholder="Qty"
                                value={products.quantity}
                                onChange={(e) => setProducts({ ...products, quantity: e.target.value })}
                                className="w-24 bg-white border border-rose-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={products.image}
                                onChange={(e) => setProducts({ ...products, image: e.target.value })}
                                className="w-full bg-white border border-rose-100 px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-gray-300"
                            />
                            <ImageIcon className="absolute left-3 top-3.5 text-rose-300" size={18} />
                        </div>

                        {/* Category Select */}
                        <select 
                            className="w-full bg-white border border-rose-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all text-gray-600 appearance-none"
                            value={products.category}
                            onChange={(e) => setProducts({ ...products, category: e.target.value })}
                        >
                            <option value="" disabled>Select Category</option>
                            {categoryList.map((cat, i) => (
                                <option key={i} value={cat.name} className="capitalize">{cat.name}</option>
                            ))}
                        </select>

                        {/* Description */}
                        <div className="relative">
                            <textarea 
                                placeholder="Description" 
                                rows="4"
                                value={products.description}
                                onChange={(e) => setProducts({ ...products, description: e.target.value })}
                                className="w-full bg-white border border-rose-100 px-10 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-gray-300 resize-none"
                            />
                            <AlignLeft className="absolute left-3 top-3.5 text-rose-300" size={18} />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={addProductFunction}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-rose-500 transition-colors shadow-lg shadow-gray-200"
                        >
                            <PlusCircle size={18} /> List Product
                        </motion.button>
                    </div>
                </motion.div>

                {/* --- Preview Section --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block sticky top-12"
                >
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-400 mb-6 text-center">Live Preview</p>
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-2xl shadow-rose-100/50">
                        <div className="aspect-square bg-gray-50 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center p-6">
                            {products.image ? (
                                <img src={products.image} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <ImageIcon size={48} className="text-gray-200" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{products.category || 'Category'}</span>
                            <h3 className="text-xl font-serif italic text-gray-900">{products.title || 'Product Name'}</h3>
                            <p className="text-2xl font-bold text-gray-900">₹{products.price || '0'}</p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};