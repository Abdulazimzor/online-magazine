import React from 'react';
import { Search } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';
import './MagazineNavbar.css';

export const MagazineNavbar: React.FC = () => {
  return (
    <header className="mag-navbar">
      <div className="mag-navbar__logo">MAGAZINE</div>
      
      <nav className="mag-navbar__nav">
        <a href="#" className="mag-navbar__link active">Home</a>
        <a href="#" className="mag-navbar__link">About Us</a>
        <a href="#" className="mag-navbar__link">Shop</a>
        <a href="#" className="mag-navbar__link">Pages</a>
        <a href="#" className="mag-navbar__link">Articles</a>
      </nav>

      <div className="mag-navbar__actions">
        <div className="mag-navbar__search">
          <input type="text" placeholder="Search..." className="mag-navbar__search-input" />
          <Search size={16} className="mag-navbar__search-icon" />
        </div>
        
        <div className="mag-navbar__socials">
          <FaFacebookF size={16} className="mag-navbar__social-icon" />
          <FaTwitter size={16} className="mag-navbar__social-icon" />
          <FaLinkedinIn size={16} className="mag-navbar__social-icon" />
          <FaYoutube size={16} className="mag-navbar__social-icon" />
          <FaInstagram size={16} className="mag-navbar__social-icon" />
        </div>
      </div>
    </header>
  );
};
