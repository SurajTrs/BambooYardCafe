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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'paytm' | 'upi'>('cod');
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);

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
    } else if (paymentMethod === 'upi') {
      setShowQRPopup(true);
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
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        transactionId: paymentMethod === 'upi' ? transactionId : undefined
      };
      await orderAPI.create(orderData);
      alert('✓ Order placed successfully! Your order is being prepared.');
      clearCart();
      setShowCheckout(false);
      setShowQRPopup(false);
      setTransactionId('');
      onClose();
    } catch (error) {
      alert('Error placing order. Please try again.');
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Get readable address using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
              setDeliveryAddress(data.display_name);
            } else {
              setDeliveryAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            setDeliveryAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
          
          setLocationLoading(false);
          setShowLocationModal(true);
        },
        (error) => {
          alert('Unable to get location. Please enter address manually.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation not supported.');
      setLocationLoading(false);
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
              <div className="address-input-container">
                <textarea
                  placeholder="Delivery Address *"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  rows={3}
                  className="checkout-textarea"
                />
                <button 
                  type="button" 
                  className="location-btn"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? '📍 Getting...' : '📍 Use Current Location'}
                </button>
              </div>
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
                  className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="payment-icon">📱</div>
                  <div className="payment-details">
                    <strong>UPI Payment</strong>
                    <span>Scan QR & Pay</span>
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
              
              {paymentMethod === 'upi' && (
                <div className="upi-info">
                  <p className="payment-note">Scan QR code to pay ₹{total}</p>
                  <p className="payment-note">Supports: PhonePe, GPay, Paytm, BHIM</p>
                </div>
              )}
              
              {paymentMethod === 'paytm' && (
                <div className="paytm-info">
                  <p className="payment-note">You will be redirected to Paytm payment gateway</p>
                  <p className="payment-note">Supports: UPI, Cards, Net Banking, Paytm Wallet</p>
                </div>
              )}
            </div>
            
            <div className="checkout-total">Total: ₹{total}</div>
            <button type="button" className="place-order-btn" onClick={handleCheckout}>
              {paymentMethod === 'cod' ? 'Place Order' : paymentMethod === 'upi' ? 'Show QR Code' : 'Proceed to Payment'}
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
            <h2>Scan QR Code to Pay</h2>
            <p className="qr-amount">Total Amount: ₹{total}</p>
            <div className="qr-display">
              <img 
                src="/qr.png"
                alt="Payment QR Code"
                className="qr-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=upi://pay?pa=bambooyardcafe@paytm%26pn=Bamboo%2520Yard%2520Cafe%26am=${total}%26cu=INR`;
                }}
              />
            </div>
            <div className="upi-details">
              <p className="upi-label">UPI ID: bambooyardcafe@paytm</p>
              <p className="amount-display">Amount: ₹{total}</p>
              <p className="payment-note">If QR doesn't work, pay manually using above UPI ID</p>
            </div>
            <div className="payment-instructions">
              <p>• Open any UPI app (PhonePe, GPay, Paytm, BHIM)</p>
              <p>• Scan the QR code above</p>
              <p>• Enter amount: ₹{total}</p>
              <p>• Complete the payment</p>
              <p>• Enter Transaction ID below after payment</p>
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
              ✓ Payment Done - Place Order
            </button>
            <p className="payment-warning">⚠️ Please enter valid transaction ID after payment</p>
          </div>
        </div>
      </div>
    )}
    {showLocationModal && currentLocation && (
      <div className="location-modal-overlay" onClick={() => setShowLocationModal(false)}>
        <div className="location-modal" onClick={(e) => e.stopPropagation()}>
          <div className="location-header">
            <h3>📍 Confirm Delivery Location</h3>
            <button type="button" className="location-close" onClick={() => setShowLocationModal(false)}>
              <FiX />
            </button>
          </div>
          
          <div className="map-container">
            <div className="map-wrapper">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng-0.01},${currentLocation.lat-0.01},${currentLocation.lng+0.01},${currentLocation.lat+0.01}&layer=mapnik&marker=${currentLocation.lat},${currentLocation.lng}`}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '10px' }}
                title="Delivery Location Map"
              />
              <div className="map-overlay">
                <div className="location-pin">
                  <div className="pin-icon">📍</div>
                  <div className="pin-shadow"></div>
                </div>
                <div className="map-instructions">
                  <p>Drag the map to adjust your location</p>
                </div>
              </div>
            </div>
            <div className="map-controls">
              <button 
                type="button" 
                className="recenter-btn"
                onClick={getCurrentLocation}
              >
                🎯 Re-center to GPS
              </button>
              <button 
                type="button" 
                className="update-address-btn"
                onClick={async () => {
                  // Simulate getting new coordinates from map center
                  const newLat = currentLocation.lat + (Math.random() - 0.5) * 0.001;
                  const newLng = currentLocation.lng + (Math.random() - 0.5) * 0.001;
                  
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();
                    if (data.display_name) {
                      setDeliveryAddress(data.display_name);
                      setCurrentLocation({ lat: newLat, lng: newLng });
                    }
                  } catch (error) {
                    console.error('Address update failed');
                  }
                }}
              >
                📍 Update Address
              </button>
            </div>
          </div>
          
          <div className="location-details">
            <div className="location-info">
              <h4>📍 Your Location</h4>
              <p className="address-text">{deliveryAddress}</p>
            </div>
            
            <div className="location-actions">
              <button 
                type="button" 
                className="adjust-location-btn"
                onClick={() => {
                  const newAddress = prompt('Enter your exact address:', deliveryAddress);
                  if (newAddress) setDeliveryAddress(newAddress);
                }}
              >
                ✏️ Edit Address
              </button>
              
              <button 
                type="button" 
                className="confirm-location-btn"
                onClick={() => setShowLocationModal(false)}
              >
                ✓ Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  );
};

export default Cart;
