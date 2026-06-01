import { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  salePrice: number;
  discount: number;
  badge?: string;
  colors: string[];
  inStock: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'VISION® – 147 DAYTONA Hyper Silver',
    image: '/product_wheel.png',
    rating: 5,
    reviews: 1,
    originalPrice: 254.0,
    salePrice: 209.0,
    discount: 18,
    colors: ['#e5e7eb', '#6b7280', '#1f2937'],
    inStock: true,
  },
  {
    id: 2,
    name: 'Thinkware F770 Dash Cam Dual Channel Wifi',
    image: '/product_dashcam.png',
    rating: 3,
    reviews: 1,
    originalPrice: 268.99,
    salePrice: 249.99,
    discount: 8,
    colors: ['#1f2937', '#374151'],
    inStock: true,
  },
  {
    id: 3,
    name: 'Technaxx car Alarm with Charging Function',
    image: '/product_alarm.png',
    rating: 5,
    reviews: 1,
    originalPrice: 51.99,
    salePrice: 47.99,
    discount: 0,
    badge: 'SUPER PRICE',
    colors: ['#1f2937'],
    inStock: true,
  },
  {
    id: 4,
    name: 'Spyder® – Projector Headlights',
    image: '/product_headlights.png',
    rating: 5,
    reviews: 1,
    originalPrice: 582.99,
    salePrice: 521.89,
    discount: 11,
    colors: ['#9ca3af', '#d1d5db'],
    inStock: true,
  },
  {
    id: 5,
    name: 'Spec-D® – Projector Headlights',
    image: '/product_headlights.png',
    rating: 4,
    reviews: 1,
    originalPrice: 364.86,
    salePrice: 279.02,
    discount: 24,
    colors: ['#6b7280', '#1f2937'],
    inStock: true,
  },
  {
    id: 6,
    name: 'SnowyFox RV 15Amp to 50Amp Adapter – 15Male',
    image: '/product_adapter.png',
    rating: 5,
    reviews: 1,
    originalPrice: 25.98,
    salePrice: 23.88,
    discount: 0,
    badge: 'TOP PRODUCT',
    colors: ['#f59e0b'],
    inStock: true,
  },
  {
    id: 7,
    name: 'Shell Rotella T1 SAE 30 Conventional Heavy Duty',
    image: '/product_dashcam.png',
    rating: 5,
    reviews: 1,
    originalPrice: 24.85,
    salePrice: 17.85,
    discount: 29,
    colors: ['#dc2626', '#fbbf24'],
    inStock: true,
  },
  {
    id: 8,
    name: 'Schumacher 125 Chrome Fan 12V',
    image: '/product_wheel.png',
    rating: 4,
    reviews: 1,
    originalPrice: 45.99,
    salePrice: 30.54,
    discount: 34,
    colors: ['#9ca3af'],
    inStock: true,
  },
];

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
      <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        Add to Cart
      </button>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase">New Arrivals 2026</span>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Premium Auto<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Parts & Tools</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Shop the widest selection of high-performance car parts, electronics, and accessories.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/shop"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-900/30"
              >
                Shop Now →
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200"
              >
                View Deals
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/promo_car.png"
              alt="Premium red sports car"
              className="w-full max-w-lg object-contain drop-shadow-2xl"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
        {/* decorative gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
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
              {PRODUCTS.map(p => (
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
            { name: 'Wheels & Tires', icon: '🛞', color: 'from-blue-500 to-blue-700' },
            { name: 'Lighting', icon: '💡', color: 'from-amber-500 to-orange-600' },
            { name: 'Electronics', icon: '📡', color: 'from-purple-500 to-purple-700' },
            { name: 'Engine Parts', icon: '⚙️', color: 'from-gray-600 to-gray-800' },
            { name: 'Accessories', icon: '🔧', color: 'from-green-500 to-emerald-700' },
          ].map(cat => (
            <Link
              key={cat.name}
              to="/shop"
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
          {PRODUCTS.slice(0, 4).map(p => (
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
