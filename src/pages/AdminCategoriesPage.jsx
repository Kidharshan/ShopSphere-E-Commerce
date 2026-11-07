// ==============================================================
// PAGE: AdminCategoriesPage (Category CRUD)
// File: src/pages/AdminCategoriesPage.jsx
// Student Implementation: Manage department categories & taxonomy
// ==============================================================

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Controlled Form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      setError(err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Category name is required' });
      return;
    }

    try {
      setSubmitting(true);
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      setFeedback({
        type: 'success',
        message: editingCategory ? 'Category updated!' : 'Category created successfully!'
      });
      setTimeout(() => setFeedback(null), 3000);

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category '${name}'?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }
      setFeedback({ type: 'success', message: `Deleted category '${name}'` });
      setTimeout(() => setFeedback(null), 3000);
      fetchCategories();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Store Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize departments, slugs, and navigation taxonomy
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {feedback && <FeedbackBanner type={feedback.type} message={feedback.message} />}
      {loading && <FeedbackBanner type="loading" message="Loading categories..." />}
      {error && <FeedbackBanner type="error" message={error} onRetry={fetchCategories} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div className="h-32 bg-gray-100 relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900">{cat.name}</h3>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      slug: {cat.slug}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-base font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
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
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sports & Fitness"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.name && <span className="text-rose-600 text-[11px] block mt-1">{formErrors.name}</span>}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Category scope and details..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
