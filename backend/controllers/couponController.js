// ==============================================================
// CONTROLLER: Coupon
// File: backend/controllers/couponController.js
// Student Implementation: Coupon discount verification, bounds & admin CRUD
// ==============================================================

import { CouponModel } from '../models/Coupon.js';

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await CouponModel.find();
    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active coupons for checkout preview
// @route   GET /api/coupons/active
// @access  Public
export const getActiveCoupons = async (req, res, next) => {
  try {
    const all = await CouponModel.find();
    const active = all.filter(c => c.isActive);
    res.status(200).json({
      success: true,
      count: active.length,
      coupons: active
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon code & calculate discount
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, amount = 0 } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a coupon code.'
      });
    }

    const coupon = await CouponModel.findByCode(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code '${code.toUpperCase()}' is invalid.`
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${coupon.code}' is no longer active.`
      });
    }

    // Check expiry
    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate && coupon.expiryDate < today) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${coupon.code}' expired on ${coupon.expiryDate}.`
      });
    }

    const orderAmount = Number(amount);
    if (orderAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for coupon '${coupon.code}' is $${coupon.minPurchaseAmount.toFixed(2)}. Your current total is $${orderAmount.toFixed(2)}.`
      });
    }

    // Calculate discount
    const rawDiscount = (orderAmount * coupon.discountPercentage) / 100;
    const discountAmount = Number(Math.min(rawDiscount, coupon.maxDiscount).toFixed(2));
    const newTotal = Number((orderAmount - discountAmount).toFixed(2));

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied! You saved $${discountAmount.toFixed(2)} (${coupon.discountPercentage}% off).`,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscount: coupon.maxDiscount,
        newTotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercentage, minPurchaseAmount, maxDiscount, expiryDate, isActive, description } = req.body;

    if (!code || discountPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Coupon code and discount percentage are required.'
      });
    }

    const newCoupon = await CouponModel.create({
      code,
      discountPercentage,
      minPurchaseAmount,
      maxDiscount,
      expiryDate,
      isActive,
      description
    });

    res.status(201).json({
      success: true,
      message: `Coupon '${newCoupon.code}' created successfully!`,
      coupon: newCoupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const updated = await CouponModel.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coupon not found to update' });
    }
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully!',
      coupon: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const deleted = await CouponModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Coupon not found to delete' });
    }
    res.status(200).json({
      success: true,
      message: `Coupon '${deleted.code}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
