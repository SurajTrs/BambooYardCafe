import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, size?: 'half' | 'full') => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem, size?: 'half' | 'full') => {
    const price = size === 'half' ? item.priceHalf! : size === 'full' ? item.priceFull! : item.price!;
    const cartItemId = `${item.id}-${size || 'single'}`;
    
    setCart(prev => {
      const existing = prev.find(i => `${i.id}-${i.selectedSize || 'single'}` === cartItemId);
      if (existing) {
        return prev.map(i => 
          `${i.id}-${i.selectedSize || 'single'}` === cartItemId 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, selectedSize: size, selectedPrice: price }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => `${item.id}-${item.selectedSize || 'single'}` !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => `${item.id}-${item.selectedSize || 'single'}` !== cartItemId));
      return;
    }
    setCart(prev => prev.map(item => 
      `${item.id}-${item.selectedSize || 'single'}` === cartItemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const total = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
