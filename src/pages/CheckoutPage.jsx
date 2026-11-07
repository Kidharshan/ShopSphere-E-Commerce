// ==============================================================
// PAGE: CheckoutPage
// File: src/pages/CheckoutPage.jsx
// Student Implementation: Controlled checkout form, validation, order submission
// ==============================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function CheckoutPage() {
  const { cartItems, subtotal, discountAmount, shippingPrice, finalTotal, appliedCoupon, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Controlled Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: user?.address?.street || 'Campus North Quad Dorm 402',
    city: user?.address?.city || 'Boston',
    postalCode: user?.address?.postalCode || '02115',
    country: user?.address?.country || 'United States',
    paymentMethod: 'Credit Card'
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Controlled input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Form validation before submit
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.address.trim()) errors.address = 'Street Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal / Zip Code is required';
    return errors;
  };

  // Form submission with event.preventDefault()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // 1. Client-Side Validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (cartItems.length === 0) {
      setApiError("Your cart is empty. Please add items to checkout.");
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: typeof item.product === 'object' ? item.product._id : (item.product || item.productId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim()
        },
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Clear local cart
      clearCart();

      // Redirect to Order Success receipt page
      navigate(`/orders/success/${data.order._id}`, { state: { order: data.order } });
    } catch (err) {
      setApiError(err.message || 'Error occurred while processing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-2xl border border-gray-200">
        <h2 className="text-base font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Please add products to checkout.</p>
        <Link to="/products" className="text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link to="/cart" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Checkout & Shipping Details
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete your delivery address and choose a payment method
        </p>
      </div>

      {apiError && <FeedbackBanner type="error" message={apiError} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Truck className="w-4 h-4 text-blue-600" />
              1. Delivery Shipping Address
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
                {formErrors.fullName && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.fullName}</span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Street Address & Dorm / Apartment <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 100 Campus Way, Hall B, Rm 304"
                  className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
                {formErrors.address && (
                  <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.address}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Boston"
                    className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      formErrors.city ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.city && (
                    <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Postal / Zip Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="02115"
                    className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      formErrors.postalCode ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.postalCode && (
                    <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.postalCode}</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              2. Payment Method
            </h2>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-blue-200 bg-blue-50/30">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={formData.paymentMethod === 'Credit Card'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">Credit / Debit Card (Simulated Payment)</span>
                    <span className="text-[11px] text-gray-500">Processed securely via mock payment gateway</span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </label>

              <label className="flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={formData.paymentMethod === 'PayPal'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">PayPal Student Wallet</span>
                    <span className="text-[11px] text-gray-500">Instant transfer from connected student account</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-700">PayPal</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Place Order */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
              Review Items ({cartItems.length})
            </h3>

            {/* Compact items list */}
            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-md shrink-0 bg-gray-50" />
                    <div className="truncate">
                      <span className="font-medium text-gray-800 block truncate">{item.name}</span>
                      <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-gray-900">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {submitting ? 'Placing Order...' : `Place Order ($${finalTotal.toFixed(2)})`}
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              By confirming, order is submitted and inventory counts are updated in database.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
