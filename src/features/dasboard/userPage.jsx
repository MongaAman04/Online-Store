import { motion } from "framer-motion";
import { LogOut, Package, Calendar, CreditCard, ChevronRight } from "lucide-react";

const products = [
    {
        id: 1,
        name: 'Nike Air Force 1 07 LV8',
        imageSrc: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/54a510de-a406-41b2-8d62-7f8c587c9a7e/air-force-1-07-lv8-shoes-9KwrSk.png',
        price: '₹61,999',
        color: 'Orange',
        quantity: 1,
    },
];

export const Userpage = () => {
    // Safety check for user data
    const user = JSON.parse(localStorage.getItem('users')) || { name: "Guest", email: "Not Available" };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* --- Top Section: Profile Header --- */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-rose-50 rounded-[3rem] p-8 md:p-12 mb-12 border border-rose-100 overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
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
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl" />
                </motion.div>

                {/* --- Bottom Section: Orders --- */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif italic text-gray-900">Purchase History</h2>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Orders: 1</span>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="overflow-hidden rounded-[2.5rem] border border-rose-50 shadow-2xl shadow-rose-100/20"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Order Sidebar Summary */}
                            <div className="w-full lg:w-80 bg-rose-50/30 p-8 border-b lg:border-b-0 lg:border-r border-rose-50">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-gray-900">
                                        <Package size={18} className="text-rose-400" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</p>
                                            <p className="text-sm font-medium">#74557994327</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-900">
                                        <Calendar size={18} className="text-rose-400" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Date</p>
                                            <p className="text-sm font-medium">4 March, 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-900">
                                        <CreditCard size={18} className="text-rose-400" />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Paid</p>
                                            <p className="text-sm font-bold">₹84,499</p>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            ● Confirmed
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items List */}
                            <div className="flex-1 bg-white p-8">
                                <ul className="divide-y divide-rose-50">
                                    {products.map((product) => (
                                        <li key={product.id} className="py-6 first:pt-0 last:pb-0 flex items-center gap-6">
                                            <div className="h-24 w-24 flex-shrink-0 bg-rose-50 rounded-2xl p-2 border border-rose-100">
                                                <img 
                                                    src={product.imageSrc} 
                                                    alt={product.name} 
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
                                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{product.color}</p>
                                                <p className="text-xs font-medium text-gray-400 mt-2">Qty: {product.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{product.price}</p>
                                                <button className="mt-2 text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:underline uppercase tracking-widest">
                                                    View Item <ChevronRight size={10} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};