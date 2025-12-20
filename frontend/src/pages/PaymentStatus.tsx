import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/PaymentStatus.css';

const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const processPayment = async () => {
      const paymentStatus = searchParams.get('status');
      const orderId = searchParams.get('orderId');
      const txnId = searchParams.get('txnId');

      if (paymentStatus === 'TXN_SUCCESS') {
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          try {
            const orderData = JSON.parse(pendingOrder);
            orderData.paymentStatus = 'completed';
            orderData.paytmTransactionId = txnId;
            orderData.paytmOrderId = orderId;
            
            await orderAPI.create(orderData);
            localStorage.removeItem('pendingOrder');
            clearCart();
            setStatus('success');
          } catch (error) {
            setStatus('failed');
          }
        } else {
          setStatus('success');
        }
      } else {
        setStatus('failed');
      }
    };

    processPayment();
  }, [searchParams, clearCart]);

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        {status === 'loading' && (
          <div className="status-content">
            <div className="loader"></div>
            <h2>Processing Payment...</h2>
            <p>Please wait while we confirm your payment</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="status-content success">
            <div className="status-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully</p>
            <p className="order-id">Order ID: {searchParams.get('orderId')}</p>
            <p className="txn-id">Transaction ID: {searchParams.get('txnId')}</p>
            <button onClick={() => navigate('/')} className="status-btn">
              Back to Home
            </button>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="status-content failed">
            <div className="status-icon">✗</div>
            <h2>Payment Failed</h2>
            <p>Your payment could not be processed</p>
            <p>Please try again or contact support</p>
            <button onClick={() => navigate('/')} className="status-btn">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
