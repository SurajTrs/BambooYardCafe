import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-brand">Bamboo Yard Cafe</h3>
          <p className="footer-tagline">Experience authentic flavors with a modern twist</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#reservation">Reservations</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="contact-info">
            <li><FaPhone /> <span>+91 9891613228</span></li>
            <li><FaEnvelope /> <span>info@bambooyardcafe.com</span></li>
            <li><FaMapMarkerAlt /> <span>U 69/5 DLF Phase 3, U Block, Gurgaon, Haryana</span></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Opening Hours</h4>
          <ul className="hours-info">
            <li><FaClock /> <span>Mon - Sun: 11:00 AM - 11:00 PM</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Bamboo Yard Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
