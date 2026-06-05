import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
  });

  const totalAmount = getCartTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Create simulated order
    const newOrder = {
      id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...items],
      totalAmount,
      customerDetails: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
      },
      status: 'Pending' as const,
    };

    addOrder(newOrder);
    clearCart();
    
    alert('Payment successful! Your order has been placed.');
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Go back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Shipping & Payment</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Card Number (Mock)</label>
              <input required type="text" placeholder="XXXX XXXX XXXX XXXX" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
            </div>
          </div>

          <button type="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
            Pay ${totalAmount.toFixed(2)}
          </button>
        </form>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.product.salePrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center text-lg font-black">
            <span>Total:</span>
            <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
