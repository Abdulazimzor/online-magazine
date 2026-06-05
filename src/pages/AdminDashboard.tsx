import React, { useState } from 'react';
import { useProductStore } from '../store/productStore';
import { useOrderStore } from '../store/orderStore';
import { type Product } from '../data/products';

export default function AdminDashboard() {
  const { products, updateProductPrice, updateProductDiscount } = useProductStore();
  const { orders } = useOrderStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditPrice(product.salePrice);
    setEditDiscount(product.discount || 0);
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      updateProductDiscount(editingProduct.id, editDiscount);
      updateProductPrice(editingProduct.id, editPrice);
      setEditingProduct(null);
    }
  };

  // Mock data for the chart
  const chartData = [40, 70, 45, 90, 65, 85, 120, 60, 100, 80, 110, 95];

  return (
    <div className="min-h-screen bg-[#030712] flex text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Deep Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHoiLz48L2c+PC9zdmc+')] opacity-40 z-0" />
      </div>

      {/* Cyber Sidebar */}
      <aside className="w-72 bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 min-h-screen p-6 relative z-20 flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 mb-14 px-2 mt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-40 rounded-xl animate-pulse" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border border-white/20 shadow-xl">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            Admin<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">X</span>
          </h2>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { id: 'orders', label: 'Orders & Payments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-500 group overflow-hidden ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/5 opacity-100" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,1)]" />
                  </>
                )}
                <svg className={`relative z-10 w-6 h-6 transition-transform duration-500 ${isActive ? 'scale-110 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span className="relative z-10 text-[15px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Area */}
        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?img=33" alt="Admin" className="w-12 h-12 rounded-full border-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#030712] rounded-full" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Azizbek</p>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10 lg:p-14 overflow-y-auto relative z-10 scrollbar-hide">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in-up">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
              {activeTab === 'overview' ? 'Command Center' : activeTab === 'products' ? 'Inventory Control' : 'Financials'}
            </h1>
            <p className="text-gray-400 font-medium text-lg">Real-time metrics and management system.</p>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-md rounded-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-[300px] backdrop-blur-xl transition-all group-hover:border-cyan-500/30">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search anything..." className="bg-transparent border-none text-white focus:outline-none w-full placeholder-gray-600 text-sm font-medium" />
              </div>
            </div>
            <button className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-xl">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: '+14.5%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-green-400 to-emerald-600', shadow: 'shadow-emerald-500/20' },
                { label: 'Active Orders', value: orders.length.toString(), trend: '+5.2%', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'from-purple-400 to-indigo-600', shadow: 'shadow-purple-500/20' },
                { label: 'Product Catalog', value: products.length.toString(), trend: 'Stable', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'from-cyan-400 to-blue-600', shadow: 'shadow-cyan-500/20' }
              ].map((stat, i) => (
                <div key={i} className="relative group p-[1px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="h-full bg-[#0a0f1c]/90 backdrop-blur-3xl rounded-3xl p-8 relative z-10 flex flex-col justify-between overflow-hidden">
                    {/* Glowing orb behind the icon */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} p-[1px] ${stat.shadow} shadow-lg`}>
                        <div className="w-full h-full bg-[#0a0f1c] rounded-2xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                          </svg>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 backdrop-blur-md">
                        {stat.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{stat.label}</p>
                      <p className="text-4xl lg:text-5xl font-black text-white tracking-tight">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fake Analytics Chart */}
            <div className="p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-[#0a0f1c]/90 backdrop-blur-3xl rounded-3xl p-8 lg:p-10">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-white">Revenue Overview</h3>
                    <p className="text-gray-400 font-medium mt-1">Monthly performance metrics</p>
                  </div>
                  <div className="flex gap-2">
                    {['1W', '1M', '3M', '1Y'].map(t => (
                      <button key={t} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${t === '1M' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-t border-white/5">
                    {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-white/5 flex-1" />)}
                  </div>
                  
                  {/* Chart Bars */}
                  {chartData.map((val, i) => (
                    <div key={i} className="w-full flex flex-col justify-end items-center group relative z-10 h-full">
                      {/* Tooltip */}
                      <div className="absolute -top-12 bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl pointer-events-none">
                        ${val}k
                      </div>
                      <div 
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-blue-600/20 to-cyan-400/80 group-hover:to-cyan-300 transition-all duration-500 cursor-pointer border-t border-l border-r border-cyan-300/30 relative overflow-hidden"
                        style={{ height: `${val}%` }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/50" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="animate-fade-in-up">
            <div className="p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-[#0a0f1c]/90 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/10">
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Product Detail</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Promo</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-8 py-5 flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center p-2 border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all">
                              <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                            </div>
                            <div>
                              <span className="font-bold text-white block text-lg mb-1">{p.name}</span>
                              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded">{p.category}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-xl font-black text-white">${p.salePrice.toFixed(2)}</span>
                              {p.discount > 0 && <span className="text-xs text-gray-500 line-through font-bold">${p.originalPrice.toFixed(2)}</span>}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            {p.discount > 0 ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                                <span className="text-red-400 text-xs font-black">{p.discount}% OFF</span>
                              </div>
                            ) : (
                              <span className="text-gray-600 font-bold">-</span>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            {p.inStock ? (
                              <span className="inline-flex items-center gap-2 text-green-400 text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-gray-500 text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-gray-600" /> Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => handleEditClick(p)}
                              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                            >
                              Edit Item
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in-up">
            <div className="p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-[#0a0f1c]/90 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 h-full">
                    <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-white/0 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                      <span className="text-5xl opacity-30 drop-shadow-2xl">🧾</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">No Incoming Revenue</h3>
                    <p className="text-gray-400 font-medium max-w-sm text-center">New orders processed through the checkout will automatically populate this secure ledger.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/10">
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Txn ID</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Client Profile</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Value</th>
                          <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map(o => (
                          <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="px-8 py-6">
                              <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-400/20">{o.id}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
                                  {o.customerDetails.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-base">{o.customerDetails.name}</p>
                                  <p className="text-xs text-gray-400 font-medium">{o.customerDetails.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-gray-400">
                              {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xl font-black text-white">${o.totalAmount.toFixed(2)}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-xs font-black tracking-wider uppercase">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ultra Premium Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
          {/* Intense backdrop blur */}
          <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-2xl" onClick={() => setEditingProduct(null)} />
          
          <div className="relative w-full max-w-lg p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-cyan-400/50 to-blue-600/10 shadow-[0_0_100px_rgba(34,211,238,0.15)]">
            <div className="bg-[#0a0f1c] rounded-[2rem] p-8 lg:p-10 relative overflow-hidden">
              
              {/* Internal glow effects */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-1">Modify Asset</h3>
                    <p className="text-cyan-400 font-bold text-sm tracking-widest uppercase line-clamp-1">{editingProduct.name}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
                    <img src={editingProduct.image} className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                
                <div className="space-y-6 mb-10">
                  <div className="group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Retail Price ($)</label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-md opacity-0 group-focus-within:opacity-20 transition-opacity" />
                      <div className="relative flex items-center bg-[#030712] border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-400/50 transition-colors">
                        <span className="pl-6 text-xl text-gray-500 font-black">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={editPrice} 
                          onChange={e => setEditPrice(Number(e.target.value))} 
                          className="w-full px-4 py-4 bg-transparent text-white font-black text-xl focus:outline-none placeholder-gray-700" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      Promotional Discount <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] border border-red-500/30">SALE</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-md opacity-0 group-focus-within:opacity-20 transition-opacity" />
                      <div className="relative flex items-center bg-[#030712] border border-white/10 rounded-2xl overflow-hidden focus-within:border-red-400/50 transition-colors">
                        <span className="pl-6 text-xl text-red-500/50 font-black">%</span>
                        <input 
                          type="number" 
                          value={editDiscount} 
                          onChange={e => setEditDiscount(Number(e.target.value))} 
                          className="w-full px-4 py-4 bg-transparent text-red-400 font-black text-xl focus:outline-none placeholder-gray-700" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(34,211,238,0.4)] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                    Commit Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
