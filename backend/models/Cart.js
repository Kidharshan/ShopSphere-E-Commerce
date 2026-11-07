// ==============================================================
// MONGOOSE MODEL: Cart
// File: backend/models/Cart.js
// Attributes: user ref, items array [product ref, quantity, price], totalAmount
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

export const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const CartModel = {
  findOne: async (query = {}) => {
    let cart = store.carts.find(c => c.user === query.user);
    if (!cart && query.user) {
      // Auto-create empty cart for user
      cart = {
        _id: "cart_" + query.user,
        user: query.user,
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString()
      };
      store.carts.push(cart);
    }

    if (cart) {
      // Hydrate with latest product info
      const hydratedItems = (cart.items || []).map(item => {
        const prodId = typeof item.product === 'object' ? item.product._id : item.product;
        const prod = store.products.find(p => p._id === prodId);
        return {
          product: prodId,
          productId: prodId,
          name: prod ? prod.name : item.name || 'Product',
          price: prod ? prod.price : item.price || 0,
          image: prod ? prod.imageUrl : item.image || '',
          stock: prod ? prod.stock : 10,
          quantity: item.quantity
        };
      });

      const totalAmount = hydratedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...cart,
        items: hydratedItems,
        totalAmount: Number(totalAmount.toFixed(2))
      };
    }
    return null;
  },

  updateCart: async (userId, items) => {
    let cartIndex = store.carts.findIndex(c => c.user === userId);
    if (cartIndex === -1) {
      const newCart = {
        _id: "cart_" + userId,
        user: userId,
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString()
      };
      store.carts.push(newCart);
      cartIndex = store.carts.length - 1;
    }

    // Recalculate prices
    const cleanedItems = items.map(item => {
      const prodId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
      const prod = store.products.find(p => p._id === prodId);
      const price = prod ? prod.price : (item.price || 0);
      return {
        product: prodId,
        quantity: Math.max(1, item.quantity),
        price: price
      };
    });

    const totalAmount = cleanedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    store.carts[cartIndex].items = cleanedItems;
    store.carts[cartIndex].totalAmount = Number(totalAmount.toFixed(2));
    store.carts[cartIndex].updatedAt = new Date().toISOString();

    return CartModel.findOne({ user: userId });
  },

  clearCart: async (userId) => {
    const cart = store.carts.find(c => c.user === userId);
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      cart.updatedAt = new Date().toISOString();
    }
    return true;
  }
};

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
