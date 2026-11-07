// ==============================================================
// FULL STACK ENTRY POINT: Express + Vite Integration
// File: server.ts
// Student Implementation: MERN Full Stack Application Server
// ==============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { getDBStatus } from './backend/config/db.js';

// Route Handlers
import authRoutes from './backend/routes/authRoutes.js';
import productRoutes from './backend/routes/productRoutes.js';
import categoryRoutes from './backend/routes/categoryRoutes.js';
import cartRoutes from './backend/routes/cartRoutes.js';
import orderRoutes from './backend/routes/orderRoutes.js';
import reviewRoutes from './backend/routes/reviewRoutes.js';
import couponRoutes from './backend/routes/couponRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import reportRoutes from './backend/routes/reportRoutes.js';
import { postmanCollectionData } from './backend/data/postmanCollection.js';
import { notFound, errorHandler } from './backend/middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize Database Connection (MongoDB Atlas or Fallback Mongoose Store)
connectDB();

// Express Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Database Health & Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'ShopSphere MERN E-Commerce App',
    version: '1.0.0',
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Postman Collection JSON Download / View Endpoint
app.get('/api/postman', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(postmanCollectionData);
});

// Vite Middleware for Development / Static file serving for Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Centralized Error Handling
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopSphere Server] Full Stack Server running on port ${PORT}`);
    console.log(`[ShopSphere Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
