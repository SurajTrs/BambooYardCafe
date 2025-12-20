import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Login from './Login';
import Signup from './Signup';
import '../../styles/Auth.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        {mode === 'login' ? (
          <Login onSwitchToSignup={() => setMode('signup')} onClose={onClose} />
        ) : (
          <Signup onSwitchToLogin={() => setMode('login')} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
