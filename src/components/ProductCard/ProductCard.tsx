import React from 'react';
import { Heart, Plus } from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  onAddClick?: () => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  imageUrl,
  onAddClick,
  onClick
}) => {
  return (
    <div className="product-card" onClick={onClick} role="button" tabIndex={0} data-id={id}>
      <div className="product-card__image-container">
        <button className="product-card__favorite" aria-label="Add to wishlist" onClick={(e) => { e.stopPropagation(); }}>
          <Heart size={18} />
        </button>
        <img src={imageUrl} alt={title} className="product-card__image" loading="lazy" />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">{price.toLocaleString('uz-UZ')} UZS</span>
          <button 
            className="product-card__add-btn" 
            aria-label="Add to cart"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
