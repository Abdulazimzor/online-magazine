import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // For demo purposes, we log them in immediately after register
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-white font-black text-lg">AP</span>
          </div>
        </div>
        <h2 className="text-2xl font-black mb-8 text-center text-gray-900">Create Account</h2>
        
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            required 
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-sm" 
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            required 
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-sm" 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            required 
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-sm" 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mb-6"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
