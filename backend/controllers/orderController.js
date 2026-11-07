// ==============================================================
// CONTROLLER: Order
// File: backend/controllers/orderController.js
// Student Implementation: Checkout, Coupon discount, Order tracking, Admin updates
// ==============================================================

import { OrderModel } from '../models/Order.js';
import { CartModel } from '../models/Cart.js';
import { CouponModel } from '../models/Coupon.js';
import { ProductModel } from '../models/Product.js';

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    // 1. Validation in Express API
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: No order items found in checkout.'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Complete shipping address is required.'
      });
    }

    // 2. Calculate items price & check inventory stock
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      const prodId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
      const product = await ProductModel.findById(prodId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product '${item.name || prodId}' not found.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}.`
        });
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedItems.push({
        product: prodId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.imageUrl
      });
    }

    itemsPrice = Number(itemsPrice.toFixed(2));

    // 3. Coupon discount calculation
    let discountAmount = 0;
    if (couponCode && couponCode.trim() !== '') {
      const coupon = await CouponModel.findByCode(couponCode.trim());
      if (coupon && coupon.isActive) {
        if (itemsPrice >= coupon.minPurchaseAmount) {
          const rawDiscount = (itemsPrice * coupon.discountPercentage) / 100;
          discountAmount = Math.min(rawDiscount, coupon.maxDiscount);
          discountAmount = Number(discountAmount.toFixed(2));
        }
      }
    }

    // 4. Shipping Calculation (Free over $75, otherwise $5.00)
    const shippingPrice = itemsPrice >= 75 ? 0.00 : 5.00;
    const totalPrice = Number((itemsPrice - discountAmount + shippingPrice).toFixed(2));

    // 5. Create Order
    const order = await OrderModel.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice,
      couponCode: couponCode ? couponCode.toUpperCase() : null
    });

    // 6. Clear user cart after successful order creation
    await CartModel.clearCart(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for your purchase.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure only the owner or an admin can view this order
    if (req.user.role !== 'admin' && order.user !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await OrderModel.findByIdAndUpdateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found to update' });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully!`,
      order: updated
    });
  } catch (error) {
    next(error);
  }
};
