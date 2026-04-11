import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-rose-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* --- Column 1: Brand Story --- */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-serif italic font-bold text-gray-900">
              House of Sole<span className="text-rose-500"></span>
            </Link>
            <p className="text-gray-500 font-light leading-relaxed text-sm">
              Crafting elegance for the modern woman. From boardroom power moves to midnight galas, we ensure every step you take is a statement.
            </p>
            <div className="flex gap-4">
              {[<FaInstagram />].map((icon, i) => (
                <motion.a 
                  key={i}
                  target="blank"
                  whileHover={{ y: -3, color: "#e11d48" }}
                  href="https://www.instagram.com/houseofsole.in?igsh=MWpmamh6MWlkMXd3eg==" 
                  className="text-gray-400 text-lg transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* --- Column 2: Quick Shop --- */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900 mb-6">Collections</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-light">
              <li><Link to="/products" className="hover:text-rose-500 transition-colors">The Stiletto Edit</Link></li>
              <li><Link to="/products" className="hover:text-rose-500 transition-colors">Daily Sneakers</Link></li>
              <li><Link to="/products" className="hover:text-rose-500 transition-colors">Bridal Collection</Link></li>
              <li><Link to="/products" className="hover:text-rose-500 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* --- Column 3: Support --- */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900 mb-6">Concierge</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-light">
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-rose-500 transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-rose-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-rose-500 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* --- Column 4: Newsletter --- */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900 mb-6">Join the Muse Club</h4>
            <p className="text-sm text-gray-500 font-light">Receive early access to sales and styling tips.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full border-b border-gray-200 py-2 pr-10 outline-none focus:border-rose-400 bg-transparent transition-colors text-sm"
              />
              <button className="absolute right-0 bottom-2 text-rose-500 text-xs font-bold tracking-widest hover:text-rose-600 transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-rose-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © {currentYear} PKS Luxe Footwear. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] text-gray-400 uppercase tracking-widest">
            <Link to="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};