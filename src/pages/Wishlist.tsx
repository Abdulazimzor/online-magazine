import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/ProductCard';

export default function Wishlist() {
  const items = useWishlistStore((state) => state.items);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
          <span className="text-gray-500 font-medium">{items.length} items</span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mt-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">❤️</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't added any products to your wishlist yet. Browse our shop and find something you like!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Go to Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
