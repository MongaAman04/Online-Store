import { motion } from "framer-motion";

/**
 * Skeleton card — mirrors the real product card's structure exactly
 * (h-80 image, rounded-3xl container, badge/title/price/button slots)
 * so there's no layout shift when real data swaps in.
 */
const ProductCardSkeleton = () => (
  <div className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-rose-50/50">
      {/* Image area */}
      <div className="relative h-80 overflow-hidden bg-rose-50">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-rose-50 via-rose-100/70 to-rose-50 bg-[length:200%_100%]" />
      </div>

      {/* Content area */}
      <div className="p-6 bg-white space-y-3">
        {/* Brand label */}
        <div className="h-2.5 w-16 rounded-full bg-rose-100 animate-pulse" />
        {/* Title */}
        <div className="h-4 w-3/4 rounded-full bg-gray-200 animate-pulse" />
        {/* Price row */}
        <div className="flex items-center gap-2 pt-1 pb-2">
          <div className="h-5 w-14 rounded-full bg-rose-100 animate-pulse" />
          <div className="h-4 w-10 rounded-full bg-gray-100 animate-pulse" />
        </div>
        {/* Button */}
        <div className="h-11 w-full rounded-xl bg-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
);

/**
 * Full-page skeleton — shown while the initial product fetch is in flight.
 * `count` controls how many placeholder cards to render (match your default
 * page size so the "LOAD MORE" threshold feels consistent).
 */
const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="mt-16 px-4">
      {/* Header skeleton */}
      <div className="mb-12 text-center">
        <div className="h-3 w-32 mx-auto rounded-full bg-rose-100 animate-pulse mb-3" />
        <div className="h-9 w-64 mx-auto rounded-full bg-gray-200 animate-pulse" />
        <div className="h-1 w-20 bg-rose-200 mx-auto mt-4 rounded-full" />
      </div>

      {/* Category pill skeletons */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-rose-50 border border-rose-100 animate-pulse"
              style={{ width: `${64 + (i % 3) * 16}px` }}
            />
          ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <section className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap -m-4"
        >
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default ProductGridSkeleton;