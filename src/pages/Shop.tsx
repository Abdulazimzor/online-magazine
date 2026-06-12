import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { type Product } from '../data/products';
import { useProductStore } from '../store/productStore';
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

import { ProductCard } from '../components/ProductCard';

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
