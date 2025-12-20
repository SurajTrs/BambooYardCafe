import React, { useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import '../styles/Toast.css';

interface ToastProps {
  message: string;
  itemName: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, itemName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <div className="toast-icon">
        <FiCheckCircle />
      </div>
      <div className="toast-content">
        <p className="toast-title">{message}</p>
        <p className="toast-item">{itemName}</p>
      </div>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
