import React, { useState, useEffect } from 'react';
import { adminAPI, orderAPI } from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiCalendar, FiPackage } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalReservations: 0,
    menuItems: 0,
    availableItems: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentOrders();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setRecentOrders(data.slice(-5).reverse());
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon"><FiDollarSign /></div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card orders">
          <div className="stat-icon"><FiShoppingBag /></div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><FiPackage /></div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card reservations">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info">
            <h3>{stats.totalReservations}</h3>
            <p>Reservations</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(-6)}</td>
                  <td>{order.customerName}</td>
                  <td>{order.items.length} items</td>
                  <td>₹{order.total}</td>
                  <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
