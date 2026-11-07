// ==============================================================
// CONTROLLER: Review
// File: backend/controllers/reviewController.js
// Student Implementation: Ratings, comments, customer reviews
// ==============================================================

import { ReviewModel } from '../models/Review.js';
import { ProductModel } from '../models/Product.js';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({ product: req.params.productId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review for product
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validation
    if (!productId || rating === undefined || !comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Product ID, rating, and comment are required.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Rating must be an integer between 1 and 5.'
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await ReviewModel.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: numRating,
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const deleted = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
