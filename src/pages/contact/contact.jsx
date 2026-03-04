import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-rose-50/50 py-20 px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          className="text-xs uppercase text-rose-500 font-bold mb-4"
        >
          Get In Touch
        </motion.h2>
        <h1 className="text-5xl font-serif italic text-gray-900">We’re here to help you shine.</h1>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* --- Left Column: Info --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <h3 className="text-2xl font-serif mb-6 text-gray-800">Visit Our Studio</h3>
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="flex items-start gap-4 text-gray-600">
                <FaMapMarkerAlt className="text-rose-400 mt-1" />
                <p className="font-light leading-relaxed">
                  123 Fashion Enclave, Luxury Row,<br />
                  Mumbai, Maharashtra - 400001
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-4 text-gray-600">
                <FaEnvelope className="text-rose-400" />
                <p className="font-light">concierge@pksluxe.com</p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-4 text-gray-600">
                <FaWhatsapp className="text-rose-400" />
                <p className="font-light">+91 98765 43210</p>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-serif mb-6 text-gray-800">Follow the Journey</h3>
            <div className="flex gap-6">
              {[<FaInstagram />, <FaWhatsapp />, <FaEnvelope />].map((icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5, color: "#e11d48" }}
                  href="#"
                  className="text-2xl text-gray-400 transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-rose-50/50 border border-rose-100">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-800 mb-2">Customer Care Hours</h4>
            <p className="text-sm text-gray-500 font-light">Monday – Friday: 10:00 AM – 7:00 PM</p>
            <p className="text-sm text-gray-500 font-light">Saturday: 11:00 AM – 4:00 PM</p>
          </div>
        </motion.div>

        {/* --- Right Column: Contact Form --- */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-rose-100/50 border border-rose-50"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 mb-2 block">Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300"
                />
              </div>
              <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 mb-2 block">Email</label>
                <input 
                  type="email" 
                  placeholder="Your Email"
                  className="w-full border-b border-gray-200 py-2 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 mb-2 block">Subject</label>
              <select className="w-full border-b border-gray-200 py-2 outline-none focus:border-rose-400 transition-colors bg-transparent text-gray-500 font-light">
                <option>Size Consultation</option>
                <option>Order Tracking</option>
                <option>Returns & Exchanges</option>
                <option>Others</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 mb-2 block">Message</label>
              <textarea 
                rows="4" 
                placeholder="How can we assist you today?"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-rose-400 transition-colors bg-transparent placeholder-gray-300 resize-none"
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gray-900 text-white rounded-full font-bold tracking-[0.2em] text-xs hover:bg-rose-600 transition-all shadow-lg shadow-gray-200"
            >
              SEND MESSAGE
            </motion.button>
          </form>
        </motion.div>

      </section>

      {/* Subtle Bottom Map or Image Placeholder */}
      <div className="w-full h-[400px] bg-gray-100 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden">
         <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop" 
          className="w-full h-full object-cover" 
          alt="Our Boutique"
         />
      </div>
    </div>
  );
};