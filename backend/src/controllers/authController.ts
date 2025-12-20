import { Request, Response } from 'express';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

const users: User[] = [];

export const signup = (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user: User = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password,
  };

  users.push(user);

  const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
};

export const getProfile = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = Buffer.from(token, 'base64').toString();
  const [userId] = decoded.split(':');

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
};
