// ==============================================================
// REUSABLE COMPONENT: ProductCard
// File: src/components/ProductCard.jsx
// Student Implementation: Product display card with stock and add to cart
// ==============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const ok = await addToCart(product, 1);
    setIsAdding(false);

    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs">
          {product.categoryName || 'General'}
        </span>

        {/* Stock Badge */}
        {isLowStock && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center shadow-xs">
            <AlertTriangle className="w-3 h-3 mr-1" /> Only {product.stock} left
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-600">{product.brand || 'ShopSphere'}</span>
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-semibold text-gray-700">{Number(product.rating || 5.0).toFixed(1)}</span>
              <span className="text-gray-400 ml-0.5">({product.numReviews || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-normal">Price</span>
            <span className="text-lg font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xs active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
