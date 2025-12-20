import React from 'react';
import '../styles/Hero.css';

const Hero: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/home.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-particles"></div>
      <div className="hero-content">
        <div className="hero-badge">🎋 Premium Asian Cuisine</div>
        <h1>
          <span className="hero-title-line">Welcome to</span>
          <span className="hero-title-main">Bamboo Yard</span>
          <span className="hero-title-accent">Cafe</span>
        </h1>
        <p className="hero-subtitle">Experience Authentic Asian Flavors</p>
        <div className="hero-cta-group">
          <button type="button" className="cta-btn cta-primary" onClick={scrollToMenu}>
            <span>Explore Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button type="button" className="cta-btn cta-secondary" onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Book Table</span>
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">111+</div>
            <div className="stat-label">Menu Items</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Rating</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse"></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
