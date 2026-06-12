import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

function StarRating({ rating, reviews }: { rating: number, reviews?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviews !== undefined && <span className="text-sm text-gray-500">({reviews} reviews)</span>}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const products = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlistFn = useWishlistStore((state) => state.isInWishlist);
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  const isInWishlist = isInWishlistFn(product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link> &gt;{' '}
          <Link to="/shop" className="hover:text-blue-600">Shop</Link> &gt;{' '}
          <span className="text-gray-900 font-medium">{product.category}</span> &gt;{' '}
          <span>{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden border border-gray-100 group">
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
              {product.badge && (
                <span className={`absolute top-4 ${product.discount > 0 ? 'left-20' : 'left-4'} z-10 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm ${
                  product.badge === 'TOP PRODUCT' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {product.badge}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Product'; }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center p-2 transition-colors bg-gray-50 ${
                    i === 0 ? 'border-blue-600 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={product.image} alt="thumbnail" className="w-full h-full object-contain opacity-90" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} reviews={product.reviews} />
              <div className="h-4 w-px bg-gray-300"></div>
              <span className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? '✓ In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-red-500">${product.salePrice.toFixed(2)}</span>
              {product.originalPrice > product.salePrice && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Experience the best quality with our {product.name}. Designed for optimal performance and durability. This product comes with a standard warranty and fits seamlessly with your setup.
            </p>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Available Colors</h3>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === c ? 'border-blue-500 scale-110' : 'border-gray-200 hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-xl transition-colors"
                >-</button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-full text-center text-gray-900 font-bold bg-transparent outline-none" 
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-xl transition-colors"
                >+</button>
              </div>

              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all flex-shrink-0 ${
                  isInWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <svg className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-100 pt-8 space-y-4">
              <div className="flex text-sm">
                <span className="w-32 font-bold text-gray-900">SKU:</span>
                <span className="text-gray-500">PRD-{product.id.toString().padStart(5, '0')}</span>
              </div>
              <div className="flex text-sm">
                <span className="w-32 font-bold text-gray-900">Category:</span>
                <Link to="/shop" className="text-blue-600 hover:underline">{product.category}</Link>
              </div>
              <div className="flex text-sm">
                <span className="w-32 font-bold text-gray-900">Tags:</span>
                <span className="text-gray-500">Premium, {product.category?.split(' ')[0] || 'Auto'}, Quality</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
