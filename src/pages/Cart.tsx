import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">
          Looks like you haven't added anything yet. Start shopping!
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-200"
        >
          Browse Shop →
        </Link>
      </div>
    );
  }

  const total = getCartTotal();
  const shipping = total >= 99 ? 0 : 9.99;
  const grandTotal = total + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6 gap-2 items-center">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 mb-8">
          Shopping Cart
          <span className="ml-3 text-lg font-semibold text-gray-400">({items.length} item{items.length !== 1 ? 's' : ''})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Product'; }}
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-base font-black text-red-500">${product.salePrice.toFixed(2)}</span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                    {product.discount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Color dots */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {product.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity + remove */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-10">
                    <button
                      onClick={() => {
                        if (quantity <= 1) removeFromCart(product.id);
                        else updateQuantity(product.id, quantity - 1);
                      }}
                      className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <div className="w-8 flex items-center justify-center text-sm font-bold text-gray-900">
                      {quantity}
                    </div>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="w-20 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      ${(product.salePrice * quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add ${(99 - total).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-black text-gray-900 text-base">Total</span>
                  <span className="font-black text-gray-900 text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200 text-sm"
              >
                Proceed to Checkout →
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure SSL checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
