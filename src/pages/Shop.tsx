import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { type Product } from '../data/products';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

// ─── Category config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'All Products', slug: 'all', icon: '🛒', color: 'from-blue-600 to-blue-800' },
  { name: 'Wheels & Tires', slug: 'wheels-tires', icon: '🛞', color: 'from-blue-500 to-blue-700' },
  { name: 'Lighting', slug: 'lighting', icon: '💡', color: 'from-amber-500 to-orange-600' },
  { name: 'Electronics', slug: 'electronics', icon: '📡', color: 'from-purple-500 to-purple-700' },
  { name: 'Engine Parts', slug: 'engine-parts', icon: '⚙️', color: 'from-gray-600 to-gray-800' },
  { name: 'Accessories', slug: 'accessories', icon: '🔧', color: 'from-green-500 to-emerald-700' },
];

// Map products to categories by keyword
function getProductCategory(product: Product): string {
  const name = product.name.toLowerCase();
  if (name.includes('wheel') || name.includes('tire') || name.includes('daytona') || name.includes('chrome fan') || name.includes('schumacher')) return 'wheels-tires';
  if (name.includes('headlight') || name.includes('projector')) return 'lighting';
  if (name.includes('dash cam') || name.includes('alarm') || name.includes('wifi') || name.includes('thinkware')) return 'electronics';
  if (name.includes('rotella') || name.includes('sae') || name.includes('oil') || name.includes('engine')) return 'engine-parts';
  return 'accessories';
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
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
      {product.discount > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {product.discount}%
        </span>
      )}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md ${
          product.badge === 'TOP PRODUCT' ? 'bg-green-500' : 'bg-orange-500'
        }`}>
          {product.badge}
        </span>
      )}

      <button
        onClick={() => setWished((w) => !w)}
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

      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product'; }}
        />
      </Link>

      <div className="flex gap-1">
        {product.colors.map((c, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full border border-gray-200 cursor-pointer hover:scale-125 transition-transform"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <Link to={`/product/${product.id}`} className="text-sm font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
        {product.name}
      </Link>

      <div className="flex items-center gap-1.5">
        <StarRating rating={product.rating} />
        <span className="text-xs text-gray-400">{product.reviews} review</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
        <span className="text-base font-bold text-red-500">${product.salePrice.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-green-600 font-medium">In Stock</span>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-2 text-white text-xs font-semibold rounded-xl transition-all duration-200 ${
          added
            ? 'bg-green-500 opacity-100 translate-y-0'
            : 'bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
        }`}
      >
        {added ? '✓ Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'all';

  const activeCategoryInfo = CATEGORIES.find((c) => c.slug === activeCategory) || CATEGORIES[0];
  const products = useProductStore((state) => state.products);

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || getProductCategory(p) === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav className="flex text-sm text-gray-500 mb-3 gap-2 items-center">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shop</span>
            {activeCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{activeCategoryInfo.name}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl font-black text-gray-900">
            {activeCategory === 'all' ? 'Shop' : activeCategoryInfo.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeCategory === 'all'
              ? 'Product listings will appear here.'
              : `Browse our selection of ${activeCategoryInfo.name.toLowerCase()} products.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSearchParams(cat.slug === 'all' ? {} : { category: cat.slug })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
          {activeCategory !== 'all' && (
            <> in <span className="font-semibold text-blue-600">{activeCategoryInfo.name}</span></>
          )}
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try a different category or search term.</p>
            <button
              onClick={() => { setSearch(''); setSearchParams({}); }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
