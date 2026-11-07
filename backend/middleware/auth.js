// ==============================================================
// MIDDLEWARE: Authentication & Role Authorization
// File: backend/middleware/auth.js
// Handles JWT verification and role checks (Admin, Customer)
// ==============================================================

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'college_student_mern_secret_key_2025';

// 1. Verify JWT Token from Authorization Header (Bearer <token>)
export const verifyToken = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: No authentication token provided.'
      });
    }

    // Verify token using jsonwebtoken
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user details from database
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User no longer exists.'
      });
    }

    // Attach user object to request
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or expired token.'
    });
  }
};

// 2. Role Middleware: Admin Only
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access privileges required.'
  });
};

// 3. Role Middleware: Customer Only or Authenticated
export const isCustomer = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Customer access privileges required.'
  });
};

export default { verifyToken, isAdmin, isCustomer };
