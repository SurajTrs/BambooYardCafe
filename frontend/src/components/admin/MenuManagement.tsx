import React, { useState, useEffect } from 'react';
import { menuAPI, adminAPI } from '../../services/api';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'fried-rice',
    price: '',
    priceHalf: '',
    priceFull: '',
    image: '',
    hasHalfFull: false
  });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const { data } = await menuAPI.getAll();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      await adminAPI.toggleAvailability(id);
      loadMenu();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData: any = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        image: newItem.image,
        available: true
      };

      if (newItem.hasHalfFull) {
        itemData.priceHalf = Number(newItem.priceHalf);
        itemData.priceFull = Number(newItem.priceFull);
      } else {
        itemData.price = Number(newItem.price);
      }

      await adminAPI.addMenuItem(itemData);
      alert('Menu item added successfully!');
      setShowAddForm(false);
      setNewItem({ name: '', category: 'fried-rice', price: '', priceHalf: '', priceFull: '', image: '', hasHalfFull: false });
      loadMenu();
    } catch (error) {
      alert('Error adding menu item');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingItem) {
          setEditingItem({ ...editingItem, image: reader.result as string });
        } else {
          setNewItem({ ...newItem, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.updateMenuItem(editingItem.id, editingItem);
      alert('Menu item updated successfully!');
      setEditingItem(null);
      loadMenu();
    } catch (error) {
      alert('Error updating menu item');
    }
  };

  return (
    <div className="menu-management">
      <div className="menu-controls">
        <button className="add-item-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="category-select" aria-label="Filter by category">
          <option value="all">All Categories</option>
          <option value="fried-rice">Fried Rice</option>
          <option value="noodles">Noodles</option>
          <option value="momos">Momos</option>
          <option value="starters">Starters</option>
          <option value="rolls">Kathi Rolls</option>
          <option value="others">Others</option>
        </select>
      </div>

      {editingItem && (
        <div className="add-item-form">
          <h3>Edit Menu Item</h3>
          <form onSubmit={handleUpdateItem}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Item Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                required
              />
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                required
                aria-label="Category"
              >
                <option value="fried-rice">Fried Rice</option>
                <option value="noodles">Noodles</option>
                <option value="momos">Momos</option>
                <option value="starters">Starters</option>
                <option value="rolls">Kathi Rolls</option>
                <option value="others">Others</option>
              </select>
            </div>

            {editingItem.price ? (
              <input
                type="number"
                placeholder="Price"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                required
              />
            ) : (
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Half Price"
                  value={editingItem.priceHalf}
                  onChange={(e) => setEditingItem({ ...editingItem, priceHalf: Number(e.target.value) })}
                  required
                />
                <input
                  type="number"
                  placeholder="Full Price"
                  value={editingItem.priceFull}
                  onChange={(e) => setEditingItem({ ...editingItem, priceFull: Number(e.target.value) })}
                  required
                />
              </div>
            )}

            <div className="form-row">
              <label className="file-upload-label">
                📷 Update Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {editingItem.image && (
                <div className="image-preview">
                  <img src={editingItem.image} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-row">
              <button type="submit" className="submit-btn">Update Item</button>
              <button type="button" className="cancel-btn" onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="add-item-form">
          <h3>Add New Menu Item</h3>
          <form onSubmit={handleAddItem}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                required
                aria-label="Category"
              >
                <option value="fried-rice">Fried Rice</option>
                <option value="noodles">Noodles</option>
                <option value="momos">Momos</option>
                <option value="starters">Starters</option>
                <option value="rolls">Kathi Rolls</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newItem.hasHalfFull}
                  onChange={(e) => setNewItem({ ...newItem, hasHalfFull: e.target.checked })}
                />
                Has Half/Full Options
              </label>
            </div>

            {newItem.hasHalfFull ? (
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Half Price"
                  value={newItem.priceHalf}
                  onChange={(e) => setNewItem({ ...newItem, priceHalf: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Full Price"
                  value={newItem.priceFull}
                  onChange={(e) => setNewItem({ ...newItem, priceFull: e.target.value })}
                  required
                />
              </div>
            ) : (
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                required
              />
            )}

            <div className="form-row">
              <label className="file-upload-label">
                📷 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {newItem.image && (
                <div className="image-preview">
                  <img src={newItem.image} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">Add Item</button>
          </form>
        </div>
      )}

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className={`menu-item-card ${!item.available ? 'unavailable' : ''}`}>
            <div className="item-header">
              <h3>{item.name}</h3>
              <span className="category-tag">{item.category}</span>
            </div>
            <div className="item-pricing">
              {item.price ? (
                <span className="price">₹{item.price}</span>
              ) : (
                <>
                  <span className="price">Half: ₹{item.priceHalf}</span>
                  <span className="price">Full: ₹{item.priceFull}</span>
                </>
              )}
            </div>
            <div className="item-actions">
              <button
                className="edit-btn"
                onClick={() => handleEditItem(item)}
              >
                ✏️ Edit
              </button>
              <button
                className={`toggle-btn ${item.available ? 'available' : 'unavailable'}`}
                onClick={() => toggleAvailability(item.id)}
              >
                {item.available ? '✓ Available' : '✗ Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
