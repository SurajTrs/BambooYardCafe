# Paytm Payment Gateway Integration Guide

## Overview
This guide explains how to set up and use the official Paytm Payment Gateway integration in Bamboo Yard Cafe.

## Features
- Official Paytm Payment Gateway integration
- Support for multiple payment methods (UPI, Cards, Net Banking, Paytm Wallet)
- Secure payment processing with checksum verification
- Payment status tracking
- Automatic order creation after successful payment

## Prerequisites
1. Paytm Merchant Account
2. Merchant ID (MID)
3. Merchant Key
4. Test/Production credentials

## Setup Instructions

### 1. Get Paytm Credentials

#### For Testing (Staging):
1. Visit [Paytm Developer Dashboard](https://dashboard.paytm.com/next/developers)
2. Sign up for a test merchant account
3. Get your test credentials:
   - Merchant ID (MID)
   - Merchant Key
   - Website Name (usually "WEBSTAGING" for testing)

#### For Production:
1. Complete KYC verification on Paytm Business
2. Get production credentials from Paytm Dashboard
3. Update environment variables with production credentials

### 2. Configure Backend

Update `/backend/.env` file with your Paytm credentials:

```env
# Paytm Payment Gateway Configuration
PAYTM_MID=YOUR_MERCHANT_ID
PAYTM_MERCHANT_KEY=YOUR_MERCHANT_KEY
PAYTM_WEBSITE=WEBSTAGING
PAYTM_CHANNEL_ID=WEB
PAYTM_INDUSTRY_TYPE=Retail
PAYTM_CALLBACK_URL=http://localhost:5001/api/paytm/callback
```

**Important Notes:**
- For testing, use `PAYTM_WEBSITE=WEBSTAGING`
- For production, use `PAYTM_WEBSITE=DEFAULT` or your assigned website name
- Update `PAYTM_CALLBACK_URL` to your production URL when deploying

### 3. Install Dependencies

Backend dependencies are already installed. If needed, run:
```bash
cd backend
npm install
```

Frontend dependencies are already installed. If needed, run:
```bash
cd frontend
npm install
```

### 4. Start the Application

Start backend:
```bash
cd backend
npm run dev
```

Start frontend:
```bash
cd frontend
npm run dev
```

## How It Works

### Payment Flow

1. **User adds items to cart** → Proceeds to checkout
2. **Selects Paytm Payment** → Clicks "Proceed to Payment"
3. **Backend initiates payment** → Generates checksum and payment parameters
4. **User redirected to Paytm** → Completes payment on Paytm gateway
5. **Paytm processes payment** → Redirects back to callback URL
6. **Backend verifies payment** → Validates checksum and payment status
7. **Order created** → User sees success/failure page

### API Endpoints

#### POST `/api/paytm/initiate`
Initiates a new payment transaction
```json
{
  "orderId": "ORDER_1234567890",
  "amount": 500,
  "customerEmail": "customer@example.com",
  "customerPhone": "9999999999"
}
```

#### POST `/api/paytm/verify`
Verifies payment after completion
```json
{
  "ORDERID": "ORDER_1234567890",
  "TXNID": "TXN123456",
  "STATUS": "TXN_SUCCESS",
  "CHECKSUMHASH": "checksum_value"
}
```

#### POST `/api/paytm/callback`
Handles Paytm callback after payment (automatic)

#### GET `/api/paytm/status/:orderId`
Checks payment status for an order

## Testing

### Test Cards (Staging Environment)

**Credit/Debit Cards:**
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 489871

**Net Banking:**
- Select any test bank
- Use test credentials provided by Paytm

**UPI:**
- Use test UPI ID: test@paytm

### Test Scenarios

1. **Successful Payment:**
   - Complete payment with test credentials
   - Verify order creation
   - Check payment status page

2. **Failed Payment:**
   - Cancel payment on Paytm page
   - Verify failure handling
   - Check error messages

3. **Pending Payment:**
   - Simulate network issues
   - Verify status checking

## Production Deployment

### 1. Update Environment Variables

```env
NODE_ENV=production
PAYTM_MID=YOUR_PRODUCTION_MID
PAYTM_MERCHANT_KEY=YOUR_PRODUCTION_KEY
PAYTM_WEBSITE=DEFAULT
PAYTM_CALLBACK_URL=https://yourdomain.com/api/paytm/callback
```

### 2. Update Frontend URLs

In `Cart.tsx`, the payment URLs automatically switch based on `NODE_ENV`:
- Staging: `https://securegw-stage.paytm.in`
- Production: `https://securegw.paytm.in`

### 3. SSL Certificate

Ensure your production server has a valid SSL certificate. Paytm requires HTTPS for production.

### 4. Webhook Configuration

Configure webhook URL in Paytm Dashboard:
```
https://yourdomain.com/api/paytm/callback
```

## Security Best Practices

1. **Never expose Merchant Key** in frontend code
2. **Always verify checksum** on backend
3. **Use HTTPS** in production
4. **Validate payment status** before order creation
5. **Store transaction IDs** for reconciliation
6. **Implement rate limiting** on payment endpoints
7. **Log all transactions** for audit trail

## Troubleshooting

### Common Issues

**1. Checksum Mismatch Error**
- Verify Merchant Key is correct
- Check parameter order in checksum generation
- Ensure no extra spaces in credentials

**2. Payment Initiation Failed**
- Check if all required parameters are provided
- Verify MID and Merchant Key
- Check network connectivity

**3. Callback Not Received**
- Verify callback URL is accessible
- Check firewall settings
- Ensure URL is whitelisted in Paytm Dashboard

**4. Payment Status Not Updating**
- Check order ID format
- Verify transaction ID is stored correctly
- Use status check API to verify

### Debug Mode

Enable debug logging in backend:
```typescript
console.log('Payment params:', paytmParams);
console.log('Checksum:', checksum);
```

## Support

### Paytm Support
- Developer Docs: https://developer.paytm.com/docs/
- Support Email: support@paytm.com
- Dashboard: https://dashboard.paytm.com

### Integration Support
For issues with this integration, check:
1. Backend logs: `/backend/src/controllers/paytmController.ts`
2. Frontend console: Browser DevTools
3. Network tab: Check API requests/responses

## Additional Features

### Future Enhancements
- Refund processing
- Subscription payments
- EMI options
- Saved cards
- Payment analytics dashboard

## Compliance

Ensure compliance with:
- PCI DSS standards
- RBI guidelines for payment gateways
- Data privacy regulations (GDPR, etc.)
- Paytm's terms of service

## License

This integration follows Paytm's SDK license and terms of service.
