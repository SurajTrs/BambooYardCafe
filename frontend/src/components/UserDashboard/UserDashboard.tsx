import React, { useState, useEffect } from 'react';
import { FiUser, FiShoppingBag, FiSettings, FiLogOut, FiX, FiClock, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { orderAPI, reservationAPI } from '../../services/api';
import '../../styles/UserDashboard.css';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (isOpen && user && activeTab === 'orders') {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
    if (isOpen && user && activeTab === 'favorites') {
      fetchReservations();
      const interval = setInterval(fetchReservations, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getAll();
      const userOrders = data.filter((order: any) => order.customerEmail === user?.email);
      setOrders(userOrders.reverse());
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll();
      const allReservations = response.data || [];
      console.log('All reservations:', allReservations);
      console.log('User email:', user?.email);
      const userReservations = allReservations.filter((res: any) => {
        console.log('Comparing:', res.customerEmail, 'with', user?.email);
        return res.customerEmail?.toLowerCase() === user?.email?.toLowerCase();
      });
      console.log('Filtered user reservations:', userReservations);
      setReservations(userReservations.reverse());
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    window.location.reload();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="dashboard-close" onClick={onClose} aria-label="Close dashboard">
          <FiX />
        </button>

        <div className="dashboard-header">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser /> Profile
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag /> Orders
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FiCalendar /> Reservations
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> Settings
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{user.phone}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>January 2024</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h3>Order History</h3>
              {loading ? (
                <div className="loading-state">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <FiShoppingBag />
                  <p>No orders yet</p>
                  <span>Start ordering to see your history</span>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h4>Order #{order.id?.slice(-6)}</h4>
                          <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`order-status ${order.status || order.paymentStatus}`}>
                          {(order.status === 'pending' || order.paymentStatus === 'pending') ? <FiClock /> : <FiCheckCircle />}
                          {order.status || order.paymentStatus}
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="order-item">
                            <span>{item.name} {item.size && `(${item.size})`}</span>
                            <span>x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">
                        <strong>Total:</strong> ₹{order.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <h3>My Reservations</h3>
              {loading ? (
                <div className="loading-state">Loading reservations...</div>
              ) : reservations.length === 0 ? (
                <div className="empty-state">
                  <FiCalendar />
                  <p>No reservations yet</p>
                  <span>Book a table to see your reservations</span>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <div>
                          <h4>Reservation #{reservation.id?.slice(-6)}</h4>
                          <p className="reservation-date">{new Date(reservation.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`reservation-status ${reservation.status}`}>
                          {reservation.status === 'pending' ? <FiClock /> : <FiCheckCircle />}
                          {reservation.status}
                        </span>
                      </div>
                      <div className="reservation-details">
                        <div className="detail-item">
                          <strong>📅 Date:</strong> {reservation.date}
                        </div>
                        <div className="detail-item">
                          <strong>🕐 Time:</strong> {reservation.time}
                        </div>
                        <div className="detail-item">
                          <strong>👥 Guests:</strong> {reservation.guests}
                        </div>
                        {reservation.specialRequests && (
                          <div className="detail-item special-request">
                            <strong>📝 Note:</strong> {reservation.specialRequests}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>Account Settings</h3>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
