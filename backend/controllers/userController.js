// ==============================================================
// CONTROLLER: User Management (Admin)
// File: backend/controllers/userController.js
// Student Implementation: View users, update roles, manage college store accounts
// ==============================================================

import { UserModel } from '../models/User.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be "admin" or "customer".'
      });
    }

    const updated = await UserModel.findByIdAndUpdate(req.params.id, { role });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}' successfully!`,
      user: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: 'Action forbidden: You cannot delete your own administrative account.'
      });
    }

    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found to delete' });
    }

    res.status(200).json({
      success: true,
      message: `User '${deleted.name}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
