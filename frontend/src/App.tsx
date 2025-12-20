import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AuthModal from './components/Auth/AuthModal';
import UserDashboard from './components/UserDashboard/UserDashboard';
import PaymentStatus from './pages/PaymentStatus';
import './App.css';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/" element={
              <>
                <Navbar 
                  onCartClick={() => setIsCartOpen(true)} 
                  onAuthClick={() => setIsAuthOpen(true)}
                  onDashboardClick={() => setIsDashboardOpen(true)}
                />
                <Hero />
                <Menu onAuthRequired={() => setIsAuthOpen(true)} />
                <Reservation />
                <About />
                <Contact />
                <Footer />
                <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                <UserDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
              </>
            } />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
