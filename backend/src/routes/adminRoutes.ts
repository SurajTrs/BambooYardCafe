import { Router } from 'express';
import { addMenuItem, updateMenuItem, toggleItemAvailability, getStats } from '../controllers/adminController.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import { adminLogin, verifyAdmin } from '../controllers/adminAuthController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/verify', authenticateToken, isAdmin, verifyAdmin);
router.get('/stats', authenticateToken, isAdmin, getStats);
router.post('/menu', authenticateToken, isAdmin, addMenuItem);
router.patch('/menu/:id', authenticateToken, isAdmin, updateMenuItem);
router.patch('/menu/:id/toggle', authenticateToken, isAdmin, toggleItemAvailability);
router.patch('/orders/:id/status', authenticateToken, isAdmin, updateOrderStatus);

export default router;
