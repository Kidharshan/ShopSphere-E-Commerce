// ==============================================================
// PAGE: LoginPage
// File: src/pages/LoginPage.jsx
// Student Implementation: Controlled login form, client validation, 1-click demo logins
// ==============================================================

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackBanner from '../components/FeedbackBanner.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname || '/';

  // Controlled form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    if (!email.trim() || !password) {
      setErrorMsg('Validation Error: Both email and password are required.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Validation Error: Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);

      if (!res.success) {
        throw new Error(res.message || 'Login failed. Please check your credentials.');
      }

      // Navigate to destination
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Fill
  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-md mx-auto my-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Welcome to ShopSphere
        </h1>
        <p className="text-xs text-gray-500">
          Sign in to access your cart, track orders, or enter the administrative portal
        </p>
      </div>

      {errorMsg && <FeedbackBanner type="error" message={errorMsg} />}

      {/* Main Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ecommerce.edu"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Quick Demo Credentials for Grading */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
          Evaluation Quick-Fill (Click to Autofill)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@ecommerce.edu', 'admin123')}
            className="p-2.5 bg-white border border-blue-200 rounded-xl text-left hover:bg-blue-50 transition shadow-2xs group"
          >
            <div className="flex items-center text-blue-700 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Admin Demo
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">admin@ecommerce.edu</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('customer@ecommerce.edu', 'user123')}
            className="p-2.5 bg-white border border-emerald-200 rounded-xl text-left hover:bg-emerald-50 transition shadow-2xs group"
          >
            <div className="flex items-center text-emerald-700 font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5 mr-1" /> Customer Demo
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">customer@ecommerce.edu</div>
          </button>
        </div>
      </div>
    </div>
  );
}
