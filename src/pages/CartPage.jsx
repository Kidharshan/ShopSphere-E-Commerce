// ==============================================================
// PAGE: CartPage
// File: src/pages/CartPage.jsx
// Student Implementation: Shopping cart, item quantities, coupon discounts
// ==============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  X,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingPrice,
    finalTotal,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();

  // Controlled Coupon Code Form State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState(null);

  // Apply Coupon Submit
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);

    if (res.success) {
      setCouponMsg({ type: 'success', text: res.message });
      setCouponCodeInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  const handleQuickApply = async (code) => {
    setCouponCodeInput(code);
    setCouponLoading(true);
    setCouponMsg(null);
    const res = await applyCoupon(code);
    setCouponLoading(false);
    if (res.success) {
      setCouponMsg({ type: 'success', text: res.message });
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-10 bg-white rounded-3xl border border-gray-200 shadow-2xs space-y-5">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Currently Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Looks like you haven't added any products to your cart yet. Explore our campus tech & study supplies!
        </p>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-xs"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Shopping Cart ({cartItems.length} items)
        </h1>
        <p className="text-xs text-gray-500 mt-1">Review items, adjust quantities, and apply promo codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => {
                const prodId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
                return (
                  <div key={prodId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Product Image & Info */}
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div>
                        <Link to={`/product/${prodId}`} className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                          {item.name}
                        </Link>
                        <span className="text-xs text-gray-500 block mt-0.5">
                          Unit Price: ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity - 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-l-lg transition"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 99)}
                          className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-r-lg disabled:opacity-40 transition"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-sm font-bold text-gray-900 w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Delete Item */}
                      <button
                        onClick={() => removeFromCart(prodId)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <Link to="/products" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Coupon Code Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" /> Have a Promo / Coupon Code?
              </h3>
              {appliedCoupon && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Applied: {appliedCoupon.code}
                </span>
              )}
            </div>

            {/* Controlled Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code (e.g. STUDENT20)"
                className="flex-1 p-2.5 text-xs font-mono uppercase border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                disabled={couponLoading || !couponCodeInput.trim()}
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
              >
                {couponLoading ? 'Checking...' : 'Apply Code'}
              </button>
            </form>

            {/* Feedback message */}
            {couponMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                  couponMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <span>{couponMsg.text}</span>
                <button onClick={() => setCouponMsg(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Test Codes */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block mb-2">
                Click to try available test coupons:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickApply('WELCOME10')}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-200"
                >
                  WELCOME10 (10% off)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickApply('STUDENT20')}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-200"
                >
                  STUDENT20 (20% off)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickApply('FLAT15')}
                  className="px-2.5 py-1 text-[11px] font-mono font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md border border-gray-200"
                >
                  FLAT15 (15% off)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    Coupon Discount ({appliedCoupon?.code})
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-rose-600" title="Remove coupon">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Estimated Shipping
                  {subtotal >= 75 && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-semibold text-gray-900">
                  {shippingPrice === 0 ? '$0.00' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              {subtotal < 75 && (
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-600 shrink-0" />
                  Add ${(75 - subtotal).toFixed(2)} more to qualify for Free Shipping!
                </p>
              )}

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Price</span>
                <span className="text-xl font-black text-gray-900">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-gray-400 text-center space-y-1">
              <div>✓ Safe 256-bit SSL encrypted checkout</div>
              <div>✓ Instant order tracking and receipt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
