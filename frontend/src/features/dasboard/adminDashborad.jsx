import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBasket, ListOrdered, Users, LayoutDashboard, 
    UserCircle, Menu, X, ChevronRight, LogOut, PackageSearch, 
    Replace
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { Firedb } from "../../config/firebaseConfig";
import Cookies from "js-cookie";

import { InventoryManager } from "./view/inventory-manager";
import { OrderManagement } from "./view/order-manager";
import { ReturnManagement } from "./view/retrun-orders";


export const AdminDashBoard = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [counts, setCounts] = useState({ products: 0, orders: 0, users: 0 });
    
    const user = JSON.parse(Cookies.get("users") || "null") || { name: "Admin", email: "admin@pksluxe.com" };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [productsSnap, ordersSnap, usersSnap] = await Promise.all([
                    getCountFromServer(collection(Firedb, "products")),
                    getCountFromServer(collection(Firedb, "orders")),
                    getCountFromServer(collection(Firedb, "user")),
                ]);
                setCounts({
                    products: productsSnap.data().count,
                    orders: ordersSnap.data().count,
                    users: usersSnap.data().count,
                });
            } catch (error) { console.error(error); }
        };
        fetchCounts();
    }, []);

    const menuItems = [
        { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { id: "inventory", label: "Inventory", icon: <ShoppingBasket size={20} /> },
        { id: "orders", label: "Orders", icon: <ListOrdered size={20} /> },
        { id: "replace", label: "Replace Orders", icon: <Replace size={20} /> },
        { id: "users", label: "Clients", icon: <Users size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex">
            
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 sticky top-0 h-screen p-6">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-200">
                        <PackageSearch size={22} />
                    </div>
                    <span className="text-xl font-serif italic font-bold tracking-tight">PKS Luxe</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                                activeSection === item.id 
                                ? "bg-rose-50 text-rose-600 shadow-sm" 
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                            </div>
                            {activeSection === item.id && <motion.div layoutId="indicator" className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                        <span className="text-sm font-bold">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col">
                
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <div className="bg-rose-500 p-1.5 rounded-lg text-white">
                            <PackageSearch size={18} />
                        </div>
                        <span className="font-serif italic font-bold">PKS Luxe</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-50 rounded-full text-gray-500">
                        <Menu size={20} />
                    </button>
                </header>

                {/* Content Render */}
                <div className="p-6 md:p-10 max-w-7xl w-full mx-auto">
                    <AnimatePresence mode="wait">
                        {activeSection === "dashboard" && (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                                <Header user={user} />
                                <StatsGrid counts={counts} />
                            </motion.div>
                        )}

                        {activeSection === "inventory" && <InventoryManager />}
                        {activeSection === "orders" && <OrderManagement />}
                        {activeSection === "replace" && <ReturnManagement />}
                        
                        {activeSection === "users" && (
                            <div className="h-96 border-2 border-dashed border-gray-200 rounded-[3rem] flex items-center justify-center text-gray-400 font-serif italic">
                                Client Database Section (Coming Soon)
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* --- MOBILE OVERLAY MENU --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[60] p-8 lg:hidden shadow-2xl"
                        >
                            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full">
                                <X size={20} />
                            </button>
                            <div className="mt-12 space-y-6">
                                {menuItems.map(item => (
                                    <button 
                                        key={item.id} 
                                        onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                                        className={`flex items-center gap-4 text-lg font-bold ${activeSection === item.id ? "text-rose-500" : "text-gray-400"}`}
                                    >
                                        {item.icon} {item.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components for cleaner code
const Header = ({ user }) => (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-serif italic font-bold text-gray-900">Good Morning, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400 text-sm mt-1">Here is what's happening in your boutique today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Owner</span>
            </div>
        </div>
    </div>
);

const StatsGrid = ({ counts }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Products" value={counts.products} icon={<ShoppingBasket/>} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Orders" value={counts.orders} icon={<ListOrdered/>} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Users" value={counts.users} icon={<Users/>} color="text-amber-600" bg="bg-amber-50" />
    </div>
);

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
        <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
            {icon}
        </div>
        <h3 className="text-4xl font-bold text-gray-900">{value}</h3>
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">{label}</p>
    </div>
);