// ==============================================================
// PAGE: OrderSuccessPage
// File: src/pages/OrderSuccessPage.jsx
// Student Implementation: Post-checkout confirmation, receipt & order summary
// ==============================================================

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, ClipboardList, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && id && token) {
      setLoading(true);
      fetch(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setError(data.message || 'Order could not be loaded');
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, order, token]);

  if (loading) {
    return <FeedbackBanner type="loading" message="Loading order confirmation..." />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-2xl border border-gray-200">
        <FeedbackBanner type="error" message={error || "Order details unavailable"} />
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 my-6">
      {/* Success Hero Header */}
      <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-emerald-200 shadow-2xs space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-9 h-9" />
        </div>

        <span className="inline-block text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment & Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
          Thank You, {order.userName}!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Your order has been recorded in the database. A confirmation has been logged for your campus dorm delivery.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="px-3.5 py-1.5 bg-gray-100 rounded-lg text-xs font-mono font-bold text-gray-800">
            Order ID: {order._id}
          </div>
          <div className="px-3.5 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold">
            Status: {order.status}
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-100 pb-3">
          Order Summary & Receipt
        </h2>

        {/* Purchased Items List */}
        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50 border border-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <span className="text-gray-500 text-[11px]">Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                </div>
              </div>
              <span className="font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing calculations */}
        <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount ({order.couponCode || 'COUPON'}):</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
            <span>Total Paid ({order.paymentMethod}):</span>
            <span className="text-base text-blue-600">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address details */}
        <div className="pt-4 border-t border-gray-100 text-xs">
          <span className="font-bold text-gray-800 block mb-1">Delivering To:</span>
          <p className="text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/orders"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
        >
          <ClipboardList className="w-4 h-4" /> Track in My Orders
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
