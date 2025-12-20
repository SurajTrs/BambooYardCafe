import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface Admin {
  id: string;
  email: string;
  password: string;
  role: string;
}

const admins: Admin[] = [];

const initializeAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bambooyardcafe.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  
  const existingAdmin = admins.find(a => a.email === adminEmail);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    admins.push({
      id: 'admin-1',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
  }
};

initializeAdmin();

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyAdmin = (req: Request, res: Response) => {
  res.json({ valid: true, user: req.user });
};
