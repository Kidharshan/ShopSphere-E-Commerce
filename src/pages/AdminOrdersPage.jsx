// ==============================================================
// PAGE: AdminOrdersPage (Order Management & Status Pipeline)
// File: src/pages/AdminOrdersPage.jsx
// Student Implementation: View customer orders, update tracking status
// ==============================================================

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // View order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load orders');
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

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update order status');
      }

      setFeedback({
        type: 'success',
        message: `Order #${orderId} status updated to '${newStatus}'!`
      });
      setTimeout(() => setFeedback(null), 3000);

      // Update local state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Fulfillment & Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review placed student orders, inspect delivery addresses, and advance shipping status
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {feedback && <FeedbackBanner type={feedback.type} message={feedback.message} />}
      {loading && <FeedbackBanner type="loading" message="Loading customer orders..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchOrders} />}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status & Update</th>
                  <th className="p-4 text-right">Receipt Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No orders placed in system yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/60 transition">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900 block">{ord._id}</span>
                        <span className="text-[10px] text-gray-400">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-800 block">{ord.userName}</span>
                        <span className="text-[11px] text-gray-400">{ord.userEmail}</span>
                      </td>
                      <td className="p-4 text-gray-700">
                        {ord.orderItems?.length || 0} items
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        ${Number(ord.totalPrice).toFixed(2)}
                        {ord.couponCode && (
                          <span className="block text-[10px] font-mono text-emerald-600">
                            Coupon: {ord.couponCode}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`p-1.5 rounded-lg text-xs font-bold border ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : ord.status === 'Processing'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              : ord.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Order Details: {selectedOrder._id}
                </h3>
                <span className="text-xs text-gray-500">
                  Customer: {selectedOrder.userName} ({selectedOrder.userEmail})
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Shipping Address */}
            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <span className="font-bold text-gray-800 block">Shipping Address:</span>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress?.fullName}<br />
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
              </p>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100 text-xs max-h-48 overflow-y-auto">
              {selectedOrder.orderItems?.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-gray-900">
              <span>Total Paid ({selectedOrder.paymentMethod}):</span>
              <span className="text-blue-600">${Number(selectedOrder.totalPrice).toFixed(2)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-900 text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
