// ==============================================================
// ROUTE: Report & Analytics Routes
// File: backend/routes/reportRoutes.js
// ==============================================================

import express from 'express';
import { getDashboardSummary } from '../controllers/reportController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', verifyToken, isAdmin, getDashboardSummary);

export default router;
