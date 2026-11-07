// ==============================================================
// REUSABLE COMPONENT: FeedbackBanner
// File: src/components/FeedbackBanner.jsx
// Handles Success, Error, Loading, and Empty feedback states
// ==============================================================

import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, PackageOpen } from 'lucide-react';

export default function FeedbackBanner({ type = 'info', message, title, onRetry }) {
  if (!message && !title) return null;

  if (type === 'loading') {
    return (
      <div className="flex items-center justify-center p-8 bg-blue-50/50 rounded-xl border border-blue-100 my-4">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-3" />
        <span className="text-blue-900 font-medium text-sm">
          {message || 'Loading data from server...'}
        </span>
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-200 text-center my-6">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">{title || 'No records found'}</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">{message || 'Try adjusting your search or filters.'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div className="flex items-start p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 my-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2.5 mt-0.5 shrink-0" />
        <div>
          {title && <h4 className="font-semibold text-sm">{title}</h4>}
          <p className="text-sm text-emerald-800">{message}</p>
        </div>
      </div>
    );
  }

  // Error state default
  return (
    <div className="flex items-start p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 my-3">
      <AlertCircle className="w-5 h-5 text-rose-600 mr-2.5 mt-0.5 shrink-0" />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm">{title}</h4>}
        <p className="text-sm text-rose-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-medium text-rose-700 underline hover:text-rose-900"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
