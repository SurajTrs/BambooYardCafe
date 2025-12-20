import React, { useState } from 'react';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import '../styles/MenuCard.css';

interface MenuCardProps {
  item: MenuItem;
  onAuthRequired: () => void;
  onItemAdded: (itemName: string) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAuthRequired, onItemAdded }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'half' | 'full'>(
    item.priceHalf ? 'half' : 'full'
  );
  const [imageError, setImageError] = useState(false);
  
  const cartItem = cart.find(ci => {
    const itemId = `${ci.id}-${ci.selectedSize || 'single'}`;
    const searchId = `${item.id}-${item.priceHalf ? selectedSize : 'single'}`;
    return itemId === searchId;
  });
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      onAuthRequired();
      return;
    }

    if (item.price) {
      addToCart(item);
    } else {
      addToCart(item, selectedSize);
    }
    
    onItemAdded(item.name);
  };

  return (
    <div className="menu-card">
      {item.image && (
        <div className="menu-card-image">
          <img 
            src={imageError ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' : item.image} 
            alt={item.name}
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="menu-card-header">
        <h3>{item.name}</h3>
        <span className="category-badge">{item.category}</span>
      </div>
      <div className="menu-card-body">
        {item.price ? (
          <div className="price-single">₹{item.price}</div>
        ) : (
          <div className="price-options">
            <div 
              className={`price-option ${selectedSize === 'half' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('half')}
            >
              <label>Half</label>
              <div className="price">₹{item.priceHalf}</div>
            </div>
            <div 
              className={`price-option ${selectedSize === 'full' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('full')}
            >
              <label>Full</label>
              <div className="price">₹{item.priceFull}</div>
            </div>
          </div>
        )}
        {quantity > 0 ? (
          <div className="quantity-controls">
            <button 
              type="button"
              className="quantity-btn" 
              onClick={() => {
                const cartItemId = `${item.id}-${item.priceHalf ? selectedSize : 'single'}`;
                if (quantity === 1) {
                  removeFromCart(cartItemId);
                } else {
                  updateQuantity(cartItemId, quantity - 1);
                }
              }}
              aria-label="Decrease quantity"
            >
              {quantity === 1 ? <FiTrash2 /> : <FiMinus />}
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              type="button"
              className="quantity-btn" 
              onClick={() => {
                const cartItemId = `${item.id}-${item.priceHalf ? selectedSize : 'single'}`;
                updateQuantity(cartItemId, quantity + 1);
              }}
              aria-label="Increase quantity"
            >
              <FiPlus />
            </button>
          </div>
        ) : (
          <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
