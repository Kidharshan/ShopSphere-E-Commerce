// ==============================================================
// MONGOOSE MODEL: Category
// File: backend/models/Category.js
// Attributes: name, slug, description, image
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ slug: 1 });

export const CategoryModel = {
  find: async () => [...store.categories],

  findById: async (id) => {
    return store.categories.find(c => c._id === id) || null;
  },

  findOne: async (query = {}) => {
    return store.categories.find(c => {
      if (query.slug && c.slug === query.slug) return true;
      if (query.name && c.name.toLowerCase() === query.name.toLowerCase()) return true;
      return false;
    }) || null;
  },

  create: async (data) => {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      _id: "cat_" + Date.now(),
      name: data.name,
      slug,
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
    store.categories.push(newCategory);
    return newCategory;
  },

  findByIdAndUpdate: async (id, updateData) => {
    const idx = store.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    store.categories[idx] = { ...store.categories[idx], ...updateData };
    return store.categories[idx];
  },

  findByIdAndDelete: async (id) => {
    const idx = store.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    return store.categories.splice(idx, 1)[0];
  },

  countDocuments: async () => store.categories.length
};

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
