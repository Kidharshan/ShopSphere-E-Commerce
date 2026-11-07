// ==============================================================
// MONGOOSE MODEL: Product
// File: backend/models/Product.js
// Attributes: name, description, price, category ref, stock, rating, etc.
// ==============================================================

import mongoose from 'mongoose';
import { store } from '../config/db.js';

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price must be positive']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    categoryName: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: 'General'
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock inventory count'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide product image URL'],
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });

export const ProductModel = {
  find: async (filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 100) => {
    let result = [...store.products];

    // Filter by Category
    if (filter.category) {
      result = result.filter(p => p.category === filter.category || p.categoryName === filter.category);
    }

    // Search query (keyword)
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // Filter by Price range
    if (filter.minPrice !== undefined) {
      result = result.filter(p => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice !== undefined) {
      result = result.filter(p => p.price <= Number(filter.maxPrice));
    }

    // Filter in-stock only
    if (filter.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Filter featured
    if (filter.isFeatured !== undefined) {
      result = result.filter(p => p.isFeatured === filter.isFeatured);
    }

    // Sorting
    if (sort.price === 1) {
      result.sort((a, b) => a.price - b.price);
    } else if (sort.price === -1) {
      result.sort((a, b) => b.price - a.price);
    } else if (sort.rating === -1) {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Newest
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    const total = result.length;
    const paginated = result.slice(skip, skip + limit);

    return { products: paginated, total };
  },

  findById: async (id) => {
    return store.products.find(p => p._id === id) || null;
  },

  create: async (data) => {
    // Find category name if needed
    const cat = store.categories.find(c => c._id === data.category);
    const newProduct = {
      _id: "prod_" + Date.now(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      categoryName: cat ? cat.name : (data.categoryName || 'General'),
      brand: data.brand || 'General',
      stock: Number(data.stock || 0),
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      rating: Number(data.rating || 5.0),
      numReviews: Number(data.numReviews || 0),
      isFeatured: Boolean(data.isFeatured),
      createdAt: new Date().toISOString()
    };
    store.products.unshift(newProduct);
    return newProduct;
  },

  findByIdAndUpdate: async (id, updateData) => {
    const idx = store.products.findIndex(p => p._id === id);
    if (idx === -1) return null;

    if (updateData.category) {
      const cat = store.categories.find(c => c._id === updateData.category);
      if (cat) updateData.categoryName = cat.name;
    }
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    store.products[idx] = { ...store.products[idx], ...updateData };
    return store.products[idx];
  },

  findByIdAndDelete: async (id) => {
    const idx = store.products.findIndex(p => p._id === id);
    if (idx === -1) return null;
    return store.products.splice(idx, 1)[0];
  },

  countDocuments: async () => store.products.length
};

export default mongoose.models.Product || mongoose.model('Product', productSchema);
