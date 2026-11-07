// ==============================================================
// REUSABLE COMPONENT: Pagination
// File: src/components/Pagination.jsx
// Student Implementation: Handles catalog pagination & page switches
// ==============================================================

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, pages = 1, total = 0, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
      <div className="text-xs text-gray-500 font-medium">
        Showing Page <span className="font-semibold text-gray-800">{page}</span> of{' '}
        <span className="font-semibold text-gray-800">{pages}</span> ({total} total products)
      </div>

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {pageNumbers.map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
              page === num
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
