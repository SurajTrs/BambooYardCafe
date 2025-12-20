import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactAPI.submit(formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h4>📍 Location</h4>
              <p>Bamboo Yard Cafe<br/>U 69/5 DLF Phase 3<br/>U Block, Gurgaon, Haryana</p>
            </div>
            <div className="info-item">
              <h4>📞 Phone</h4>
              <p>+91 9891613228</p>
            </div>
            <div className="info-item">
              <h4>🕒 Hours</h4>
              <p>Mon - Sun: 11:00 AM - 11:00 PM</p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Your Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
