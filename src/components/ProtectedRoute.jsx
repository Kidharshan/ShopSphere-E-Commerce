// ==============================================================
// REUSABLE COMPONENT: ProtectedRoute
// File: src/components/ProtectedRoute.jsx
// Student Implementation: Enforces JWT auth and Role-Based Access Control (RBAC)
// ==============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole = '' }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
        <h2 className="text-lg font-bold text-rose-900">Access Restricted</h2>
        <p className="text-sm text-rose-700 mt-2">
          Administrator privileges are required to view this panel. You are currently logged in as a <strong>{user.role}</strong>.
        </p>
        <div className="mt-4">
          <a href="/" className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return children;
}
