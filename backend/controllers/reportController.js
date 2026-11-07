// ==============================================================
// CONTROLLER: Reports & Analytics Dashboard
// File: backend/controllers/reportController.js
// Student Implementation: Aggregates revenue, order statuses, low-stock warnings, category sales
// ==============================================================

import { store } from '../config/db.js';

// @desc    Get Admin summary dashboard statistics and reports
// @route   GET /api/reports/dashboard
// @access  Private/Admin
export const getDashboardSummary = async (req, res, next) => {
  try {
    const orders = store.orders || [];
    const products = store.products || [];
    const users = store.users || [];
    const categories = store.categories || [];

    // 1. Total Revenue calculation
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // 2. Total counts
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = users.filter(u => u.role === 'customer').length;

    // 3. Low-stock inventory alert list (< 5 units)
    const lowStockAlerts = products.filter(p => p.stock <= 5).map(p => ({
      _id: p._id,
      name: p.name,
      stock: p.stock,
      price: p.price,
      categoryName: p.categoryName
    }));

    // 4. Order status distribution
    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      } else {
        statusCounts[o.status] = 1;
      }
    });

    // 5. Category breakdown
    const categorySales = {};
    categories.forEach(c => {
      categorySales[c.name] = { name: c.name, count: 0, revenue: 0 };
    });

    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const prod = products.find(p => p._id === item.product);
        const catName = prod ? prod.categoryName : 'General';
        if (!categorySales[catName]) {
          categorySales[catName] = { name: catName, count: 0, revenue: 0 };
        }
        categorySales[catName].count += item.quantity;
        categorySales[catName].revenue += item.price * item.quantity;
      });
    });

    // 6. Recent Orders
    const recentOrders = orders.slice(0, 5).map(o => ({
      _id: o._id,
      userName: o.userName,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      itemsCount: (o.orderItems || []).length
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          totalProducts,
          totalCustomers,
          lowStockCount: lowStockAlerts.length
        },
        lowStockAlerts,
        statusDistribution: statusCounts,
        categoryBreakdown: Object.values(categorySales),
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
