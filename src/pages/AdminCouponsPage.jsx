// ==============================================================
// PAGE: AdminCouponsPage (Coupon & Promo Code CRUD)
// File: src/pages/AdminCouponsPage.jsx
// Student Implementation: Manage discount vouchers, bounds, and expiration
// ==============================================================

import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Trash2, X, Check, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '15',
    minPurchaseAmount: '30',
    maxDiscount: '25',
    expiryDate: '2026-12-31',
    description: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCoupons();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenCreate = () => {
    setFormData({
      code: '',
      discountPercentage: '15',
      minPurchaseAmount: '30',
      maxDiscount: '25',
      expiryDate: '2026-12-31',
      description: 'Special campus discount voucher',
      isActive: true
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setFormErrors({ code: 'Coupon code is required' });
      return;
    }
    if (Number(formData.discountPercentage) <= 0 || Number(formData.discountPercentage) > 100) {
      setFormErrors({ discountPercentage: 'Discount percentage must be between 1 and 100' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          discountPercentage: Number(formData.discountPercentage),
          minPurchaseAmount: Number(formData.minPurchaseAmount || 0),
          maxDiscount: Number(formData.maxDiscount || 100)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create coupon');
      }

      setFeedback({ type: 'success', message: `Coupon '${data.coupon.code}' created!` });
      setTimeout(() => setFeedback(null), 3000);
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => prev.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c));
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Delete coupon
  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon '${code}'?`)) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }
      setFeedback({ type: 'success', message: `Deleted coupon '${code}'` });
      setTimeout(() => setFeedback(null), 3000);
      fetchCoupons();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Coupons & Promo Codes
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure discount percentages, minimum cart thresholds, and activation status
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Coupon
        </button>
      </div>

      {feedback && <FeedbackBanner type={feedback.type} message={feedback.message} />}
      {loading && <FeedbackBanner type="loading" message="Loading coupons..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchCoupons} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 ${
                coupon.isActive ? 'border-emerald-200' : 'border-gray-200 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-base font-black px-3 py-1 bg-gray-100 rounded-lg text-gray-900 tracking-wider">
                    {coupon.code}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="text-2xl font-black text-blue-600 mt-2">
                  {coupon.discountPercentage}% OFF
                </div>

                <p className="text-xs text-gray-500 mt-1">{coupon.description || 'Campus discount voucher'}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-600 space-y-1 font-mono">
                  <div>Min Order: ${coupon.minPurchaseAmount.toFixed(2)}</div>
                  <div>Max Discount: ${coupon.maxDiscount.toFixed(2)}</div>
                  <div>Valid Until: {coupon.expiryDate}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
                >
                  {coupon.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-600" /> Enabled
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" /> Disabled
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(coupon._id, coupon.code)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-base font-bold text-gray-900">Create New Coupon</h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {formErrors.submit && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Coupon Code (Uppercase) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. EXAMDEAL25"
                  className="w-full p-2.5 font-mono uppercase border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.code && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.code}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Discount (%) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    placeholder="20"
                    min="1"
                    max="100"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Min Spend ($)
                  </label>
                  <input
                    type="number"
                    name="minPurchaseAmount"
                    value={formData.minPurchaseAmount}
                    onChange={handleChange}
                    placeholder="40"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Max Cap ($)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="20% discount on orders over $50"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <span className="font-semibold text-gray-700">Activate Coupon Immediately</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
