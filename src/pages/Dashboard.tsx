import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-4xl font-bold text-blue-600">0</p>
          <p className="text-gray-500 text-sm mt-1">Total orders placed</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">Wishlist</h2>
          <p className="text-4xl font-bold text-purple-600">0</p>
          <p className="text-gray-500 text-sm mt-1">Saved items</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          <p className="text-4xl font-bold text-green-600">0</p>
          <p className="text-gray-500 text-sm mt-1">Reviews written</p>
        </div>
      </div>
    </div>
  );
}
