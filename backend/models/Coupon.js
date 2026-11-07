// ==============================================================
// MONGOOSE MODEL: Coupon
// File: backend/models/Coupon.js
// Discount codes, percentage calculation, expiry, minimum purchase bounds
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide coupon code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Please specify discount percentage'],
      min: [1, 'Discount must be at least 1%'],
      max: [100, 'Discount cannot exceed 100%']
    },
    minPurchaseAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: 100
    },
    expiryDate: {
      type: String,
      required: [true, 'Please provide coupon expiry date']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

couponSchema.index({ code: 1 });

export const CouponModel = {
  find: async () => [...store.coupons],

  findByCode: async (code) => {
    if (!code) return null;
    return store.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
  },

  findById: async (id) => {
    return store.coupons.find(c => c._id === id) || null;
  },

  create: async (data) => {
    const existing = store.coupons.find(c => c.code.toUpperCase() === data.code.trim().toUpperCase());
    if (existing) {
      throw new Error(`Coupon code '${data.code.toUpperCase()}' already exists`);
    }

    const newCoupon = {
      _id: "coupon_" + Date.now(),
      code: data.code.trim().toUpperCase(),
      discountPercentage: Number(data.discountPercentage),
      minPurchaseAmount: Number(data.minPurchaseAmount || 0),
      maxDiscount: Number(data.maxDiscount || 100),
      expiryDate: data.expiryDate || '2026-12-31',
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      description: data.description || `${data.discountPercentage}% off discount code`,
      createdAt: new Date().toISOString()
    };
    store.coupons.unshift(newCoupon);
    return newCoupon;
  },

  findByIdAndUpdate: async (id, updateData) => {
    const idx = store.coupons.findIndex(c => c._id === id);
    if (idx === -1) return null;

    if (updateData.code) {
      updateData.code = updateData.code.trim().toUpperCase();
    }
    if (updateData.discountPercentage !== undefined) {
      updateData.discountPercentage = Number(updateData.discountPercentage);
    }
    if (updateData.minPurchaseAmount !== undefined) {
      updateData.minPurchaseAmount = Number(updateData.minPurchaseAmount);
    }
    if (updateData.maxDiscount !== undefined) {
      updateData.maxDiscount = Number(updateData.maxDiscount);
    }

    store.coupons[idx] = { ...store.coupons[idx], ...updateData };
    return store.coupons[idx];
  },

  findByIdAndDelete: async (id) => {
    const idx = store.coupons.findIndex(c => c._id === id);
    if (idx === -1) return null;
    return store.coupons.splice(idx, 1)[0];
  },

  countDocuments: async () => store.coupons.length
};

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
