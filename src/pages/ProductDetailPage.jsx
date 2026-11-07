// ==============================================================
// PAGE: ProductDetailPage
// File: src/pages/ProductDetailPage.jsx
// Student Implementation: Product specifications, stock checking, reviews, controlled review form
// ==============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Check,
  AlertTriangle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  MessageSquare,
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  // Controlled Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState(null);

  // Fetch product details & reviews
  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Product not found');
      }

      setProduct(data.product);
      setReviews(data.product.reviews || []);
    } catch (err) {
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Handle Add To Cart
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    const ok = await addToCart(product, quantity);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  // Handle Controlled Review Form Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewFeedback(null);

    // Client-side validation
    if (!user || !token) {
      setReviewFeedback({
        type: 'error',
        message: 'Please log in to submit a product review.'
      });
      return;
    }

    if (!reviewComment.trim()) {
      setReviewFeedback({
        type: 'error',
        message: 'Validation Error: Please write a comment before submitting.'
      });
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          rating: Number(reviewRating),
          comment: reviewComment.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviewFeedback({
        type: 'success',
        message: 'Review posted successfully! Thank you for your feedback.'
      });
      setReviewComment('');
      setReviewRating(5);

      // Refresh product data & review list
      loadProduct();
    } catch (err) {
      setReviewFeedback({ type: 'error', message: err.message });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <FeedbackBanner type="loading" message="Loading product information..." />;
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link to="/products" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalog
        </Link>
        <FeedbackBanner type="error" message={error || "Product not found."} />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
        </Link>
      </div>

      {/* Product Primary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-2xs">
        {/* Left: Product Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              Featured Pick
            </span>
          )}
        </div>

        {/* Right: Product Info & Purchase Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                {product.categoryName || 'General'}
              </span>
              <span className="text-xs text-gray-400 font-medium">Brand: {product.brand || 'ShopSphere'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {Number(product.rating || 5.0).toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-gray-400">({product.numReviews || 0} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="text-3xl font-black text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 ml-2">Tax included</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              {product.description}
            </p>
          </div>

          {/* Stock Status & Quantity Controls */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Stock indicator */}
            <div className="flex items-center text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" /> Out of Stock - Currently Unavailable
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-bold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" /> Low Stock Alert: Only {product.stock} items remaining!
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center">
                  <Check className="w-4 h-4 mr-1" /> In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Add Button */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Your Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart (${(product.price * quantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Value Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Genuine campus verified item</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-2xs space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Verified feedback from student shoppers</p>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
              No reviews yet for this product. Be the first to share your experience!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800">{rev.userName}</span>
                    <span className="text-[10px] text-gray-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Form (Controlled Form) */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Write a Product Review</h3>

          {reviewFeedback && (
            <FeedbackBanner
              type={reviewFeedback.type}
              message={reviewFeedback.message}
            />
          )}

          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Overall Rating (1 to 5 Stars)
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="w-48 p-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Average</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Review Comments
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience with this item..."
                  rows={3}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                {reviewSubmitting ? 'Submitting Review...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-center justify-between">
              <span>You must be logged in to leave a review.</span>
              <Link
                to="/login"
                className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Log In to Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
