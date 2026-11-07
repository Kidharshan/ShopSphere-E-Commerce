// ==============================================================
// CONTROLLER: Authentication (Auth)
// File: backend/controllers/authController.js
// Student Implementation: Registration, Login, JWT generation, bcrypt
// ==============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'college_student_mern_secret_key_2025';

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, street, city, state, postalCode, country } = req.body;

    // 1. Validation in Express API
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Password must be at least 6 characters long.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Please provide a valid email format.'
      });
    }

    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Account with this email already exists. Please login instead.'
      });
    }

    // 3. Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user record
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer',
      phone: phone || '',
      address: {
        street: street || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        country: country || 'United States'
      }
    });

    // 5. Generate token & respond
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to ShopSphere.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation in Express API
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Email and password are required.'
      });
    }

    // 2. Find user in database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: No account found with this email.'
      });
    }

    // 3. Verify password with bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: Incorrect password entered.'
      });
    }

    // 4. Generate JWT Token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Login successful. Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updated = await UserModel.findByIdAndUpdate(req.user._id, {
      name: name || req.user.name,
      phone: phone !== undefined ? phone : req.user.phone,
      address: address || req.user.address
    });
    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updated });
  } catch (error) {
    next(error);
  }
};
