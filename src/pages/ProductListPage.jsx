// ==============================================================
// PAGE: ProductListPage (Product Catalog)
// File: src/pages/ProductListPage.jsx
// Student Implementation: Controlled search, category filters, price bounds, sorting, pagination
// ==============================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled Filter States
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories || []);
      })
      .catch(e => console.error("Category fetch error", e));
  }, []);

  // Fetch products with active query params
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchInput.trim()) params.append('search', searchInput.trim());
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (inStockOnly) params.append('inStock', 'true');
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page.toString());
      params.append('limit', '8');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error fetching products.');
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.message || 'Network error fetching product catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, inStockOnly, sortBy, page]);

  // Controlled form search submit with event.preventDefault()
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
    fetch('/api/products?limit=8&page=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
        }
      });
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Store Product Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Explore devices, textbooks, campus gear, and study supplies with instant filtering
          </p>
        </div>

        {/* Search Input Form (Controlled Component) */}
        <form onSubmit={handleSearchSubmit} className="flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Filter & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Options
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full p-2.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ($)"
                min="0"
                className="p-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ($)"
                min="0"
                className="p-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => { setPage(1); fetchProducts(); }}
              className="mt-2 w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
            >
              Apply Price Filter
            </button>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="font-medium">In-Stock Items Only</span>
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full p-2.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {/* Feedback states */}
          {loading && <FeedbackBanner type="loading" message="Querying product catalog from MongoDB..." />}
          {error && <FeedbackBanner type="error" message={error} onRetry={fetchProducts} />}

          {!loading && !error && products.length === 0 && (
            <FeedbackBanner
              type="empty"
              title="No products match your criteria"
              message="Try adjusting your search terms, removing price bounds, or switching categories."
              onRetry={handleResetFilters}
            />
          )}

          {!loading && !error && products.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                pages={pages}
                total={total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
