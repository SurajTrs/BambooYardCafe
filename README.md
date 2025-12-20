# Bamboo Yard Cafe - Restaurant Website

Modern, professional restaurant website with separate backend and frontend built with React + TypeScript and Node.js + Express.

## Project Structure

```
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── data/
│   │   ├── types/
│   │   └── server.ts
│   └── package.json
│
└── frontend/         # React + TypeScript
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   ├── styles/
    │   ├── types/
    │   └── App.tsx
    └── package.json
```

## Features

### Backend
- RESTful API with Express
- Menu management endpoints
- Order processing
- Contact form handling
- TypeScript for type safety

### Frontend
- Modern React with TypeScript
- Context API for state management
- Responsive design
- Shopping cart functionality
- Menu filtering and search
- Order checkout
- Contact form

## Installation

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5001

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

- `GET /api/menu` - Get all menu items
- `GET /api/menu/search?q=query` - Search menu items
- `GET /api/menu/category/:category` - Get items by category
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `POST /api/contact` - Submit contact form

## Technologies

### Backend
- Node.js
- Express
- TypeScript
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- React Icons
- CSS3

## Development

Both backend and frontend support hot reload during development.

Start backend: `cd backend && npm run dev`
Start frontend: `cd frontend && npm run dev`

## Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Menu Categories

- Fried Rice (21 items)
- Noodles (16 items)
- Kathi Rolls (13 items)
- Momos (19 items)
- Starters (22 items)
- Others (20 items)

Total: 111 menu items
