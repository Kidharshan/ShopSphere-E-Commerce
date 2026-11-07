// ==============================================================
// CONTROLLER: Category
// File: backend/controllers/categoryController.js
// Student Implementation: Category CRUD for store catalog
// ==============================================================

import { CategoryModel } from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Category name is required.'
      });
    }

    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.'
      });
    }

    const newCategory = await CategoryModel.create({ name, description, image });
    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category: newCategory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found to update' });
    }

    const updated = await CategoryModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      category: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found to delete' });
    }
    res.status(200).json({
      success: true,
      message: `Category '${deleted.name}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
