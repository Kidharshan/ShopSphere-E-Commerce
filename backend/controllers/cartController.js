// ==============================================================
// CONTROLLER: Cart
// File: backend/controllers/cartController.js
// Student Implementation: Cart state, item quantities, total calculation
// ==============================================================

import { CartModel } from '../models/Cart.js';
import { ProductModel } from '../models/Product.js';

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await CartModel.findOne({ user: userId });
    res.status(200).json({
      success: true,
      cart: cart || { items: [], totalAmount: 0 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update whole cart items
// @route   PUT /api/cart
// @access  Private
export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { items = [] } = req.body;

    const updated = await CartModel.updateCart(userId, items);
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add single item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required to add to cart'
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this product is currently out of stock.'
      });
    }

    const currentCart = await CartModel.findOne({ user: userId });
    let items = currentCart ? [...currentCart.items] : [];

    const existingIndex = items.findIndex(
      i => (typeof i.product === 'object' ? i.product._id : i.product) === productId
    );

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} items left in stock.`
        });
      }
      items[existingIndex].quantity = newQty;
    } else {
      if (Number(quantity) > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock}).`
        });
      }
      items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price
      });
    }

    const updated = await CartModel.updateCart(userId, items);

    res.status(200).json({
      success: true,
      message: `Added '${product.name}' to cart!`,
      cart: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
export const removeItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const currentCart = await CartModel.findOne({ user: userId });
    if (!currentCart) {
      return res.status(200).json({ success: true, cart: { items: [], totalAmount: 0 } });
    }

    const filtered = currentCart.items.filter(
      i => (typeof i.product === 'object' ? i.product._id : i.product) !== productId
    );

    const updated = await CartModel.updateCart(userId, filtered);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await CartModel.clearCart(userId);
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [], totalAmount: 0 }
    });
  } catch (error) {
    next(error);
  }
};
