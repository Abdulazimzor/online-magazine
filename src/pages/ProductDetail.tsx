import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/cartStore';

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
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
      <span className="text-sm text-gray-500 font-medium">({reviews} reviews)</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const addToCart = useCartStore((s) => s.addToCart);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors?.[0] || null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8 gap-2 items-center">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600 transition">Shop</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-8 overflow-hidden group">
              {product.discount > 0 && (
                <span className="absolute top-6 left-6 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
              {product.badge && (
                <span className={`absolute top-6 left-6 z-10 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm ${
                  product.badge === 'TOP PRODUCT' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {product.badge}
                </span>
              )}
              {/* Isolated image + color overlay using mix-blend-mode */}
              <div className="relative w-full h-full" style={{ isolation: 'isolate' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Product'; }}
                />
                {/* Color overlay — multiply blends with the grayscale image to tint it */}
                {selectedColor && selectedColor !== '#e5e7eb' && selectedColor !== '#C0C0C0' && (
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-400 pointer-events-none"
                    style={{
                      backgroundColor: selectedColor,
                      mixBlendMode: 'multiply',
                      opacity: 0.75,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Thumbnails — each shows the wheel tinted in that color */}
            <div className="flex gap-3">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-24 h-24 rounded-xl border-2 flex items-center justify-center p-2 cursor-pointer transition-all duration-300 overflow-hidden bg-gray-50 ${
                    selectedColor === color ? 'border-blue-600 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="relative w-full h-full" style={{ isolation: 'isolate' }}>
                    <img src={product.image} alt="thumbnail" className="w-full h-full object-contain" />
                    {color !== '#e5e7eb' && color !== '#C0C0C0' && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: color, mixBlendMode: 'multiply', opacity: 0.75 }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} reviews={product.reviews} />
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock Ready to Ship' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-red-500">${product.salePrice.toFixed(2)}</span>
              {product.originalPrice > product.salePrice && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description || 'Premium quality auto part designed for durability and performance.'}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Available Colors</h3>
                  {selectedColor && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm transition-all duration-300"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Selected
                    </span>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-11 h-11 rounded-full border-4 transition-all duration-200 flex items-center justify-center shadow-sm ${
                        selectedColor === color
                          ? 'border-white ring-2 ring-blue-600 scale-110 shadow-md'
                          : 'border-white ring-1 ring-gray-200 hover:scale-110 hover:ring-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 border-t border-gray-100 pt-8">
              {/* Quantity */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-14 w-32">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </button>
                <div className="flex-1 flex items-center justify-center font-bold text-gray-900">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-14 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 ${
                  !product.inStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 translate-y-0.5'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Features list */}
            <ul className="space-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Free shipping on orders over $99
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Order before 2 PM for same-day dispatch
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Secure 256-bit SSL encryption
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
