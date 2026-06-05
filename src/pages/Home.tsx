import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Product } from '../data/products';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Badge */}
      {product.discount > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {product.discount}%
        </span>
      )}
      {product.badge && (
        <span
          className={`absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md ${
            product.badge === 'TOP PRODUCT' ? 'bg-green-500' : 'bg-orange-500'
          }`}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setWished(w => !w)}
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
      >
        <svg
          className={`w-4 h-4 ${wished ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
          fill={wished ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product'; }}
        />
      </Link>

      {/* Color dots */}
      <div className="flex gap-1">
        {product.colors.map((c, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full border border-gray-200 cursor-pointer hover:scale-125 transition-transform"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Name */}
      <Link to={`/product/${product.id}`} className="text-sm font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
        {product.name}
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <StarRating rating={product.rating} />
        <span className="text-xs text-gray-400">{product.reviews} review</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
        <span className="text-base font-bold text-red-500">${product.salePrice.toFixed(2)}</span>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-green-600 font-medium">In Stock</span>
      </div>

      {/* Add to Cart (appears on hover) */}
      <button 
        onClick={handleAddToCart}
        className={`w-full py-2 text-white text-xs font-semibold rounded-xl transition-all duration-200 ${
          added 
            ? 'bg-green-500 opacity-100 translate-y-0' 
            : 'bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
        }`}
      >
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const products = useProductStore((state) => state.products);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0a0f1c] min-h-[600px] flex items-center border-b border-gray-800/50">
        {/* Decorative background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHoiLz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12 z-10 w-full">
          <div className="flex-1 space-y-8 relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">New Arrivals 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] tracking-tight text-white drop-shadow-sm">
              Upgrade Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Performance
              </span>
            </h1>
            
            <p className="text-blue-100/60 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              Discover the ultimate collection of premium auto parts, cutting-edge electronics, and pro-grade tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/shop"
                className="group relative px-8 py-4 bg-white text-[#0a0f1c] font-bold rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">Shop Collection</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl backdrop-blur-sm transition-all hover:scale-105 flex items-center justify-center"
              >
                View Deals
              </Link>
            </div>

            <div className="pt-8 mt-4 flex items-center gap-6 border-t border-white/10">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-10 h-10 rounded-full border-2 border-[#0a0f1c]" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-amber-400 text-sm">
                  ★★★★★
                </div>
                <span className="text-white/60 font-medium">Trusted by 10k+ drivers</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative flex justify-center items-center mt-10 md:mt-0 z-10">
            {/* Glowing background behind car */}
            <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-blue-600/30 to-cyan-400/30 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            
            <img
              src="/promo_car.png"
              alt="Premium red sports car"
              className="w-full max-w-[120%] lg:max-w-[130%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-700 ease-out relative z-10"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            
            {/* Floating UI Elements */}
            <div className="absolute top-[5%] right-[5%] bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-2xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xl">⚡</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Turbo Kit</p>
                  <p className="text-green-400 text-xs font-semibold">In Stock</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[10%] left-[0%] bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-2xl z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xl">🛡️</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Warranty</p>
                  <p className="text-blue-300 text-xs font-semibold">5 Years</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Products', value: '50,000+' },
            { label: 'Happy Customers', value: '120K+' },
            { label: 'Brands', value: '500+' },
            { label: 'Free Shipping', value: 'Over $99' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Promo + Products section (matches reference image) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-5">
          {/* Left promo panel */}
          <div className="hidden lg:flex w-64 flex-shrink-0 rounded-2xl bg-gray-900 text-white flex-col justify-between p-7 relative overflow-hidden min-h-[560px]">
            {/* Discount badge */}
            <div>
              <p className="text-6xl font-black leading-none text-white/90">-35<span className="text-3xl">%%</span></p>
              <p className="text-xs text-gray-400 mt-3 font-medium tracking-widest uppercase">Only This Week</p>
              <h2 className="text-2xl font-black mt-2 text-white">Tools &amp; Equipment</h2>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                Nis telesa, laber. Mytonomi bedessade miheten. Pokura rengen, lulurat. Niren nunade håd. Sest berade.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-white hover:text-blue-400 transition-colors"
              >
                Shop Now <span className="text-lg">→</span>
              </Link>
            </div>
            {/* Car image */}
            <div className="absolute bottom-0 left-0 right-0">
              <img
                src="/promo_car.png"
                alt="Promo car"
                className="w-full object-cover opacity-80"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900">Featured Products</h2>
              <Link to="/shop" className="text-sm text-blue-600 font-semibold hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: 'Wheels & Tires', icon: '🛞', color: 'from-blue-500 to-blue-700', slug: 'wheels-tires' },
            { name: 'Lighting', icon: '💡', color: 'from-amber-500 to-orange-600', slug: 'lighting' },
            { name: 'Electronics', icon: '📡', color: 'from-purple-500 to-purple-700', slug: 'electronics' },
            { name: 'Engine Parts', icon: '⚙️', color: 'from-gray-600 to-gray-800', slug: 'engine-parts' },
            { name: 'Accessories', icon: '🔧', color: 'from-green-500 to-emerald-700', slug: 'accessories' },
          ].map(cat => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.slug}`}
              className={`bg-gradient-to-br ${cat.color} text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:scale-105 hover:shadow-lg transition-all duration-200`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-bold text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Best Sellers</h2>
          <Link to="/shop" className="text-sm text-blue-600 font-semibold hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Special Offer Banner ── */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 to-red-700 p-10 flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-medium tracking-widest uppercase text-red-200">Limited Time</p>
            <h2 className="text-3xl font-black mt-1">Get 35% Off Storewide</h2>
            <p className="text-red-200 mt-1 text-sm">Use code <span className="bg-white/20 text-white font-mono font-bold px-2 py-0.5 rounded">SAVE35</span> at checkout</p>
            <Link
              to="/shop"
              className="inline-block mt-4 px-6 py-2.5 bg-white text-red-600 font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Shop the Sale
            </Link>
          </div>
          <div className="hidden md:block text-[120px] leading-none opacity-10 font-black absolute right-10 top-1/2 -translate-y-1/2 select-none">
            35%
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">What Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Alex R.', text: 'Amazing quality parts, fast shipping. My car runs smoother than ever!', rating: 5 },
            { name: 'Maria S.', text: 'Best auto parts store online. Huge selection and great prices.', rating: 5 },
            { name: 'James T.', text: 'The customer service team helped me find the exact part I needed.', rating: 5 },
          ].map(t => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <StarRating rating={t.rating} />
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">"{t.text}"</p>
              <p className="text-gray-900 font-bold text-sm mt-4">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-center text-white">
          <h2 className="text-3xl font-black">Stay in the Loop</h2>
          <p className="text-gray-400 mt-2 mb-6">Get the latest deals, new arrivals and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How long does shipping take?', a: 'Standard shipping takes 3–7 business days. Expedited options are available at checkout.' },
            { q: 'Do you offer returns?', a: 'Yes! We offer a 30-day hassle-free return policy on all unused items in original packaging.' },
            { q: 'Are all parts genuine OEM?', a: 'We carry a mix of OEM, OE-quality, and aftermarket parts. Each product listing clearly states the part type.' },
            { q: 'Can I track my order?', a: 'Absolutely. Once your order ships you\'ll receive a tracking link via email.' },
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
}
