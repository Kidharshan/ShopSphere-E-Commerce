// ==============================================================
// CONTROLLER: Product
// File: backend/controllers/productController.js
// Student Implementation: CRUD, Search, Filters, Sorting, Pagination
// ==============================================================

import { ProductModel } from '../models/Product.js';
import { ReviewModel } from '../models/Review.js';

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};
    if (search) filter.search = search;
    if (category && category !== 'all') filter.category = category;
    if (minPrice) filter.minPrice = minPrice;
    if (maxPrice) filter.maxPrice = maxPrice;
    if (inStock === 'true') filter.inStock = true;
    if (isFeatured === 'true') filter.isFeatured = true;

    // Sorting rule
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await ProductModel.find(filter, sortObj, skip, limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID with reviews
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found with provided ID'
      });
    }

    const reviews = await ReviewModel.find({ product: req.params.id });

    res.status(200).json({
      success: true,
      product: {
        ...product,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, stock, imageUrl, isFeatured } = req.body;

    // Validation
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Name, description, price, and category are required.'
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Price must be a positive number.'
      });
    }

    const newProduct = await ProductModel.create({
      name,
      description,
      price: Number(price),
      category,
      brand: brand || 'General',
      stock: Number(stock || 0),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found to update'
      });
    }

    const updated = await ProductModel.findByIdAndUpdate(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found to delete'
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${deleted.name}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
