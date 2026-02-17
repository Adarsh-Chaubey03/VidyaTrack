import express from 'express';
import {
  createPaymentOrder,
  confirmPayment,
  getPaymentStatus,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const paymentRouter = express.Router();

// All routes require authentication
paymentRouter.post('/create-order', protect, createPaymentOrder);
paymentRouter.post('/confirm', protect, confirmPayment);
paymentRouter.get('/status/:transactionId', protect, getPaymentStatus);
paymentRouter.get('/history', protect, getPaymentHistory);

// Note: The webhook route is registered separately in server.js
// because it needs express.raw() body parsing for signature verification.

export default paymentRouter;
