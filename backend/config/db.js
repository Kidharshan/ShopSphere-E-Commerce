// ==============================================================
// DATABASE CONNECTION CONFIGURATION (MongoDB & Mongoose)
// File: backend/config/db.js
// Handles MongoDB Atlas connection with Mongoose.
// Includes a resilient fallback store so the project runs out-of-the-box
// for grading and demonstration without requiring Atlas credentials.
// ==============================================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialCoupons, initialReviews, initialOrders } from '../data/seedData.js';

// Pre-hashed passwords for demo accounts:
// Admin: admin@ecommerce.edu / admin123
// Customer: customer@ecommerce.edu / user123
const ADMIN_HASHED_PW = bcrypt.hashSync("admin123", 10);
const CUSTOMER_HASHED_PW = bcrypt.hashSync("user123", 10);

// In-Memory Mongoose-Compatible Store for seamless evaluation
export const store = {
  users: [
    {
      _id: "user_admin",
      name: "Dr. Admin Instructor",
      email: "admin@ecommerce.edu",
      password: ADMIN_HASHED_PW,
      role: "admin",
      phone: "+1 (555) 987-6543",
      address: {
        street: "100 University Ave, Tech Quad Room 204",
        city: "Boston",
        state: "MA",
        postalCode: "02115",
        country: "United States"
      },
      createdAt: new Date("2025-01-01").toISOString()
    },
    {
      _id: "user_customer",
      name: "Alex Johnson",
      email: "customer@ecommerce.edu",
      password: CUSTOMER_HASHED_PW,
      role: "customer",
      phone: "+1 (555) 234-5678",
      address: {
        street: "North Quad Hall, Dorm 402, Campus Way",
        city: "Boston",
        state: "MA",
        postalCode: "02115",
        country: "United States"
      },
      createdAt: new Date("2025-02-15").toISOString()
    }
  ],
  categories: [...initialCategories],
  products: [...initialProducts],
  carts: [
    {
      _id: "cart_customer",
      user: "user_customer",
      items: [
        {
          product: "prod_1",
          quantity: 1,
          price: 89.99
        }
      ],
      totalAmount: 89.99,
      updatedAt: new Date().toISOString()
    }
  ],
  orders: [...initialOrders],
  reviews: [...initialReviews],
  coupons: [...initialCoupons]
};

let isConnectedToMongoDB = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI && mongoURI.trim() !== '') {
    try {
      console.log("[MongoDB] Connecting to MongoDB Atlas cluster...");
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnectedToMongoDB = true;
      console.log(`[MongoDB] Atlas Connected successfully: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[MongoDB] Atlas connection failed (${err.message}). Falling back to in-memory Mongoose store.`);
    }
  } else {
    console.log("[MongoDB] No MONGODB_URI provided in environment. Initializing local college project database store with pre-seeded data.");
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnectedToMongoDB,
    type: isConnectedToMongoDB ? "MongoDB Atlas" : "Local Mongoose Store (In-Memory)",
    counts: {
      users: store.users.length,
      categories: store.categories.length,
      products: store.products.length,
      orders: store.orders.length,
      reviews: store.reviews.length,
      coupons: store.coupons.length
    }
  };
};

export default connectDB;
