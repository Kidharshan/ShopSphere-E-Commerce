// ==============================================================
// PAGE: HomePage
// File: src/pages/HomePage.jsx
// Student Implementation: Hero banner, categories, featured products
// ==============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Sparkles, Tag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function HomePage({ onOpenDocs }) {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?isFeatured=true&limit=8')
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.success) setCategories(catData.categories || []);
        if (prodData.success) setFeaturedProducts(prodData.products || []);
      } catch (err) {
        setError("Failed to load storefront data from API. Please verify server status.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-14 shadow-xl border border-blue-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MERN Stack E-Commerce Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Curated Tech & Essentials for Modern Students.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Engineered with React 19, Express REST APIs, and MongoDB Mongoose models. Experience seamless catalog browsing, coupon checkout, and real-time inventory management.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onOpenDocs}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Demo Accounts & Rubric
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Feature Value Props */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Campus Free Shipping</h3>
            <p className="text-xs text-gray-500 mt-1">Automatic free delivery on student orders over $75.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Active Coupon Codes</h3>
            <p className="text-xs text-gray-500 mt-1">Use <code>STUDENT20</code> or <code>WELCOME10</code> at checkout.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">JWT & Role Security</h3>
            <p className="text-xs text-gray-500 mt-1">Encrypted bcrypt password storage & RBAC protected routes.</p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Explore Categories</h2>
            <p className="text-xs text-gray-500 mt-0.5">Filter products by academic and everyday campus needs</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat._id)}`}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 aspect-4/3 flex flex-col justify-end p-5 shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="font-bold text-base group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Featured Highlights</h2>
            <p className="text-xs text-gray-500 mt-0.5">Popular gear with highest student reviews and ratings</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading && <FeedbackBanner type="loading" message="Loading featured products..." />}
        {error && <FeedbackBanner type="error" message={error} />}

        {!loading && !error && featuredProducts.length === 0 && (
          <FeedbackBanner type="empty" title="No featured products right now" message="Check back later." />
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Student Coupon Promotion Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
            Limited Time College Special
          </span>
          <h3 className="text-2xl font-extrabold">Get 20% Off Your Study & Tech Gear</h3>
          <p className="text-xs text-orange-100 max-w-lg">
            Use promo code <span className="font-mono font-bold bg-white text-orange-600 px-2 py-0.5 rounded">STUDENT20</span> at checkout on orders over $50.
          </p>
        </div>
        <Link
          to="/products"
          className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs rounded-xl transition shadow-xs whitespace-nowrap"
        >
          Claim Discount Now
        </Link>
      </section>
    </div>
  );
}
