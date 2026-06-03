import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </div>
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
