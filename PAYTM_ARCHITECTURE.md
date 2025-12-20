# Paytm Payment Gateway - Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BAMBOO YARD CAFE                        │
│                   Payment Architecture                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │ ◄────► │   Backend    │ ◄────► │    Paytm     │
│  React App   │         │  Express API │         │   Gateway    │
└──────────────┘         └──────────────┘         └──────────────┘
```

## 📊 Component Structure

### Backend Components

```
backend/
├── src/
│   ├── controllers/
│   │   └── paytmController.ts      ← Payment logic
│   ├── routes/
│   │   └── paytmRoutes.ts          ← API endpoints
│   ├── types/
│   │   └── index.ts                ← Type definitions
│   └── server.ts                   ← Route registration
└── .env                            ← Configuration
```

### Frontend Components

```
frontend/
├── src/
│   ├── components/
│   │   └── Cart.tsx                ← Payment UI
│   ├── pages/
│   │   └── PaymentStatus.tsx       ← Status page
│   ├── services/
│   │   └── api.ts                  ← API calls
│   └── styles/
│       ├── Cart.css                ← Cart styling
│       └── PaymentStatus.css       ← Status styling
```

## 🔄 Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                             │
└─────────────────────────────────────────────────────────────┘

1. USER ADDS ITEMS TO CART
   │
   ├─► Cart Component (Cart.tsx)
   │   └─► Shows items, total, checkout button
   │
2. USER SELECTS PAYTM PAYMENT
   │
   ├─► Payment Options UI
   │   └─► COD or Paytm
   │
3. USER CLICKS "PROCEED TO PAYMENT"
   │
   ├─► initiatePaytmPayment()
   │   ├─► Generate order ID
   │   ├─► Call POST /api/paytm/initiate
   │   └─► Store pending order in localStorage
   │
4. BACKEND PROCESSES REQUEST
   │
   ├─► paytmController.initiatePayment()
   │   ├─► Create payment params
   │   ├─► Generate checksum
   │   └─► Return Paytm URL & params
   │
5. USER REDIRECTED TO PAYTM
   │
   ├─► Form auto-submit to Paytm Gateway
   │   └─► User completes payment
   │
6. PAYTM PROCESSES PAYMENT
   │
   ├─► Payment Success/Failure
   │   └─► Redirect to callback URL
   │
7. BACKEND RECEIVES CALLBACK
   │
   ├─► paytmController.handleCallback()
   │   ├─► Verify checksum
   │   ├─► Validate payment
   │   └─► Redirect to /payment-status
   │
8. FRONTEND SHOWS STATUS
   │
   ├─► PaymentStatus.tsx
   │   ├─► Get pending order from localStorage
   │   ├─► Create order via API
   │   ├─► Clear cart
   │   └─► Show success/failure message
   │
9. ORDER CREATED
   │
   └─► User sees confirmation
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY MEASURES                         │
└─────────────────────────────────────────────────────────────┘

Frontend                Backend                 Paytm
   │                       │                       │
   ├─► Request Payment    │                       │
   │                       │                       │
   │   ◄─── Checksum ─────┤                       │
   │      (Generated)      │                       │
   │                       │                       │
   ├─────── Payment ──────────────────────────────►│
   │        Request        │                       │
   │                       │                       │
   │   ◄──────────────────────── Callback ────────┤
   │                       │                       │
   │                       ├─► Verify Checksum    │
   │                       │   (Validation)        │
   │                       │                       │
   │   ◄─── Status ────────┤                       │
   │      (Verified)       │                       │
   │                       │                       │
   └─► Create Order        │                       │
```

## 📡 API Endpoints

### POST /api/paytm/initiate
**Purpose**: Start payment transaction

**Request**:
```json
{
  "orderId": "ORDER_1234567890",
  "amount": 500,
  "customerEmail": "user@example.com",
  "customerPhone": "9999999999"
}
```

**Response**:
```json
{
  "success": true,
  "paytmParams": {
    "body": { /* payment params */ },
    "head": { "signature": "checksum" }
  },
  "paytmUrl": "https://securegw-stage.paytm.in/...",
  "orderId": "ORDER_1234567890"
}
```

### POST /api/paytm/verify
**Purpose**: Verify payment after completion

**Request**:
```json
{
  "ORDERID": "ORDER_1234567890",
  "TXNID": "TXN123456",
  "STATUS": "TXN_SUCCESS",
  "CHECKSUMHASH": "checksum_value"
}
```

