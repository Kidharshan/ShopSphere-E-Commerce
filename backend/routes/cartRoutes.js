// ==============================================================
// ROUTE: Cart Routes
// File: backend/routes/cartRoutes.js
// ==============================================================

import express from 'express';
import {
  getCart,
  updateCart,
  addToCart,
  removeItem,
  clearCart
} from '../controllers/cartController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.put('/', updateCart);
router.post('/add', addToCart);
router.delete('/item/:productId', removeItem);
router.delete('/', clearCart);

export default router;
