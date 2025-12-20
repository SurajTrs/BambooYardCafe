import React, { useState, useEffect } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { orderAPI, paytmAPI } from '../services/api';
import '../styles/Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paytm'>('cod');
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Only set phone if it's a valid phone number (not email)
      if (parsedUser.phone && !parsedUser.phone.includes('@')) {
        setPhoneNumber(parsedUser.phone);
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    
    if (!phoneNumber.trim()) {
      alert('Please enter your mobile number');
      return;
    }
    
    if (!deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }
    
    if (paymentMethod === 'paytm') {
      initiatePaytmPayment();
    } else {
      placeOrder();
    }
  };

  const initiatePaytmPayment = async () => {
    try {
      const orderId = `ORDER_${Date.now()}`;
      const response = await paytmAPI.initiatePayment({
        orderId,
        amount: total,
        customerEmail: user.email,
        customerPhone: user.phone || '9999999999'
      });

      if (response.data.success) {
        const { paytmParams, paytmUrl } = response.data;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paytmUrl;
        form.style.display = 'none';

        const params = paytmParams.body;
        Object.keys(params).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
          form.appendChild(input);
        });

        const checksumInput = document.createElement('input');
        checksumInput.type = 'hidden';
        checksumInput.name = 'checksum';
        checksumInput.value = paytmParams.head.signature;
        form.appendChild(checksumInput);

        document.body.appendChild(form);
        
        localStorage.setItem('pendingOrder', JSON.stringify({
          items: cart.map(item => ({
            menuItemId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.selectedPrice,
            size: item.selectedSize
          })),
          total,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: phoneNumber,
          deliveryAddress: deliveryAddress,
          orderType: 'delivery',
          paymentMethod: 'paytm',
          paytmOrderId: orderId
        }));

        form.submit();
      }
    } catch (error) {
      alert('Error initiating payment');
    }
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.selectedPrice,
          size: item.selectedSize
        })),
        total,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: phoneNumber,
        deliveryAddress: deliveryAddress,
        orderType: 'delivery',
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
      };
      await orderAPI.create(orderData);
      alert('Order placed successfully!');
      clearCart();
      setShowCheckout(false);
      setShowQRPopup(false);
      onClose();
    } catch (error) {
      alert('Error placing order');
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="cart-modal">
      <div className="cart-content">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close cart"><FiX /></button>
        </div>

        {!showCheckout ? (
          <>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">Your cart is empty</div>
              ) : (
                cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize || 'single'}`} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.selectedSize && `${item.selectedSize} - `}₹{item.selectedPrice}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(`${item.id}-${item.selectedSize || 'single'}`, item.quantity - 1);
                        }} 
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(`${item.id}-${item.selectedSize || 'single'}`, item.quantity + 1);
                        }} 
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(`${item.id}-${item.selectedSize || 'single'}`);
                        }} 
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
              {cart.length > 0 && (
                <button type="button" className="checkout-btn" onClick={() => setShowCheckout(true)}>
                  Proceed to Checkout
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="checkout-form">
            <h3>Checkout</h3>
            <div className="checkout-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
            
            <div className="delivery-section">
              <h4>Delivery Details</h4>
              <textarea
                placeholder="Delivery Address *"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                rows={3}
                className="checkout-textarea"
              />
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="checkout-input"
              />
            </div>
            
            <div className="payment-section">
              <h4>Select Payment Method</h4>
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="payment-icon">💵</div>
                  <div className="payment-details">
                    <strong>Cash on Delivery</strong>
                    <span>Pay when you receive</span>
                  </div>
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'paytm' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('paytm')}
                >
                  <div className="payment-icon">💳</div>
                  <div className="payment-details">
                    <strong>Paytm Payment</strong>
                    <span>Pay via Paytm Gateway</span>
                  </div>
                </div>
              </div>
              
              {paymentMethod === 'paytm' && (
                <div className="paytm-info">
                  <p className="payment-note">You will be redirected to Paytm payment gateway</p>
                  <p className="payment-note">Supports: UPI, Cards, Net Banking, Paytm Wallet</p>
                </div>
              )}
            </div>
            
            <div className="checkout-total">Total: ₹{total}</div>
            <button type="button" className="place-order-btn" onClick={handleCheckout}>
              {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
            </button>
            <button type="button" className="back-btn" onClick={() => setShowCheckout(false)}>Back to Cart</button>
          </div>
        )}
      </div>
    </div>

    {showQRPopup && (
      <div className="qr-popup-overlay" onClick={() => setShowQRPopup(false)}>
        <div className="qr-popup" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="qr-close" onClick={() => setShowQRPopup(false)} aria-label="Close">
            <FiX />
          </button>
          <div className="qr-popup-content">
            <h2>Scan to Pay</h2>
            <p className="qr-amount">Amount: ₹{total}</p>
            <div className="qr-display">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=paytm.s1o5d0q@pty&pn=BambooYard&am=${total}&cu=INR`}
                alt="Payment QR Code"
                className="qr-image"
              />
            </div>
            <div className="upi-details">
              <p className="upi-label">UPI ID</p>
              <p className="upi-value">paytm.s1o5d0q@pty</p>
            </div>
            <div className="payment-instructions">
              <p>1. Open any UPI app (Paytm, PhonePe, GPay)</p>
              <p>2. Scan the QR code</p>
              <p>3. Complete the payment</p>
              <p>4. Enter Transaction ID below</p>
            </div>
            <div className="transaction-input-group">
              <input
                type="text"
                placeholder="Enter Transaction ID / UTR Number"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="transaction-input"
                required
              />
            </div>
            <button 
              type="button" 
              className="payment-done-btn" 
              onClick={placeOrder}
              disabled={!transactionId.trim()}
            >
              ✓ Confirm Payment & Place Order
            </button>
            <p className="payment-warning">⚠️ Please enter valid transaction ID to confirm payment</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Cart;
