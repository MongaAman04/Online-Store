import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/40 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* --- Animated Outer Rings --- */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                        borderRadius: ["30%", "50%", "30%"] 
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="w-24 h-24 border-2 border-rose-100 absolute"
                />
                
                <motion.div
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                        borderRadius: ["50%", "30%", "50%"] 
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="w-24 h-24 border-t-2 border-rose-500 absolute"
                />

                {/* --- Brand Initial / Icon --- */}
                <div className="relative flex items-center justify-center w-24 h-24">
                    <motion.span 
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-rose-500 font-serif italic text-2xl font-bold tracking-tighter"
                    >
                        PKS
                    </motion.span>
                </div>

                {/* --- Elegant Loading Text --- */}
                <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 flex flex-col items-center gap-1"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900">
                        Loading Experience
                    </span>
                    <div className="h-[1px] w-12 bg-rose-200 overflow-hidden">
                        <motion.div 
                            animate={{ x: [-48, 48] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full bg-rose-500"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Loader;