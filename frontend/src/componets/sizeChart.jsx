import { useState } from "react";
import { Ruler, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export const SizeChart = () => {
    const [open, setOpen] = useState(false);

    const sizes = [
        { us: "4 ½", europe: "35", india: "3",  uk: "2",  cm: "21.5" },
        { us: "5 ½", europe: "36", india: "4",  uk: "3",  cm: "22"   },
        { us: "6 ½", europe: "37", india: "5",  uk: "4",  cm: "23"   },
        { us: "7 ½", europe: "38", india: "6",  uk: "5",  cm: "24"   },
        { us: "8 ½", europe: "39", india: "7",  uk: "6",  cm: "25"   },
        { us: "9 ½", europe: "40", india: "8",  uk: "7",  cm: "26"   },
        { us: "10 ½",europe: "41", india: "9",  uk: "8",  cm: "27"   },
        { us: "11",  europe: "42", india: "10", uk: "9",  cm: "28"   },
        { us: "12",  europe: "43", india: "11", uk: "10", cm: "29"   },
    ];

    return (
        <>
            {/* ✅ Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
                <Ruler size={14} />
                Size Chart
            </button>

            {/* ✅ Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />

                        {/* Modal content */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 p-4"
                        >
                            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Ruler size={18} className="text-rose-400" />
                                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">
                                            Size Chart
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto p-4">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-900 text-white rounded-2xl">
                                                {["US", "Europe", "India", "UK", "CM"].map(h => (
                                                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-center first:rounded-l-2xl last:rounded-r-2xl">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizes.map((row, i) => (
                                                <motion.tr
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className={`text-center transition-colors hover:bg-rose-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                                >
                                                    <td className="px-4 py-3 font-bold text-gray-900">{row.us}</td>
                                                    <td className="px-4 py-3 text-gray-600">{row.europe}</td>
                                                    <td className="px-4 py-3 text-gray-600">{row.india}</td>
                                                    <td className="px-4 py-3 font-semibold text-rose-500">{row.uk}</td>
                                                    <td className="px-4 py-3 text-gray-500">{row.cm} cm</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 bg-rose-50/50 border-t border-rose-100">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">
                                        India sizes used on this website
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};