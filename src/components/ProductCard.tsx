import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Product } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export function StarRating({ rating }: { rating: number }) {
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

export function ProductCard({ product }: { product: Product }) {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

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
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform"
      >
        <svg
          className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
          fill={isInWishlist ? 'currentColor' : 'none'}
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
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product'; }}
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
