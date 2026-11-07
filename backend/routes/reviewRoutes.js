// ==============================================================
// ROUTE: Review Routes
// File: backend/routes/reviewRoutes.js
// ==============================================================

import express from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', verifyToken, createReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;
