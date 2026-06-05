import React from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/home' },
    { icon: <Search size={22} />, label: 'Search', path: '/search' },
    { icon: <ShoppingBag size={22} />, label: 'Cart', path: '/cart' },
    { icon: <Heart size={22} />, label: 'Wishlist', path: '/wishlist' },
    { icon: <User size={22} />, label: 'Profile', path: '/profile' },
  ];

  // Don't show bottom nav on splash screen or product details (optional)
  if (location.pathname === '/' || location.pathname.startsWith('/product/')) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <button
            key={item.label}
            className={`bottom-nav__item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <div className="bottom-nav__icon-wrapper">
              {item.icon}
            </div>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
