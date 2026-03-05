import { motion } from "framer-motion";

export const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Section: The Vision */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-rose-50">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="text-center z-10 px-6"
        >
          <h4 className="text-rose-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">Established 2024</h4>
          <h1 className="text-5xl md:text-7xl font-serif italic text-gray-900">Defining Every Step.</h1>
          <p className="mt-6 text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
            PKS was born from a simple belief: that every woman deserves to walk with the grace of a queen and the comfort of a cloud.
          </p>
        </motion.div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-100/50 skew-x-12 translate-x-20" />
      </section>

      {/* 2. Philosophy Section: Image + Text */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop" 
            alt="Craftsmanship" 
            className="rounded-[3rem] shadow-2xl relative z-10"
          />
          <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-rose-200 rounded-[3rem] z-0" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-serif text-gray-800">Our Philosophy</h2>
          <p className="text-gray-600 leading-relaxed">
            At PKS, we don’t just design footwear; we curate experiences. Our designers focus on the "Three C's": <strong>Chic, Confident, and Comfortable.</strong> 
          </p>
          <p className="text-gray-600 leading-relaxed">
            Each pair is meticulously handcrafted using premium materials, ensuring that from the morning boardroom to the midnight gala, your style never wavers.
          </p>
          <div className="pt-4">
             <div className="flex items-center gap-4 border-l-2 border-rose-400 pl-6">
                <p className="italic font-serif text-xl text-gray-700">
                  "Fashion is the armor to survive the reality of everyday life."
                </p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* 3. The PKS Promise (Grid) */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif italic mb-16">The PKS Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Empowerment", desc: "Designed by women, for women, to fuel your ambition." },
              { title: "Quality", desc: "Sourced from the finest leather and sustainable fabrics." },
              { title: "Inclusivity", desc: "A fit for every foot, a style for every soul." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-rose-400 font-bold tracking-widest uppercase text-sm mb-4">{item.title}</h3>
                <p className="text-gray-400 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};