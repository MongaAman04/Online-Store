import { Trash, Plus, Minus } from "lucide-react"; // Make sure to install lucide-react or use your icons

const products = [
    {
        id: 1,
        name: 'Nike Air Force 1 07 LV8',
        href: '#',
        price: 47199,
        originalPrice: 48900,
        discount: '5% Off',
        color: 'Orange',
        size: '8 UK',
        imageSrc: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/54a510de-a406-41b2-8d62-7f8c587c9a7e/air-force-1-07-lv8-shoes-9KwrSk.png',
    },
    {
        id: 2,
        name: 'Nike Blazer Low 77 SE',
        href: '#',
        price: 1549,
        originalPrice: 2499,
        discount: '38% off',
        color: 'White',
        size: '8 UK',
        imageSrc: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e48d6035-bd8a-4747-9fa1-04ea596bb074/blazer-low-77-se-shoes-0w2HHV.png',
    }
];

export const Cart = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl py-12">
                <h1 className="text-4xl font-serif italic text-gray-900 mb-10">Your Shopping Bag</h1>
                
                <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                    {/* --- Product List --- */}
                    <section className="lg:col-span-8 bg-white">
                        <ul role="list" className="divide-y divide-rose-50 border-t border-rose-50">
                            {products.map((product) => (
                                <li key={product.id} className="flex py-8 sm:py-10">
                                    <div className="flex-shrink-0 bg-rose-50 rounded-2xl p-2">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.name}
                                            className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl object-contain"
                                        />
                                    </div>

                                    <div className="ml-6 flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-serif text-gray-900">
                                                    <a href={product.href}>{product.name}</a>
                                                </h3>
                                                <div className="mt-1 flex text-xs uppercase tracking-widest text-gray-400 font-bold">
                                                    <span>{product.color}</span>
                                                    <span className="mx-3 border-l border-gray-200" />
                                                    <span>Size: {product.size}</span>
                                                </div>
                                            </div>
                                            <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash size={18} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center border border-rose-100 rounded-full px-2 py-1">
                                                <button type="button" className="p-1 hover:text-rose-500"><Minus size={14} /></button>
                                                <input 
                                                    type="text" 
                                                    className="w-8 text-center text-sm font-medium outline-none bg-transparent" 
                                                    defaultValue={1} 
                                                />
                                                <button type="button" className="p-1 hover:text-rose-500"><Plus size={14} /></button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                                                <p className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                                                <p className="text-xs font-bold text-green-600">{product.discount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* --- Order Summary --- */}
                    <section className="mt-16 lg:col-span-4 lg:mt-0">
                        <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100/50">
                            <h2 className="text-xl font-serif italic text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="flow-root">
                                <dl className="-my-4 divide-y divide-rose-100 text-sm">
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-500">Subtotal (3 items)</dt>
                                        <dd className="font-medium text-gray-900">₹52,398</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-500">Boutique Discount</dt>
                                        <dd className="font-medium text-green-600">- ₹3,431</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-500">Shipping</dt>
                                        <dd className="font-bold text-rose-500 uppercase text-[10px] tracking-widest">Complimentary</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-6">
                                        <dt className="text-lg font-bold text-gray-900">Total Amount</dt>
                                        <dd className="text-lg font-bold text-gray-900">₹48,967</dd>
                                    </div>
                                </dl>
                            </div>

                            <button
                                type="button"
                                className="mt-8 w-full bg-gray-900 text-white py-4 rounded-full font-bold tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
                            >
                                PROCEED TO CHECKOUT
                            </button>
                            
                            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-tighter">
                                Secure Payment • Easy Returns • Authentic Quality
                            </p>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
}