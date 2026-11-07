// ==============================================================
// REUSABLE COMPONENT: Navbar
// File: src/components/Navbar.jsx
// Student Implementation: Role-based navigation, Cart count, Quick Modals
// ==============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  TicketPercent,
  Users,
  Database,
  FileCode2,
  HelpCircle,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar({ onOpenER, onOpenPostman, onOpenDocs }) {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Banner with College Tag & Quick Evaluation Modals */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-500/30 px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider border border-blue-400/30">
            2nd Year MERN Project
          </span>
          <span className="hidden sm:inline text-blue-100 text-[11px]">
            React + Express + MongoDB Atlas + JWT Auth
          </span>
        </div>

        {/* Quick Evaluation Triggers */}
        <div className="flex items-center space-x-2 text-[11px]">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition font-medium"
            title="View README & Demo Logins"
          >
            <HelpCircle className="w-3 h-3 text-amber-300" />
            <span>Demo Logins & Docs</span>
          </button>
          <button
            onClick={onOpenER}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition font-medium"
            title="Inspect 7 Mongoose Schemas & Relations"
          >
            <Database className="w-3 h-3 text-emerald-300" />
            <span className="hidden md:inline">Mongoose</span> ER Diagram
          </button>
          <button
            onClick={onOpenPostman}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition font-medium"
            title="View and Download Postman Collection"
          >
            <FileCode2 className="w-3 h-3 text-orange-300" />
            <span>Postman Collection</span>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-gray-900 block leading-tight">
                  Shop<span className="text-blue-600">Sphere</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium block">
                  Campus Store & Tech Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-gray-700">
              <Link
                to="/products"
                className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
              >
                Browse Catalog
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition flex items-center gap-1.5"
                >
                  <ClipboardList className="w-4 h-4 text-gray-400" />
                  My Orders
                </Link>
              )}

              {/* Admin Menu Links */}
              {isAdmin && (
                <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mr-1">
                    Admin
                  </span>
                  <Link
                    to="/admin/dashboard"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/products"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    Products
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    Categories
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                    Orders
                  </Link>
                  <Link
                    to="/admin/coupons"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <TicketPercent className="w-3.5 h-3.5 text-blue-600" />
                    Coupons
                  </Link>
                  <Link
                    to="/admin/users"
                    className="px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Users
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Right Action Items: Cart & Auth */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition flex items-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <span className="block text-xs font-bold text-gray-900 leading-tight">
                    {user.name}
                  </span>
                  <span className={`inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition shadow-2xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm font-medium animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100"
          >
            Browse Catalog
          </Link>
          {user && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100"
            >
              My Orders
            </Link>
          )}

          {isAdmin && (
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <span className="text-xs font-bold text-blue-600 px-3 uppercase tracking-wider">
                Admin Panel
              </span>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Dashboard Analytics
              </Link>
              <Link
                to="/admin/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Manage Categories
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Manage Orders
              </Link>
              <Link
                to="/admin/coupons"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Manage Coupons
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
