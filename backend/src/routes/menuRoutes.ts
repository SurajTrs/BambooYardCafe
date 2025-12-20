import { Router } from 'express';
import { getAllMenuItems, getMenuItemsByCategory, searchMenuItems } from '../controllers/menuController.js';

const router = Router();

router.get('/', getAllMenuItems);
router.get('/search', searchMenuItems);
router.get('/category/:category', getMenuItemsByCategory);

export default router;
