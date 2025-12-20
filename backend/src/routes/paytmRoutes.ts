import express from 'express';
import { initiatePayment, verifyPayment, handleCallback, checkStatus } from '../controllers/paytmController.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);
router.post('/callback', handleCallback);
router.get('/status/:orderId', checkStatus);

export default router;
