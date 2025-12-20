import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Reservation.css';

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/reservations', formData);
      alert('Reservation request submitted! We will confirm shortly.');
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', date: '', time: '', guests: 2, specialRequests: '' });
    } catch (error) {
      alert('Error submitting reservation');
    }
  };

  return (
    <section id="reservation" className="reservation-section">
      <div className="container">
        <h2 className="section-title">Reserve a Table</h2>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" placeholder="Your Name" required value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
            <input type="email" placeholder="Your Email" required value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} />
          </div>
          <div className="form-row">
            <input type="tel" placeholder="Your Phone" required value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} />
            <input type="number" min="1" max="20" placeholder="Number of Guests" required value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})} />
          </div>
          <div className="form-row">
            <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} aria-label="Reservation date" />
            <input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} aria-label="Reservation time" />
          </div>
          <textarea placeholder="Special Requests (Optional)" rows={3} value={formData.specialRequests} onChange={(e) => setFormData({...formData, specialRequests: e.target.value})} />
          <button type="submit" className="reserve-btn">Reserve Table</button>
        </form>
      </div>
    </section>
  );
};

export default Reservation;
