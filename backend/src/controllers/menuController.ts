import { Request, Response } from 'express';
import { menuItems } from '../data/menu.js';

export const getAllMenuItems = (req: Request, res: Response) => {
  res.json(menuItems);
};

export const getMenuItemsByCategory = (req: Request, res: Response) => {
  const { category } = req.params;
  const filtered = menuItems.filter(item => item.category === category);
  res.json(filtered);
};

export const searchMenuItems = (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) return res.json(menuItems);
  
  const query = q.toString().toLowerCase();
  const filtered = menuItems.filter(item => 
    item.name.toLowerCase().includes(query)
  );
  res.json(filtered);
};
