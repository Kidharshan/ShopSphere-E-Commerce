// ==============================================================
// MONGOOSE MODEL: Order
// File: backend/models/Order.js
// Handles complete checkout, discounts, inventory deduction, order tracking
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

export const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United States' }
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Credit Card'
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    discountAmount: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    couponCode: { type: String, default: null },
    isPaid: { type: Boolean, required: true, default: true },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

export const OrderModel = {
  find: async (query = {}) => {
    let orders = [...store.orders];
    if (query.user) {
      orders = orders.filter(o => o.user === query.user);
    }
    if (query.status) {
      orders = orders.filter(o => o.status === query.status);
    }
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById: async (id) => {
    return store.orders.find(o => o._id === id) || null;
  },

  create: async (orderData) => {
    const newOrder = {
      _id: "ord_" + Math.floor(1000 + Math.random() * 9000),
      ...orderData,
      isPaid: true,
      paidAt: new Date().toISOString(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Deduct stock inventory for purchased products
    for (const item of newOrder.orderItems) {
      const prodId = typeof item.product === 'object' ? item.product._id : item.product;
      const prod = store.products.find(p => p._id === prodId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    store.orders.unshift(newOrder);
    return newOrder;
  },

  findByIdAndUpdateStatus: async (id, status) => {
    const order = store.orders.find(o => o._id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  countDocuments: async () => store.orders.length
};

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
