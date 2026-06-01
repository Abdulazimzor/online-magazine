import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">$0.00</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Products</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Customers</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <p className="text-gray-400 text-center py-8">No orders yet.</p>
      </div>
    </div>
  );
}
