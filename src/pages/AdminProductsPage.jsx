// ==============================================================
// PAGE: AdminProductsPage (Product & Inventory CRUD)
// File: src/pages/AdminProductsPage.jsx
// Student Implementation: Create, Read, Update, Delete products with stock control
// ==============================================================

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Controlled Product Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: 'General',
    stock: '',
    imageUrl: '',
    isFeatured: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Filter query
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products & categories
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories')
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) setProducts(prodData.products || []);
      if (catData.success) {
        setCategories(catData.categories || []);
        if (catData.categories?.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: catData.categories[0]._id }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      brand: 'General',
      stock: '10',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      isFeatured: false
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      category: prod.category || categories[0]?._id || '',
      brand: prod.brand || 'General',
      stock: prod.stock.toString(),
      imageUrl: prod.imageUrl,
      isFeatured: Boolean(prod.isFeatured)
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Controlled change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate Form
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Price must be greater than 0';
    if (!formData.stock || Number(formData.stock) < 0) errs.stock = 'Stock must be 0 or more';
    if (!formData.category) errs.category = 'Category is required';
    return errs;
  };

  // Form Submit with event.preventDefault()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setFormSubmitting(true);
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      setActionFeedback({
        type: 'success',
        message: editingProduct ? 'Product updated successfully!' : 'New product created successfully!'
      });
      setTimeout(() => setActionFeedback(null), 3000);

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }

      setActionFeedback({ type: 'success', message: `Deleted '${name}'` });
      setTimeout(() => setActionFeedback(null), 3000);
      fetchData();
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Products & Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, update stock, modify prices, and organize campus store catalog
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {actionFeedback && (
        <FeedbackBanner
          type={actionFeedback.type}
          message={actionFeedback.message}
        />
      )}

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter products by name or category..."
          className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <FeedbackBanner type="loading" message="Loading product records..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchData} />}

      {/* Products Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Inventory Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= 5;
                    const isOut = p.stock <= 0;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/60 transition">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-50 border border-gray-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-gray-900 block line-clamp-1">{p.name}</span>
                              <span className="text-[11px] text-gray-400 font-mono">ID: {p._id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                            {p.categoryName || 'General'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          ${Number(p.price).toFixed(2)}
                        </td>
                        <td className="p-4">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                              0 (Out of stock)
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> {p.stock} units left
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              {p.stock} units
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          ★ {Number(p.rating || 5.0).toFixed(1)} ({p.numReviews || 0})
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id, p.name)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product Record' : 'Create New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.submit && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ergonomic Bluetooth Mouse"
                  className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.name}</span>}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Product specs, features, battery life, materials..."
                  className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
                {formErrors.description && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.description}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      formErrors.price ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.price && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.price}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Inventory Stock <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    className={`w-full p-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                      formErrors.stock ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.stock && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.stock}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Logitech, Apple, etc."
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <span className="font-semibold text-gray-700">
                    Feature on Storefront Homepage
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  {formSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
