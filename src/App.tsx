import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { useState } from 'react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useCartStore } from './store/cartStore';

const queryClient = new QueryClient();

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">AP</span>
          </div>
          <span className="font-black text-gray-900 text-lg hidden sm:block">AutoParts</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/shop', label: 'Shop' },
            { to: '/dashboard', label: 'Account' },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Login
          </Link>

          <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-2">
          {[
            { to: '/', label: '🏠 Home' },
            { to: '/shop', label: '🛒 Shop' },
            { to: '/cart', label: '🛍️ Cart' },
            { to: '/login', label: '👤 Login' },
            { to: '/dashboard', label: '📊 Account' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">AP</span>
            </div>
            <span className="text-white font-black text-lg">AutoParts</span>
          </div>
          <p className="text-sm leading-relaxed">Your one-stop shop for premium auto parts, tools, and accessories.</p>
        </div>
        {[
          { title: 'Shop', links: ['All Products', 'Best Sellers', 'New Arrivals', 'Sale'] },
          { title: 'Account', links: ['Login', 'Register', 'Orders', 'Wishlist'] },
          { title: 'Help', links: ['FAQ', 'Shipping Info', 'Returns', 'Contact Us'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(l => (
                <li key={l}>
                  <Link to="/shop" className="text-sm hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} AutoParts Premium. All rights reserved.
      </div>
    </footer>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
