// ==============================================================
// ROUTE: Coupon Routes
// File: backend/routes/couponRoutes.js
// ==============================================================

import express from 'express';
import {
  getCoupons,
  getActiveCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);

// Admin-only management
router.get('/', verifyToken, isAdmin, getCoupons);
router.post('/', verifyToken, isAdmin, createCoupon);
router.put('/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/:id', verifyToken, isAdmin, deleteCoupon);

export default router;
