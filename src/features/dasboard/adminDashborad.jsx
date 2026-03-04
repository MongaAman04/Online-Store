import { motion } from "framer-motion";
import { ShoppingBasket, ListOrdered, Users, LayoutDashboard, UserCircle } from "lucide-react";
import ProductDetail from "../products/productDetails";

export const AdminDashBoard = () => {
    // Safety check for user data
    const user = JSON.parse(localStorage.getItem('users')) || { name: "Admin", email: "admin@pksluxe.com" };

    const stats = [
        {
            id: "products",
            label: "Total Products",
            count: 120,
            icon: <ShoppingBasket size={32} />,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: "orders",
            label: "Total Orders",
            count: 450,
            icon: <ListOrdered size={32} />,
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            id: "users",
            label: "Total Users",
            count: 890,
            icon: <Users size={32} />,
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* --- Top Header --- */}
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-500 p-2 rounded-lg text-white">
                            <LayoutDashboard size={24} />
                        </div>
                        <h1 className="text-2xl font-serif italic font-bold text-gray-900">Boutique Management</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <UserCircle className="text-rose-400" size={20} />
                        <div className="text-sm">
                            <span className="font-bold text-gray-900">{user.name}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/20 transition-all cursor-pointer"
                        >
                            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                                {stat.icon}
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-1">{stat.count}</h2>
                            <p className="text-xs uppercase tracking-widest font-bold text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* --- Management Section --- */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="text-lg font-bold text-gray-900">Inventory Overview</h2>
                    </div>
                    <div className="p-2 md:p-8">
                        <ProductDetail />
                    </div>
                </div>
            </div>
        </div>
    );
};