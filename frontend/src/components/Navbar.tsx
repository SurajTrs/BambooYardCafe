import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiHome, FiBook, FiCalendar, FiInfo, FiMail, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onAuthClick, onDashboardClick }) => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-brand">
          <span className="brand-icon">🎋</span>
          <span className={`brand-text ${user ? 'small' : ''}`}>Bamboo Yard</span>
        </div>
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li><a onClick={() => scrollTo('home')}><FiHome /> <span>Home</span></a></li>
          <li><a onClick={() => scrollTo('menu')}><FiBook /> <span>Menu</span></a></li>
          <li><a onClick={() => scrollTo('reservation')}><FiCalendar /> <span>Reserve</span></a></li>
          <li><a onClick={() => scrollTo('about')}><FiInfo /> <span>About</span></a></li>
          <li><a onClick={() => scrollTo('contact')}><FiMail /> <span>Contact</span></a></li>
          {user && (
            <li>
              <button type="button" className="cart-btn" onClick={onCartClick}>
                <FiShoppingCart /> Cart ({cart.length})
              </button>
            </li>
          )}
          {user ? (
            <li>
              <span className="user-name clickable" onClick={onDashboardClick}>
                <FiUser /> {user.name}
              </span>
            </li>
          ) : (
            <li>
              <button type="button" className="auth-btn" onClick={onAuthClick}>
                <FiUser /> Login
              </button>
            </li>
          )}
        </ul>
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
