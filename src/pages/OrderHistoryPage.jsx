// ==============================================================
// PAGE: OrderHistoryPage (Order Tracking)
// File: src/pages/OrderHistoryPage.jsx
// Student Implementation: Customer order tracking, history & status pipeline
// ==============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function OrderHistoryPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch order history');
      }
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Error loading orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          My Order History & Tracking
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor your campus orders, delivery progress, and past purchase receipts
        </p>
      </div>

      {loading && <FeedbackBanner type="loading" message="Loading your orders from database..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchOrders} />}

      {!loading && !error && orders.length === 0 && (
        <FeedbackBanner
          type="empty"
          title="No orders placed yet"
          message="You haven't placed any purchases yet. Your completed orders will appear here."
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-gray-900">
                    Order #{order._id}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Status Progress Pipeline */}
              <div className="px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between max-w-xl mx-auto text-[11px] text-gray-500 font-medium">
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                    const currentIdx = statusOrder.indexOf(order.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = order.status === step;

                    return (
                      <div key={step} className="flex flex-col items-center flex-1 relative">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-xs ring-4 ring-blue-100'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] ${isCurrent ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-5 divide-y divide-gray-100">
                {order.orderItems.map((item, iIdx) => (
                  <div key={iIdx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <span className="text-gray-500 text-[11px]">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer info: Destination & Promo */}
              <div className="px-5 py-3 bg-gray-50 text-[11px] text-gray-500 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
                <div>
                  <strong>Delivering to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}
                </div>
                {order.couponCode && (
                  <div className="text-emerald-700 font-medium">
                    Applied Coupon: <span className="font-mono font-bold">{order.couponCode}</span> (-${Number(order.discountAmount || 0).toFixed(2)})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
