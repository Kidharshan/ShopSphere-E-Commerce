// ==============================================================
// REACT CONTEXT: CartContext (Shopping Cart & Coupons)
// File: src/context/CartContext.jsx
// Student Implementation: Cart items, quantity limits, coupon discounts
// ==============================================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext.jsx';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Load cart from backend when user logs in, or from localStorage for guest
  useEffect(() => {
    const fetchUserCart = async () => {
      if (token && user) {
        try {
          setLoading(true);
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.cart) {
            setCartItems(data.cart.items || []);
          }
        } catch (err) {
          console.error("Cart fetch error", err);
        } finally {
          setLoading(false);
        }
      } else {
        const local = localStorage.getItem('guest_cart');
        if (local) {
          try {
            setCartItems(JSON.parse(local));
          } catch (e) {
            setCartItems([]);
          }
        }
      }
    };

    fetchUserCart();
  }, [token, user]);

  // Sync to local storage
  useEffect(() => {
    if (!token) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // Sync backend cart helper
  const syncWithServer = async (newItems) => {
    if (token) {
      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ items: newItems })
        });
      } catch (err) {
        console.error("Failed to sync cart to server", err);
      }
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    let updated;

    const existingIndex = cartItems.findIndex(item => {
      const pId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
      return pId === product._id;
    });

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const newQty = currentQty + qty;

      if (newQty > product.stock) {
        setFeedback({ type: 'error', message: `Only ${product.stock} items available in stock.` });
        return false;
      }

      updated = [...cartItems];
      updated[existingIndex].quantity = newQty;
    } else {
      if (qty > product.stock) {
        setFeedback({ type: 'error', message: `Only ${product.stock} items available in stock.` });
        return false;
      }

      updated = [
        ...cartItems,
        {
          product: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          stock: product.stock,
          quantity: qty
        }
      ];
    }

    setCartItems(updated);
    await syncWithServer(updated);
    setFeedback({ type: 'success', message: `Added '${product.name}' to cart!` });
    setTimeout(() => setFeedback(null), 3000);
    return true;
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cartItems.map(item => {
      const pId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
      if (pId === productId) {
        const boundedQty = Math.min(qty, item.stock || 99);
        return { ...item, quantity: boundedQty };
      }
      return item;
    });

    setCartItems(updated);
    await syncWithServer(updated);
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const updated = cartItems.filter(item => {
      const pId = typeof item.product === 'object' ? item.product._id : (item.product || item.productId);
      return pId !== productId;
    });

    setCartItems(updated);
    await syncWithServer(updated);
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('guest_cart');

    if (token) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error("Clear cart error", e);
      }
    }
  };

  // Calculations
  const subtotal = Number(
    cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)
  );

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Apply Coupon Code
  const applyCoupon = async (code) => {
    if (!code || code.trim() === '') {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), amount: subtotal })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Invalid coupon' };
      }

      setAppliedCoupon(data.coupon);
      return { success: true, message: data.message, coupon: data.coupon };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Dynamic discount calculation based on coupon
  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= (appliedCoupon.minPurchaseAmount || 0)) {
      const raw = (subtotal * appliedCoupon.discountPercentage) / 100;
      discountAmount = Number(Math.min(raw, appliedCoupon.maxDiscount || 100).toFixed(2));
    }
  }

  // Shipping logic (free above $75)
  const shippingPrice = subtotal === 0 ? 0 : (subtotal >= 75 ? 0.00 : 5.00);
  const finalTotal = Number(Math.max(0, subtotal - discountAmount + shippingPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        discountAmount,
        shippingPrice,
        finalTotal,
        appliedCoupon,
        loading,
        feedback,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
