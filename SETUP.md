# Bamboo Yard Cafe - Complete Setup Guide

## 🚀 Features Implemented

### ✅ Core Functionalities
- Menu display with 6 categories (111 items)
- Online ordering system with shopping cart
- Table reservation/booking system
- Contact form with location info
- Responsive design for all devices

### ✅ Payment Integration
- Razorpay integration ready (placeholder)
- Cash on Delivery option
- Online payment support

### ✅ Admin Panel (Backend Ready)
- Menu item management
- Order management
- Reservation management
- Toggle item availability

### ✅ User Experience
- Guest checkout (no login required)
- Half/Full portion selection
- Search and filter menu
- Real-time cart updates

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
**Runs on:** http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
**Runs on:** http://localhost:5173

## 🔧 Configuration

### Razorpay Setup (Optional)
1. Sign up at https://razorpay.com
2. Get API keys from Dashboard
3. Add to `backend/.env`:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Environment Variables
**Backend (.env):**
```
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

## 📱 API Endpoints

### Menu
- `GET /api/menu` - All menu items
- `GET /api/menu/search?q=query` - Search
- `GET /api/menu/category/:category` - By category

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders

### Reservations
- `POST /api/reservations` - Book table
- `GET /api/reservations` - Get bookings
- `PATCH /api/reservations/:id/status` - Update status

### Payment
- `POST /api/payment/create-order` - Create payment
- `POST /api/payment/verify` - Verify payment

### Admin
- `PATCH /api/admin/menu/:id` - Update menu item
- `PATCH /api/admin/menu/:id/toggle` - Toggle availability

### Contact
- `POST /api/contact` - Submit message

## 🎨 Customization

### Add Your Images
Replace placeholder images in menu items:
```typescript
// backend/src/data/menu.ts
{ 
  id: '1', 
  name: 'Egg Fried Rice',
  image: '/images/egg-fried-rice.jpg',  // Add this
  ...
}
```

### Update Contact Info
Edit `frontend/src/components/Contact.tsx`:
- Address
- Phone number
- Email
- Business hours

### Color Theme
Edit `frontend/src/App.css`:
```css
:root {
  --primary: #ff6b35;    /* Orange */
  --secondary: #004e89;  /* Blue */
  --dark: #1a1a2e;
  --light: #f5f5f5;
}
```

## 🛠️ Next Steps

1. **Add Images:** Place restaurant/food images in `frontend/public/images/`
2. **Configure Razorpay:** Add real API keys for payments
3. **Deploy Backend:** Use Railway, Render, or AWS
4. **Deploy Frontend:** Use Vercel, Netlify, or AWS S3
5. **Add Google Maps:** Integrate map in Contact section
6. **Email Notifications:** Add nodemailer for order confirmations

## 📊 Admin Panel (Coming Soon)
Create separate admin dashboard at `/admin` route with:
- Login authentication
- Order management UI
- Menu editor
- Reservation calendar
- Analytics dashboard

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**CORS errors:**
- Ensure backend is running on port 5000
- Check Vite proxy configuration

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support
For issues or questions, check the code comments or create an issue in the repository.

---
**Built with:** React + TypeScript + Node.js + Express
**Ready for:** Production deployment
