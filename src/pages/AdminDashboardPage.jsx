// ==============================================================
// PAGE: AdminDashboardPage (Analytics & Summary Reports)
// File: src/pages/AdminDashboardPage.jsx
// Student Implementation: Revenue, orders, customers, low-stock inventory alerts
// ==============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/reports/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch dashboard data');
      }
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  if (loading) {
    return <FeedbackBanner type="loading" message="Aggregating store records and analytics from database..." />;
  }

  if (error || !data) {
    return <FeedbackBanner type="error" message={error || "Failed to load reports"} onRetry={fetchDashboard} />;
  }

  const { summary, lowStockAlerts, statusDistribution, categoryBreakdown, recentOrders } = data;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Administrative Control
            </span>
            <span className="text-xs text-gray-400">• Real-Time MongoDB Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Store Performance & Summary Dashboard
          </h1>
        </div>

        <button
          onClick={fetchDashboard}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Total Revenue</span>
            <span className="text-2xl font-black text-gray-900">
              ${summary.totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Total Orders</span>
            <span className="text-2xl font-black text-gray-900">{summary.totalOrders}</span>
          </div>
        </div>

        {/* Card 3: Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Registered Customers</span>
            <span className="text-2xl font-black text-gray-900">{summary.totalCustomers}</span>
          </div>
        </div>

        {/* Card 4: Products & Low Stock */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Catalog Products</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-gray-900">{summary.totalProducts}</span>
              {summary.lowStockCount > 0 && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {summary.lowStockCount} Low
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Low-Stock Inventory Warning & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low-Stock Inventory Alerts (Rubric Requirement) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Low-Stock Inventory Alerts (≤ 5 units remaining)
              </h2>
            </div>
            <Link to="/admin/products" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Manage Inventory →
            </Link>
          </div>

          {lowStockAlerts.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
              All products have sufficient stock levels! No immediate replenishment required.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockAlerts.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <span className="text-gray-400 text-[11px]">{item.categoryName} • ${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                      {item.stock} in stock
                    </span>
                    <Link
                      to="/admin/products"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Status Breakdown
          </h2>

          <div className="space-y-3 text-xs">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const colors = {
                Pending: 'text-amber-700 bg-amber-50 border-amber-200',
                Processing: 'text-indigo-700 bg-indigo-50 border-indigo-200',
                Shipped: 'text-blue-700 bg-blue-50 border-blue-200',
                Delivered: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                Cancelled: 'text-rose-700 bg-rose-50 border-rose-200'
              };
              return (
                <div key={status} className={`p-3 rounded-xl border flex items-center justify-between ${colors[status] || 'bg-gray-50 text-gray-700'}`}>
                  <span className="font-bold">{status}</span>
                  <span className="font-extrabold text-sm">{count} orders</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/admin/orders"
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              Update Order Statuses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Sales by Category & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
            Sales Revenue by Category
          </h2>

          <div className="divide-y divide-gray-100 text-xs">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">{cat.name}</h4>
                  <span className="text-gray-400 text-[11px]">{cat.count} total items ordered</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  ${cat.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs text-blue-600 font-semibold">
              View All Orders →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-gray-900 block">{ord._id}</span>
                  <span className="text-gray-500 text-[11px]">
                    Customer: {ord.userName} • {ord.itemsCount} items
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">${ord.totalPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
