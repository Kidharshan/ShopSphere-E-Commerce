// ==============================================================
// PAGE: RegisterPage
// File: src/pages/RegisterPage.jsx
// Student Implementation: Controlled registration form with input validation
// ==============================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);

      if (!res.success) {
        throw new Error(res.message || 'Registration failed');
      }

      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h1>
        <p className="text-xs text-gray-500">
          Join ShopSphere for campus discounts, fast checkout, and order tracking
        </p>
      </div>

      {errorMsg && <FeedbackBanner type="error" message={errorMsg} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jordan Lee"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.name && <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.name}</span>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jordan@college.edu"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.email && <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.email}</span>}
            </div>
          </div>

          {/* Password & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password (min. 6 chars) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    formErrors.password ? 'border-rose-400 bg-rose-50/20' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.password && <span className="text-rose-600 text-[11px] mt-1 block">{formErrors.password}</span>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="customer">Customer (Student Shopper)</option>
                <option value="admin">Administrator (Store Staff)</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <span className="font-semibold text-gray-700 block">Campus Dorm / Shipping Address</span>
            <div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address or Dorm Hall"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Zip Code"
                className="p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500 mt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
