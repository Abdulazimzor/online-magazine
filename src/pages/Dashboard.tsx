import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOrderStore } from '../store/orderStore';
import { supabase } from '../lib/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


export default function Dashboard() {
  const { isAuthenticated, logout, user } = useAuth();
  const { orders } = useOrderStore();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const navigate = useNavigate();

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address state
  interface Address {
    id: string;
    title: string;
    full_name: string;
    phone: string;
    city: string;
    district: string;
    street: string;
    zip_code: string;
    country: string;
    is_default: boolean;
  }
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({
    title: 'Home',
    full_name: '',
    phone: '',
    city: '',
    district: '',
    street: '',
    zip_code: '',
    country: 'Uzbekistan',
    is_default: false,
  });
  const [addrSaving, setAddrSaving] = useState(false);

  // Map refs
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);



  // Profile data loaded from Supabase profiles table
  const [profileData, setProfileData] = useState<{
    full_name: string;
    username: string;
    phone: string;
    bio: string;
    location: string;
    website: string;
    avatar_url: string;
  } | null>(null);

  // Real user data from Supabase auth + profiles table
  const userFullName = profileData?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Foydalanuvchi';
  const userEmail = user?.email || '';
  const userAvatarUrl = profileData?.avatar_url || user?.user_metadata?.avatar_url || null;
  const myOrders = orders.filter(o => o.customerDetails.email === userEmail || true);
  
  const filteredOrders = myOrders.filter(o => orderFilter === 'All' || o.status === orderFilter);

  // Load profile from Supabase on mount
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfileData(data);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load existing profile from Supabase when Edit Profile is opened
  useEffect(() => {
    if (activeView === 'edit' && user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfileForm({
              full_name: data.full_name || user.user_metadata?.full_name || '',
              username: data.username || '',
              phone: data.phone || '',
              bio: data.bio || '',
              location: data.location || '',
              website: data.website || '',
            });
          } else {
            setProfileForm(f => ({ ...f, full_name: user.user_metadata?.full_name || '' }));
          }
        });
    }
  }, [activeView, user]);

  // Leaflet map initialization and reverse geocoding
  useEffect(() => {
    if (showAddrForm && mapContainerRef.current) {
      // Leaflet marker default image fix for Vite/bundlers
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Default center coords (Tashkent)
      let defaultLat = 41.311081;
      let defaultLng = 69.240562;

      const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], { icon: defaultIcon, draggable: true }).addTo(map);
      markerRef.current = marker;

      const updateAddressFromCoords = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.county || '';
            const district = addr.suburb || addr.district || '';
            const streetName = addr.road || addr.pedestrian || '';
            const houseNo = addr.house_number || '';
            const street = streetName ? `${streetName}${houseNo ? ', ' + houseNo : ''}` : '';
            const zip = addr.postcode || '';
            const country = addr.country || 'Uzbekistan';

            setAddrForm(f => ({
              ...f,
              city,
              district,
              street: street || f.street,
              zip_code: zip,
              country
            }));
          }
        } catch (e) {
          console.error('Reverse geocoding error:', e);
        }
      };

      // Search and pan if editing existing address with city & street
      const locateAddress = async () => {
        if (editingAddr && editingAddr.city && editingAddr.street) {
          try {
            const query = `${editingAddr.street}, ${editingAddr.district || ''}, ${editingAddr.city}, ${editingAddr.country || 'Uzbekistan'}`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              map.setView([lat, lon], 16);
              marker.setLatLng([lat, lon]);
              return;
            }
          } catch (e) {
            console.error('Geocoding error:', e);
          }
        }
        // otherwise locate user location if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              map.setView([lat, lon], 15);
              marker.setLatLng([lat, lon]);
              updateAddressFromCoords(lat, lon);
            },
            () => {
              // fallback to default
              updateAddressFromCoords(defaultLat, defaultLng);
            }
          );
        } else {
          updateAddressFromCoords(defaultLat, defaultLng);
        }
      };

      locateAddress();

      // Click on map to position marker and update address
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng(e.latlng);
        updateAddressFromCoords(lat, lng);
      });

      // Drag marker to update address
      marker.on('dragend', async () => {
        const { lat, lng } = marker.getLatLng();
        updateAddressFromCoords(lat, lng);
      });

      // Fix Leaflet layout inside absolute/framer components
      setTimeout(() => {
        map.invalidateSize();
      }, 200);

      return () => {
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    }
  }, [showAddrForm]);

  const handleProfileSave = async () => {
    if (!user) return;
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profileForm,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSaved(true);
      // Update banner immediately after save
      setProfileData(prev => prev
        ? { ...prev, ...profileForm }
        : { ...profileForm, avatar_url: '' }
      );
      setTimeout(() => setProfileSaved(false), 3000);
    }
    setProfileLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOrderClick = (filter: string) => {
    setOrderFilter(filter);
    setActiveView('orders');
  };

  // ── Address handlers ──────────────────────────────────
  const loadAddresses = async () => {
    if (!user) return;
    setAddrLoading(true);
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    setAddresses(data || []);
    setAddrLoading(false);
  };

  const openAddrForm = (addr?: Address) => {
    if (addr) {
      setEditingAddr(addr);
      setAddrForm({
        title: addr.title,
        full_name: addr.full_name,
        phone: addr.phone || '',
        city: addr.city,
        district: addr.district || '',
        street: addr.street,
        zip_code: addr.zip_code || '',
        country: addr.country || 'Uzbekistan',
        is_default: addr.is_default,
      });
    } else {
      setEditingAddr(null);
      setAddrForm({ title: 'Home', full_name: userFullName, phone: '', city: '', district: '', street: '', zip_code: '', country: 'Uzbekistan', is_default: addresses.length === 0 });
    }
    setShowAddrForm(true);
  };

  const saveAddress = async () => {
    if (!user) return;
    setAddrSaving(true);
    if (editingAddr) {
      await supabase.from('addresses').update({ ...addrForm, updated_at: new Date().toISOString() }).eq('id', editingAddr.id);
    } else {
      await supabase.from('addresses').insert([{ ...addrForm, user_id: user.id }]);
    }
    await loadAddresses();
    setShowAddrForm(false);
    setAddrSaving(false);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
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
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={userFullName}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md relative z-10 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-black text-4xl">
                    {userFullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <h2 className="mt-5 text-2xl font-bold text-gray-800">{userFullName}</h2>
            {profileData?.username && (
              <p className="text-indigo-500 font-semibold text-sm mt-0.5">@{profileData.username}</p>
            )}
            <p className="text-gray-500 font-medium mt-1">{userEmail}</p>

            {/* Info chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {profileData?.phone && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {profileData.phone}
                </span>
              )}
              {profileData?.location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {profileData.location}
                </span>
              )}
              {profileData?.website && (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-600 font-medium hover:bg-blue-100 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  {profileData.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Bio */}
            {profileData?.bio && (
              <p className="mt-3 mb-2 text-sm text-gray-500 text-center max-w-xs px-4 italic">"{profileData.bio}"</p>
            )}
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
               <h3 className="text-xl font-bold mb-6">Profil ma'lumotlari</h3>

               {/* Success / Error banners */}
               {profileSaved && (
                 <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   Profil muvaffaqiyatli saqlandi!
                 </div>
               )}
               {profileError && (
                 <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">
                   ⚠️ {profileError}
                 </div>
               )}

               <div className="space-y-4 max-w-lg">
                 {/* Email (read only) */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email manzil</label>
                   <input type="email" value={userEmail} readOnly className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none text-gray-500 cursor-not-allowed" />
                 </div>

                 {/* Full name */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism</label>
                   <input
                     type="text"
                     value={profileForm.full_name}
                     onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                     placeholder="Ismingizni kiriting"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 {/* Username */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Foydalanuvchi nomi</label>
                   <input
                     type="text"
                     value={profileForm.username}
                     onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                     placeholder="@username"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 {/* Phone */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
                   <input
                     type="tel"
                     value={profileForm.phone}
                     onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                     placeholder="+998 90 000 00 00"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 {/* Location */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                   <input
                     type="text"
                     value={profileForm.location}
                     onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))}
                     placeholder="Toshkent, O'zbekiston"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 {/* Bio */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                   <textarea
                     value={profileForm.bio}
                     onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                     rows={3}
                     placeholder="O'zingiz haqida qisqacha..."
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                   />
                 </div>

                 {/* Website */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Veb-sayt</label>
                   <input
                     type="url"
                     value={profileForm.website}
                     onChange={e => setProfileForm(f => ({ ...f, website: e.target.value }))}
                     placeholder="https://example.com"
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <button
                   onClick={handleProfileSave}
                   disabled={profileLoading}
                   className="mt-2 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2"
                 >
                   {profileLoading ? (
                     <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saqlanmoqda...</>
                   ) : 'Saqlash'}
                 </button>
               </div>
            </motion.div>
          )}

          {activeView === 'address' && (
            <motion.div key="address" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50"
              onAnimationStart={() => { if (addresses.length === 0) loadAddresses(); }}
            >
              <h3 className="text-xl font-bold mb-6">Saqlangan Manzillar</h3>

              {/* Loading */}
              {addrLoading && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Address list */}
              {!addrLoading && !showAddrForm && (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Hech qanday manzil yo'q</p>
                      <p className="text-gray-400 text-sm mt-1">Yangi manzil qo'shing</p>
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div key={addr.id} className={`border rounded-2xl p-5 relative transition-all ${addr.is_default ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'}`}>
                        {addr.is_default && (
                          <span className="absolute top-4 right-4 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
                            ✓ Asosiy
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.title === 'Home' ? 'bg-orange-100 text-orange-500' : addr.title === 'Work' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                            {addr.title === 'Home' ? '🏠' : addr.title === 'Work' ? '🏢' : '📍'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800">{addr.title} — {addr.full_name}</p>
                            {addr.phone && <p className="text-gray-500 text-sm mt-0.5">📞 {addr.phone}</p>}
                            <p className="text-gray-600 text-sm mt-1">{addr.street}{addr.district ? ', ' + addr.district : ''}</p>
                            <p className="text-gray-600 text-sm">{addr.city}{addr.zip_code ? ' ' + addr.zip_code : ''}, {addr.country}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 flex-wrap">
                          {!addr.is_default && (
                            <button onClick={() => setDefaultAddress(addr.id)} className="text-blue-600 font-medium text-sm hover:underline">
                              Asosiy qilish
                            </button>
                          )}
                          <button onClick={() => openAddrForm(addr)} className="text-gray-600 font-medium text-sm hover:underline">
                            Tahrirlash
                          </button>
                          <button onClick={() => deleteAddress(addr.id)} className="text-red-500 font-medium text-sm hover:underline ml-auto">
                            O'chirish
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add new button */}
                  <button
                    onClick={() => openAddrForm()}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Yangi manzil qo'shish
                  </button>
                </div>
              )}

              {/* Add / Edit Form */}
              {showAddrForm && (
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{editingAddr ? 'Manzilni tahrirlash' : 'Yangi manzil'}</h4>
                    <button onClick={() => setShowAddrForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">Bekor qilish</button>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tur</label>
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map(t => (
                        <button key={t} onClick={() => setAddrForm(f => ({ ...f, title: t }))}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${addrForm.title === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                          {t === 'Home' ? '🏠 Uy' : t === 'Work' ? '🏢 Ish' : '📍 Boshqa'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Map Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xaritadan joylashuvni tanlang</label>
                    <div ref={mapContainerRef} className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 relative z-10 shadow-inner" />
                    <p className="text-xs text-gray-400 mt-1">📍 Xaritani bosing yoki markerni suring. Manzil maydonlari avtomatik ravishda to'ldiriladi.</p>
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism</label>
                    <input type="text" value={addrForm.full_name}
                      onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))}
                      placeholder="Ism Familiya" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input type="tel" value={addrForm.phone}
                      onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+998 90 000 00 00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* City + District */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shahar</label>
                      <input type="text" value={addrForm.city}
                        onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Toshkent" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tuman</label>
                      <input type="text" value={addrForm.district}
                        onChange={e => setAddrForm(f => ({ ...f, district: e.target.value }))}
                        placeholder="Yunusobod" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ko'cha, uy raqami</label>
                    <input type="text" value={addrForm.street}
                      onChange={e => setAddrForm(f => ({ ...f, street: e.target.value }))}
                      placeholder="Amir Temur ko'chasi, 15" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Zip + Country */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pochta kodi</label>
                      <input type="text" value={addrForm.zip_code}
                        onChange={e => setAddrForm(f => ({ ...f, zip_code: e.target.value }))}
                        placeholder="100000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mamlakat</label>
                      <input type="text" value={addrForm.country}
                        onChange={e => setAddrForm(f => ({ ...f, country: e.target.value }))}
                        placeholder="Uzbekistan" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  {/* Default checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" checked={addrForm.is_default}
                      onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Asosiy manzil sifatida belgilash</span>
                  </label>

                  <button onClick={saveAddress} disabled={addrSaving || !addrForm.city || !addrForm.street}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2">
                    {addrSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saqlanmoqda...</> : (editingAddr ? 'Yangilash' : 'Qo\'shish')}
                  </button>
                </div>
              )}
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
