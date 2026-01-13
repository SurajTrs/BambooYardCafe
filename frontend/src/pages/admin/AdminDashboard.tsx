import React, { useState } from 'react';
import { FiShoppingBag, FiCalendar, FiMenu, FiBarChart2, FiLogOut } from 'react-icons/fi';
import Dashboard from '../../components/admin/Dashboard';
import Orders from '../../components/admin/Orders';
import MenuManagement from '../../components/admin/MenuManagement';
import Reservations from '../../components/admin/Reservations';
import '../../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
          <h2>🎋 Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <FiBarChart2 /> Dashboard
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <FiShoppingBag /> Orders
          </button>
          <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}>
            <FiMenu /> Menu
          </button>
          <button className={activeTab === 'reservations' ? 'active' : ''} onClick={() => setActiveTab('reservations')}>
            <FiCalendar /> Reservations
          </button>
        </nav>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>
          <FiLogOut /> Back to Site
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </header>
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
