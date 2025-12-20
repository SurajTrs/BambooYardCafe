import React, { useState, useEffect } from 'react';
import { reservationAPI, adminAPI } from '../../services/api';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const { data } = await reservationAPI.getAll();
      setReservations(data.reverse());
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateReservationStatus(id, status);
      loadReservations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredReservations = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div className="reservations-management">
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter === 'confirmed' ? 'active' : ''} onClick={() => setFilter('confirmed')}>Confirmed</button>
        <button className={filter === 'cancelled' ? 'active' : ''} onClick={() => setFilter('cancelled')}>Cancelled</button>
      </div>

      <div className="reservations-grid">
        {filteredReservations.map(reservation => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-header">
              <h3>{reservation.customerName}</h3>
              <span className={`status-badge ${reservation.status}`}>{reservation.status}</span>
            </div>
            <div className="reservation-details">
              <p><strong>📞</strong> {reservation.customerPhone}</p>
              <p><strong>📧</strong> {reservation.customerEmail}</p>
              <p><strong>📅</strong> {reservation.date}</p>
              <p><strong>🕐</strong> {reservation.time}</p>
              <p><strong>👥</strong> {reservation.guests} guests</p>
              {reservation.specialRequests && (
                <p><strong>Note:</strong> {reservation.specialRequests}</p>
              )}
            </div>
            <div className="reservation-actions">
              <select value={reservation.status} onChange={(e) => updateStatus(reservation.id, e.target.value)} aria-label="Update reservation status">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
