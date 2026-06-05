import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash__circle splash__circle--1"></div>
      <div className="splash__circle splash__circle--2"></div>
      
      <div className="splash__logo-container">
        <ShoppingBag size={56} color="white" className="splash__logo-icon" />
      </div>
      
      <h1 className="splash__brand-name">LuxeUz</h1>
      <p className="splash__slogan">Premium shopping experience</p>
    </div>
  );
};
