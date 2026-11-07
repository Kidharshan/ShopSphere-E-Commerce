// ==============================================================
// ROUTE: User Routes (Admin)
// File: backend/routes/userRoutes.js
// ==============================================================

import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
