import React, { useState, useEffect } from 'react';
import { orderAPI, adminAPI } from '../../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data.reverse());
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="orders-management">
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter === 'confirmed' ? 'active' : ''} onClick={() => setFilter('confirmed')}>Confirmed</button>
        <button className={filter === 'preparing' ? 'active' : ''} onClick={() => setFilter('preparing')}>Preparing</button>
        <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>Ready</button>
      </div>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id.slice(-6)}</h3>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Type:</strong> {order.orderType}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
            </div>
            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="item-row">
                  <span>{item.name} {item.size && `(${item.size})`}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <div className="total">Total: ₹{order.total}</div>
              <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} aria-label="Update order status">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
