export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceHalf?: number;
  priceFull?: number;
  price?: number;
  image?: string;
  available: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'online' | 'cod' | 'paytm';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paytmTransactionId?: string;
  paytmOrderId?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  size?: 'half' | 'full';
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
}
