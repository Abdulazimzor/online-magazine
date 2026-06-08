import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOrderStore } from '../store/orderStore';

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { orders } = useOrderStore();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const navigate = useNavigate();

  // Mock current user email to filter their orders (In a real app, this comes from auth)
  const currentUserEmail = 'roan@example.com';
  const myOrders = orders.filter(o => o.customerDetails.email === currentUserEmail || true); // Showing all for demo purposes
  
  const filteredOrders = myOrders.filter(o => orderFilter === 'All' || o.status === orderFilter);


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOrderClick = (filter: string) => {
    setOrderFilter(filter);
    setActiveView('orders');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl shadow-sm relative overflow-hidden mb-8 pb-12 pt-8 flex flex-col items-center">
          <div className="w-full px-8 flex items-center justify-between mb-4 absolute top-0 left-0 pt-6 z-20">
             <h1 className="text-2xl font-bold text-gray-800">
               {activeView === 'edit' ? 'Edit Profile' : activeView === 'address' ? 'Shipping Address' : activeView === 'orders' ? 'My Orders' : 'My Account'}
             </h1>
             {activeView && (
               <button onClick={() => setActiveView(null)} className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                 Back to Account
               </button>
             )}
          </div>

          <div className="relative z-10 flex flex-col items-center mt-6">
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Roan Atkinson" 
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md relative z-10"
              />
              <button className="absolute bottom-1 right-1 z-20 bg-white p-2 rounded-full shadow-md text-gray-500 border border-gray-100 hover:text-rose-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 8v4m0 4h.01" /> 
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </button>
            </div>
            
            <h2 className="mt-5 text-2xl font-bold text-gray-800">Roan Atkinson</h2>
            <p className="text-gray-500 font-medium mt-1">Entrepreneur</p>
          </div>

          {/* Decorative Waves */}
          <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
            <svg preserveAspectRatio="none" viewBox="0 0 375 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <path d="M0 40C0 40 80 120 187.5 80C295 40 375 80 375 80V160H0V40Z" fill="url(#paint0_linear)"/>
              <path d="M0 60C0 60 90 140 187.5 110C285 80 375 120 375 120V160H0V60Z" fill="#be123c"/>
              <path d="M0 80C0 80 100 160 187.5 140C275 120 375 150 375 150V160H0V80Z" fill="#e11d48"/>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="40" x2="375" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#881337" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          {!activeView && (
            <motion.div 
              key="dashboard-home"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Orders Section */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                <h3 className="text-xl font-bold text-gray-800 mb-8">My Orders</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-4">
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
                    label="Pending Payment" bgClass="bg-blue-100" onClick={() => handleOrderClick('Pending')}
                  />
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
                    label="Delivered" bgClass="bg-yellow-100" onClick={() => handleOrderClick('Delivered')}
                  />
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Processing" bgClass="bg-rose-100" onClick={() => handleOrderClick('Processing')}
                  />
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
                    label="Cancelled" bgClass="bg-green-100" onClick={() => handleOrderClick('Cancelled')}
                  />
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>}
                    label="Wishlist" bgClass="bg-pink-100" onClick={() => handleOrderClick('Wishlist')}
                  />
                  <MenuIcon 
                    icon={<svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                    label="Customer Care" bgClass="bg-purple-100" onClick={() => handleOrderClick('Support')}
                  />
                </div>
              </div>

              {/* Settings / Links Section */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col border border-gray-50">
                  <h3 className="text-lg font-bold text-gray-800 px-4 pt-4 pb-2">Settings</h3>
                  <ListItem 
                    icon={<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                    label="Edit Profile"
                    onClick={() => setActiveView('edit')}
                  />
                  <div className="h-px bg-gray-100 mx-6 my-1" />
                  <ListItem 
                    icon={<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                    label="Shipping Address"
                    onClick={() => setActiveView('address')}
                  />
                </div>
                
                <button onClick={handleLogout} className="w-full bg-white flex items-center justify-center gap-2 text-red-500 font-medium py-4 rounded-3xl hover:bg-red-50 transition shadow-sm border border-red-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>

            </motion.div>
          )}

          {activeView === 'edit' && (
            <motion.div key="edit-profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
               <h3 className="text-xl font-bold mb-6">Profile Information</h3>
               <div className="space-y-4 max-w-lg">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                   <input type="text" defaultValue="Roan Atkinson" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                   <input type="email" defaultValue="roan@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <button onClick={() => setActiveView(null)} className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">Save Changes</button>
               </div>
            </motion.div>
          )}

          {activeView === 'address' && (
            <motion.div key="address" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
               <h3 className="text-xl font-bold mb-6">Saved Addresses</h3>
               <div className="border border-gray-200 rounded-2xl p-6 relative">
                  <span className="absolute top-6 right-6 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">Default</span>
                  <p className="font-bold text-gray-800">Home Address</p>
                  <p className="text-gray-500 mt-2">123 Business Road, Tech Park</p>
                  <p className="text-gray-500">Tashkent, Uzbekistan 100000</p>
                  <div className="mt-4 flex gap-3">
                    <button className="text-blue-600 font-medium text-sm hover:underline">Edit</button>
                    <button className="text-red-600 font-medium text-sm hover:underline">Delete</button>
                  </div>
               </div>
               <button className="mt-6 w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-700 transition flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                 Add New Address
               </button>
            </motion.div>
          )}

          {activeView === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-gray-800">Orders: {orderFilter}</h3>
                 <select 
                   value={orderFilter} 
                   onChange={(e) => setOrderFilter(e.target.value)}
                   className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                 >
                   <option value="All">All Orders</option>
                   <option value="Pending">Pending Payment</option>
                   <option value="Delivered">Delivered</option>
                   <option value="Processing">Processing</option>
                   <option value="Cancelled">Cancelled</option>
                 </select>
               </div>
               
               {filteredOrders.length === 0 ? (
                 <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                   <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                   <h4 className="text-lg font-semibold text-gray-700">No {orderFilter !== 'All' ? orderFilter.toLowerCase() : ''} orders found</h4>
                   <p className="text-gray-500 mt-2 max-w-md mx-auto">Looks like you don't have any orders matching this category yet.</p>
                   <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
                     Start Shopping
                   </button>
                 </div>
               ) : (
                 <div className="space-y-6">
                   {filteredOrders.map(order => (
                     <div key={order.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                       <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                         <div>
                           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Order #{order.id}</p>
                           <p className="text-gray-700 font-medium">Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ${
                             order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                             order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                             order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                             'bg-red-100 text-red-700'
                           }`}>
                             <span className={`w-2 h-2 rounded-full ${
                               order.status === 'Pending' ? 'bg-yellow-500' :
                               order.status === 'Processing' ? 'bg-blue-500' :
                               order.status === 'Delivered' ? 'bg-green-500' :
                               'bg-red-500'
                             }`} />
                             {order.status}
                           </span>
                           <span className="text-lg font-black text-gray-900">${order.totalAmount.toFixed(2)}</span>
                         </div>
                       </div>
                       
                       <div className="p-6">
                         <div className="space-y-4">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4">
                               <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                 <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                               </div>
                               <div className="flex-1 flex flex-col justify-center">
                                 <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                                 <div className="flex items-center gap-4 mt-2">
                                   <span className="text-gray-500 text-sm font-medium">Qty: {item.quantity}</span>
                                   <span className="text-gray-900 font-bold">${(item.product.salePrice * item.quantity).toFixed(2)}</span>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function MenuIcon({ icon, label, bgClass, onClick }: { icon: React.ReactNode, label: string, bgClass: string, onClick?: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 transition-colors w-full"
    >
      <div className={`w-20 h-20 md:w-24 md:h-24 ${bgClass} rounded-3xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}>
        {icon}
      </div>
      <span className="text-sm md:text-base font-semibold text-gray-700 text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );
}

function ListItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition rounded-2xl group text-left">
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
