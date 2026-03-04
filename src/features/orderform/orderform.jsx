import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, ShoppingBag, CheckCircle } from "lucide-react";

export const OrderForm = () => {
    const { id, title } = useParams();
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page reload
        
        Notification.requestPermission().then(prem => {
            if (prem === "granted") {
                new Notification("PKS Luxe: Order Confirmed", {
                    body: `Your order for ${title} has been placed successfully!`,
                    icon: "https://cdn-icons-png.flaticon.com/128/1008/1008010.png"
                });
            }
        });

        // Add your logic to save the order to Firebase here
        alert("Order successful!");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-rose-100/50 p-8 border border-gray-100"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4">
                        <ShoppingBag className="text-rose-500" size={28} />
                    </div>
                    <h2 className="text-2xl font-serif italic font-bold text-gray-900">Complete Order</h2>
                    <p className="text-gray-400 text-sm mt-1">Ref: {id.slice(0, 8)}...</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Read-Only Product Info */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Purchasing</label>
                        <p className="text-gray-900 font-medium truncate">{title}</p>
                    </div>

                    {/* User Input Fields */}
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-gray-300" size={18} />
                            <input 
                                required
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-gray-300" size={18} />
                            <input 
                                required
                                type="tel" 
                                placeholder="Mobile Number" 
                                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 text-gray-300" size={18} />
                            <textarea 
                                required
                                rows="3"
                                placeholder="Delivery Address" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all resize-none"
                            />
                        </div>

                        <div className="relative">
                            <CheckCircle className="absolute left-4 top-3.5 text-gray-300" size={18} />
                            <input 
                                required
                                type="number" 
                                placeholder="Pincode" 
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-lg shadow-rose-200 mt-4"
                    >
                        Confirm Placement
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};