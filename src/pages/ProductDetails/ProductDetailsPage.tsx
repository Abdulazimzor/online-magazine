import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import './ProductDetailsPage.css';

export const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log('Loading product details for id:', id);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data based on id
  const product = {
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    price: 15499000,
    rating: 4.9,
    reviewsCount: 128,
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'
  };

  return (
    <div className="product-details animate-slide-up">
      <header className={`product-details__header ${isScrolled ? 'scrolled' : ''}`}>
        <button className="product-details__icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <button className="product-details__icon-btn" aria-label="Share">
          <Share2 size={24} />
        </button>
      </header>

      <div className="product-details__gallery">
        <img src={product.imageUrl} alt={product.title} className="product-details__image" />
      </div>

      <div className="product-details__content">
        <div className="product-details__title-row">
          <h1 className="product-details__title">{product.title}</h1>
          <button 
            className="product-details__icon-btn" 
            style={{ position: 'relative', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: isFavorite ? 'var(--color-error)' : 'var(--color-text-primary)' }}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={24} fill={isFavorite ? 'var(--color-error)' : 'none'} />
          </button>
        </div>
        
        <div className="product-details__rating">
          <Star size={18} className="product-details__star" />
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.rating}</span>
          <span>({product.reviewsCount} reviews)</span>
        </div>

        <div className="product-details__price">
          {product.price.toLocaleString('uz-UZ')} UZS
        </div>

        <div className="product-details__section">
          <h2 className="product-details__section-title">Description</h2>
          <p className="product-details__description">{product.description}</p>
        </div>
      </div>

      <div className="product-details__action-bar">
        <Button variant="secondary" size="lg" icon={<Heart size={20} />}>
          Save
        </Button>
        <Button variant="primary" size="lg" className="product-details__cart-btn" fullWidth>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
