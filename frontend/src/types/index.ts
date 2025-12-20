export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceHalf?: number;
  priceFull?: number;
  price?: number;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: 'half' | 'full';
  selectedPrice: number;
}

export type Category = 'all' | 'fried-rice' | 'noodles' | 'momos' | 'starters' | 'rolls' | 'others';
