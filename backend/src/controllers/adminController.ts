import { Request, Response } from 'express';
import { menuItems } from '../data/menu.js';
import { loadData, saveData } from '../utils/storage.js';

const getOrders = () => loadData('orders', []);
const getReservations = () => loadData('reservations', []);

export const addMenuItem = (req: Request, res: Response) => {
  const newItem = { ...req.body, available: true };
  menuItems.push(newItem);
  saveData('menu', menuItems);
  res.status(201).json(newItem);
};

export const updateMenuItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const item = menuItems.find(i => i.id === id);
  if (item) {
    Object.assign(item, req.body);
    saveData('menu', menuItems);
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
};

export const toggleItemAvailability = (req: Request, res: Response) => {
  const { id } = req.params;
  const item = menuItems.find(i => i.id === id);
  if (item) {
    item.available = !item.available;
    saveData('menu', menuItems);
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
};

export const getStats = (req: Request, res: Response) => {
  const orders = getOrders();
  const reservations = getReservations();
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
    totalReservations: reservations.length,
    menuItems: menuItems.length,
    availableItems: menuItems.filter(i => i.available).length
  };
  res.json(stats);
};
