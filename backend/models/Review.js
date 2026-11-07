// ==============================================================
// MONGOOSE MODEL: Review
// File: backend/models/Review.js
// Customer feedback, ratings, recalculates product average rating
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    userName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating must be between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment review']
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ product: 1, user: 1 });

export const ReviewModel = {
  find: async (query = {}) => {
    let reviews = [...store.reviews];
    if (query.product) {
      reviews = reviews.filter(r => r.product === query.product);
    }
    if (query.user) {
      reviews = reviews.filter(r => r.user === query.user);
    }
    return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create: async (data) => {
    const newReview = {
      _id: "rev_" + Date.now(),
      product: data.product,
      user: data.user,
      userName: data.userName,
      rating: Number(data.rating),
      comment: data.comment,
      createdAt: new Date().toISOString()
    };
    store.reviews.unshift(newReview);

    // Recalculate product rating & numReviews
    const prodReviews = store.reviews.filter(r => r.product === data.product);
    const prod = store.products.find(p => p._id === data.product);
    if (prod && prodReviews.length > 0) {
      const avg = prodReviews.reduce((acc, item) => acc + item.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.numReviews = prodReviews.length;
    }

    return newReview;
  },

  findByIdAndDelete: async (id) => {
    const idx = store.reviews.findIndex(r => r._id === id);
    if (idx === -1) return null;
    const removed = store.reviews.splice(idx, 1)[0];

    // Update product rating
    const prodReviews = store.reviews.filter(r => r.product === removed.product);
    const prod = store.products.find(p => p._id === removed.product);
    if (prod) {
      if (prodReviews.length > 0) {
        const avg = prodReviews.reduce((acc, item) => acc + item.rating, 0) / prodReviews.length;
        prod.rating = Number(avg.toFixed(1));
        prod.numReviews = prodReviews.length;
      } else {
        prod.numReviews = 0;
      }
    }

    return removed;
  }
};

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
