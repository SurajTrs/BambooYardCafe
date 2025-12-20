import { Request, Response } from 'express';
import { ContactMessage } from '../types/index.js';

const messages: ContactMessage[] = [];

export const submitContact = (req: Request, res: Response) => {
  const message: ContactMessage = req.body;
  messages.push(message);
  res.status(201).json({ success: true, message: 'Message received' });
};
