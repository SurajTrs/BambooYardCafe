import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { menuAPI } from '../services/api';
import MenuCard from './MenuCard';
import Toast from './Toast';
import '../styles/Menu.css';

interface MenuProps {
  onAuthRequired: () => void;
}

const Menu: React.FC<MenuProps> = ({ onAuthRequired }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    filterItems();
  }, [activeCategory, searchQuery, menuItems]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const { data } = await menuAPI.getAll();
      setMenuItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let items = menuItems;
    
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(items);
  };

  const handleItemAdded = (itemName: string) => {
    setAddedItemName(itemName);
    setShowToast(true);
  };

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'fried-rice', label: 'Fried Rice' },
    { value: 'noodles', label: 'Noodles' },
    { value: 'momos', label: 'Momos' },
    { value: 'starters', label: 'Starters' },
    { value: 'rolls', label: 'Kathi Rolls' },
    { value: 'others', label: 'Others' }
  ];

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-header">
          <div className="menu-title-wrapper">
            <span className="menu-subtitle">Discover Our</span>
            <h2 className="section-title">Signature Menu</h2>
            <p className="menu-description">Handcrafted dishes with authentic Asian flavors</p>
          </div>
          <div className="menu-count">
            <span className="count-number">{filteredItems.length}</span>
            <span className="count-label">Dishes Available</span>
          </div>
        </div>
        
        <div className="menu-controls">
          <div className="menu-filters">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <span className="filter-icon">{getCategoryIcon(cat.value)}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading delicious menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No dishes found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onAuthRequired={onAuthRequired}
                onItemAdded={handleItemAdded}
              />
            ))}
          </div>
        )}
      </div>
      
      {showToast && (
        <Toast 
          message="Added to cart" 
          itemName={addedItemName}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
};

const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    'all': '🍽️',
    'fried-rice': '🍚',
    'noodles': '🍜',
    'momos': '🥟',
    'starters': '🍤',
    'rolls': '🌯',
    'others': '🍱'
  };
  return icons[category];
};

export default Menu;
