import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiShoppingBag, FiMenu as FiMenuIcon, FiCalendar, FiLogOut } from 'react-icons/fi';
import Dashboard from './components/admin/Dashboard';
import Orders from './components/admin/Orders';
import MenuManagement from './components/admin/MenuManagement';
import Reservations from './components/admin/Reservations';
import AdminLogin from './components/admin/AdminLogin';
import './styles/AdminDashboard.css';
import './App.css';

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <Orders />;
      case 'menu': return <MenuManagement />;
      case 'reservations': return <Reservations />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🎋</span>
          <h2>Bamboo Yard</h2>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <button 
            type="button"
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            <FiBarChart2 /> <span>Dashboard</span>
          </button>
          <button 
            type="button"
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag /> <span>Orders</span>
          </button>
          <button 
            type="button"
            className={activeTab === 'menu' ? 'active' : ''} 
            onClick={() => setActiveTab('menu')}
          >
            <FiMenuIcon /> <span>Menu</span>
          </button>
          <button 
            type="button"
            className={activeTab === 'reservations' ? 'active' : ''} 
            onClick={() => setActiveTab('reservations')}
          >
            <FiCalendar /> <span>Reservations</span>
          </button>
        </nav>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user">
            <span>Admin User</span>
          </div>
        </header>
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;
