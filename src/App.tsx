// ==============================================================
// APPLICATION ROOT & ROUTING: App.tsx
// File: src/App.tsx
// Student Implementation: React 19 + React Router DOM + Context API
// ==============================================================

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ERDiagramModal from './components/ERDiagramModal.jsx';
import PostmanModal from './components/PostmanModal.jsx';
import ProjectDocsModal from './components/ProjectDocsModal.jsx';

// Customer & Public Storefront Pages
import HomePage from './pages/HomePage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Admin Portal Pages
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminCouponsPage from './pages/AdminCouponsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';

export default function App() {
  // Modal visibility states for assessment deliverables
  const [showERDiagram, setShowERDiagram] = useState(false);
  const [showPostman, setShowPostman] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50/50 text-gray-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
            {/* Global Navigation Bar */}
            <Navbar
              onOpenER={() => setShowERDiagram(true)}
              onOpenPostman={() => setShowPostman(true)}
              onOpenDocs={() => setShowDocs(true)}
            />

            {/* Main Application Content Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<HomePage onOpenDocs={() => setShowDocs(true)} />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/success/:id"
                  element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Administrative Routes (RBAC: Admin Only) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminCategoriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminCouponsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Page Footer */}
            <Footer
              onOpenER={() => setShowERDiagram(true)}
              onOpenPostman={() => setShowPostman(true)}
              onOpenDocs={() => setShowDocs(true)}
            />

            {/* Assessment Modals */}
            <ERDiagramModal
              isOpen={showERDiagram}
              onClose={() => setShowERDiagram(false)}
            />
            <PostmanModal
              isOpen={showPostman}
              onClose={() => setShowPostman(false)}
            />
            <ProjectDocsModal
              isOpen={showDocs}
              onClose={() => setShowDocs(false)}
            />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
