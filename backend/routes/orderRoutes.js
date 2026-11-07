// ==============================================================
// ROUTE: Order Routes
// File: backend/routes/orderRoutes.js
// ==============================================================

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/', isAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;