**Response**:
```json
{
  "success": true,
  "verified": true,
  "orderId": "ORDER_1234567890",
  "status": "TXN_SUCCESS",
  "transactionId": "TXN123456"
}
```

### POST /api/paytm/callback
**Purpose**: Handle Paytm redirect (automatic)

**Action**: Verifies payment and redirects to frontend

### GET /api/paytm/status/:orderId
**Purpose**: Check payment status

**Response**:
```json
{
  "body": {
    "resultInfo": {
      "resultStatus": "TXN_SUCCESS",
      "resultCode": "01",
      "resultMsg": "Txn Success"
    },
    "txnId": "TXN123456",
    "txnAmount": "500.00"
  }
}
```

## 💾 Data Flow

### Order Data Structure

```typescript
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'online' | 'cod' | 'paytm';  // ← Added
  paymentStatus: 'pending' | 'completed' | 'failed';
  paytmTransactionId?: string;                 // ← Added
  paytmOrderId?: string;                       // ← Added
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
}
```

## 🎨 UI Components

### Cart Component States

```
┌─────────────────────────────────────────┐
│           CART COMPONENT                │
├─────────────────────────────────────────┤
│                                         │
│  State 1: Cart View                     │
│  ├─ Show items                          │
│  ├─ Show total                          │
│  └─ "Proceed to Checkout" button        │
│                                         │
│  State 2: Checkout View                 │
│  ├─ Customer info                       │
│  ├─ Payment options                     │
│  │  ├─ Cash on Delivery                 │
│  │  └─ Paytm Payment ← NEW              │
│  └─ "Proceed to Payment" button         │
│                                         │
│  State 3: Payment Processing            │
│  └─ Redirect to Paytm Gateway           │
│                                         │
└─────────────────────────────────────────┘
```

### Payment Status Page States

```
┌─────────────────────────────────────────┐
│      PAYMENT STATUS COMPONENT           │
├─────────────────────────────────────────┤
│                                         │
│  State 1: Loading                       │
│  ├─ Spinner animation                   │
│  └─ "Processing Payment..."             │
│                                         │
│  State 2: Success                       │
│  ├─ Success icon (✓)                    │
│  ├─ "Payment Successful!"               │
│  ├─ Order ID                            │
│  ├─ Transaction ID                      │
│  └─ "Back to Home" button               │
│                                         │
│  State 3: Failed                        │
│  ├─ Error icon (✗)                      │
│  ├─ "Payment Failed"                    │
│  ├─ Error message                       │
│  └─ "Back to Home" button               │
│                                         │
└─────────────────────────────────────────┘
```

## 🔄 State Management

### LocalStorage Usage

```javascript
// Store pending order before redirect
localStorage.setItem('pendingOrder', JSON.stringify({
  items: [...],
  total: 500,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "9999999999",
  orderType: "delivery",
  paymentMethod: "paytm",
  paytmOrderId: "ORDER_1234567890"
}));

// Retrieve after payment
const pendingOrder = localStorage.getItem('pendingOrder');

// Clear after order creation
localStorage.removeItem('pendingOrder');
```

## 🌐 Environment Configuration

### Development
```env
NODE_ENV=development
PAYTM_WEBSITE=WEBSTAGING
Paytm URL: https://securegw-stage.paytm.in
```

### Production
```env
NODE_ENV=production
PAYTM_WEBSITE=DEFAULT
Paytm URL: https://securegw.paytm.in
```

## 📊 Transaction Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│              TRANSACTION LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

1. INITIATED
   ├─ Order ID generated
   ├─ Checksum created
   └─ Stored in localStorage

2. PENDING
   ├─ User on Paytm gateway
   └─ Payment in progress

3. PROCESSING
   ├─ Payment completed on Paytm
   ├─ Callback received
   └─ Checksum verified

4. COMPLETED / FAILED
   ├─ Status determined
   ├─ Order created (if success)
   └─ User notified

5. CONFIRMED
   └─ Order in system
```

## 🎯 Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│            INTEGRATION TOUCHPOINTS                          │
└─────────────────────────────────────────────────────────────┘

1. Cart Component
   └─ Initiates payment flow

2. API Service
   └─ Communicates with backend

3. Backend Controller
   └─ Handles Paytm integration

4. Paytm Gateway
   └─ Processes payment

5. Callback Handler
   └─ Receives payment status

6. Status Page
   └─ Shows result to user

7. Order System
   └─ Creates final order
```

---

**Architecture Version**: 1.0.0
**Last Updated**: November 2024
**Integration Status**: ✅ Complete
