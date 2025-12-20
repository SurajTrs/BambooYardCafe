import { Request, Response } from 'express';
import { Order } from '../types/index.js';
import { saveData, loadData } from '../utils/storage.js';

export const orders: Order[] = loadData('orders', []);

export const createOrder = (req: Request, res: Response) => {
  const order: Order = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  orders.push(order);
  saveData('orders', orders);
  res.status(201).json(order);
};

export const getOrders = (req: Request, res: Response) => {
  res.json(orders);
};

export const updateOrderStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveData('orders', orders);
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
};
