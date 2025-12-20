# Admin Portal Guide - Bamboo Yard Cafe

## 🎯 Access Admin Panel

**URL:** http://localhost:5173/admin.html

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**
  - Total Revenue
  - Total Orders
  - Pending Orders
  - Total Reservations
- **Recent Orders View**
  - Last 5 orders with status
  - Quick overview of customer details

### 📦 Orders Management
- **Filter Orders by Status**
  - All, Pending, Confirmed, Preparing, Ready
- **Order Details**
  - Customer information
  - Order items with quantities
  - Total amount
  - Payment method
- **Update Order Status**
  - Pending → Confirmed → Preparing → Ready → Delivered
  - Cancel orders if needed

### 🍜 Menu Management
- **Search Menu Items**
  - Real-time search by name
- **Filter by Category**
  - Fried Rice, Noodles, Momos, Starters, Rolls, Others
- **Toggle Availability**
  - Mark items as available/unavailable
  - Visual indicators for status
- **View Pricing**
  - Half/Full portions
  - Single price items

### 📅 Reservations Management
- **Filter Reservations**
  - All, Pending, Confirmed, Cancelled
- **Reservation Details**
  - Customer contact info
  - Date, time, and guest count
  - Special requests
- **Update Status**
  - Confirm or cancel reservations

## 🎨 Design Features

### Modern UI Elements
- **Gradient Sidebar** - Dark theme with smooth gradients
- **Stat Cards** - Color-coded with icons
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Works on all devices
- **Status Badges** - Color-coded order/reservation status

### Color Scheme
- **Primary:** Orange (#ff6b35)
- **Secondary:** Blue (#004e89)
- **Dark:** Navy (#1a1a2e)
- **Sidebar:** Gradient dark theme
- **Cards:** White with shadows

## 🔧 Customization

### Add Authentication (Recommended)
```typescript
// Create login page
// Add JWT token verification
// Protect admin routes
```

### Add More Features
- Analytics charts (Chart.js/Recharts)
- Export reports (CSV/PDF)
- Email notifications
- Push notifications
- Inventory management

## 📱 Mobile Responsive
- Sidebar collapses on mobile
- Cards stack vertically
- Touch-friendly buttons
- Optimized for tablets

## 🚀 Production Deployment

### Build for Production
```bash
cd frontend
npm run build
```

### Deploy
- **Frontend:** Vercel, Netlify, AWS S3
- **Backend:** Railway, Render, AWS EC2
- **Database:** Add MongoDB/PostgreSQL for persistence

## 🔐 Security Recommendations

1. **Add Authentication**
   - Implement login system
   - Use JWT tokens
   - Session management

2. **Protect Routes**
   - Middleware for admin routes
   - Role-based access control

3. **Environment Variables**
   - Store sensitive data in .env
   - Never commit credentials

4. **HTTPS**
   - Use SSL certificates
   - Secure API endpoints

## 📊 Future Enhancements

- [ ] Real-time notifications
- [ ] Analytics dashboard with charts
- [ ] Customer management
- [ ] Inventory tracking
- [ ] Staff management
- [ ] Report generation
- [ ] Email/SMS integration
- [ ] Multi-language support

## 🐛 Troubleshooting

**Admin page not loading:**
- Ensure backend is running on port 5000
- Check browser console for errors
- Clear cache and reload

**Data not updating:**
- Check API endpoints
- Verify backend is running
- Check network tab in DevTools

**Styling issues:**
- Clear browser cache
- Check CSS file imports
- Verify Vite build

## 📞 Support

For issues or feature requests, check the main README.md or create an issue.

---
**Admin Portal Version:** 1.0.0
**Last Updated:** 2024
