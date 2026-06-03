import React, { useState } from 'react';
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
  category: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All',
  'Wheels & Tires',
  'Lighting',
  'Electronics',
  'Engine Parts',
  'Accessories',
];

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
    category: 'Wheels & Tires',
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
    category: 'Electronics',
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
    category: 'Electronics',
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
    category: 'Lighting',
  },
  {
    id: 6,
    name: 'SnowyFox RV 15Amp to 50Amp Adapter',
    image: '/product_adapter.png',
    rating: 5,
    reviews: 1,
    originalPrice: 25.98,
    salePrice: 23.88,
    discount: 0,
    badge: 'TOP PRODUCT',
    colors: ['#f59e0b'],
    inStock: true,
    category: 'Accessories',
  },
  {
    id: 7,
    name: 'Shell Rotella T1 SAE 30 Conventional',
    image: '/product_dashcam.png',
    rating: 5,
    reviews: 1,
    originalPrice: 24.85,
    salePrice: 17.85,
    discount: 29,
    colors: ['#dc2626', '#fbbf24'],
    inStock: true,
    category: 'Engine Parts',
  },
];

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

function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product';
          }}
        />
      </Link>

      <Link
        to={`/product/${product.id}`}
        className="text-sm font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-2"
      >
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

      <button className="w-full mt-auto py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        Add to Cart
      </button>
    </div>
  );
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter((p) => {
    const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
    const minMatch = minPrice === '' || p.salePrice >= minPrice;
    const maxMatch = maxPrice === '' || p.salePrice <= maxPrice;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && minMatch && maxMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-8">
            {/* Search */}
            <div className="mb-8">
              <h2 className="text-lg font-black text-gray-900 mb-4">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-black text-gray-900 mb-4">Categories</h2>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Price Filter */}
            <div className="mt-8">
              <h2 className="text-lg font-black text-gray-900 mb-4">Price</h2>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
            <span className="text-sm text-gray-500">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500">No products found matching your filters.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
