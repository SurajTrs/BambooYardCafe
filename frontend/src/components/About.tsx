import React from 'react';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Authentic Asian Cuisine</h3>
            <p>At Bamboo Yard Cafe, we bring you the finest Asian delicacies crafted with passion and authentic flavors. From sizzling fried rice to delectable momos, every dish is prepared fresh to order.</p>
            <p>Our commitment to quality ingredients and traditional cooking methods ensures an unforgettable dining experience.</p>
          </div>
          <div className="about-features">
            <div className="feature">
              <span className="feature-icon">🍜</span>
              <h4>Fresh Ingredients</h4>
              <p>Only the finest quality</p>
            </div>
            <div className="feature">
              <span className="feature-icon">👨‍🍳</span>
              <h4>Expert Chefs</h4>
              <p>Experienced in Asian cuisine</p>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <h4>Fast Service</h4>
              <p>Quick preparation & delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
