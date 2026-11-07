// ==============================================================
// MODAL COMPONENT: ERDiagramModal
// File: src/components/ERDiagramModal.jsx
// Displays the Mongoose Entity-Relationship (ER) Schema for Grading
// ==============================================================

import React from 'react';
import { X, Database, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function ERDiagramModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const models = [
    {
      name: "User",
      collection: "users",
      color: "border-blue-500 bg-blue-50/50",
      badgeColor: "bg-blue-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "name", type: "String (Required)" },
        { name: "email", type: "String (Unique, Indexed)" },
        { name: "password", type: "String (bcrypt hash)" },
        { name: "role", type: "Enum ('admin' | 'customer')" },
        { name: "phone", type: "String" },
        { name: "address", type: "Object { street, city, state, postalCode, country }" },
        { name: "createdAt", type: "Date" }
      ],
      relations: ["1 -> Many (Orders)", "1 -> 1 (Cart)", "1 -> Many (Reviews)"]
    },
    {
      name: "Product",
      collection: "products",
      color: "border-emerald-500 bg-emerald-50/50",
      badgeColor: "bg-emerald-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "name", type: "String (Indexed, Text)" },
        { name: "description", type: "String" },
        { name: "price", type: "Number (Min: 0)" },
        { name: "category", type: "ObjectId -> Category._id (Ref)" },
        { name: "brand", type: "String" },
        { name: "stock", type: "Number (Inventory count)" },
        { name: "imageUrl", type: "String" },
        { name: "rating", type: "Number (1-5)" },
        { name: "numReviews", type: "Number" },
        { name: "isFeatured", type: "Boolean" }
      ],
      relations: ["Many -> 1 (Category)", "1 -> Many (Reviews)", "Referenced in Cart & Order"]
    },
    {
      name: "Category",
      collection: "categories",
      color: "border-purple-500 bg-purple-50/50",
      badgeColor: "bg-purple-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "name", type: "String (Unique)" },
        { name: "slug", type: "String (Indexed)" },
        { name: "description", type: "String" },
        { name: "image", type: "String" }
      ],
      relations: ["1 -> Many (Products)"]
    },
    {
      name: "Cart",
      collection: "carts",
      color: "border-amber-500 bg-amber-50/50",
      badgeColor: "bg-amber-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "user", type: "ObjectId -> User._id (Unique Ref)" },
        { name: "items", type: "Array of [{ product: Ref, quantity, price }]" },
        { name: "totalAmount", type: "Number" },
        { name: "updatedAt", type: "Date" }
      ],
      relations: ["1 -> 1 (User)", "Many -> 1 (Product per item)"]
    },
    {
      name: "Order",
      collection: "orders",
      color: "border-rose-500 bg-rose-50/50",
      badgeColor: "bg-rose-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "user", type: "ObjectId -> User._id (Ref, Indexed)" },
        { name: "orderItems", type: "Array of [{ product: Ref, name, quantity, price, image }]" },
        { name: "shippingAddress", type: "Object { fullName, address, city, postalCode, country }" },
        { name: "paymentMethod", type: "String ('Credit Card' | 'PayPal')" },
        { name: "itemsPrice", type: "Number" },
        { name: "discountAmount", type: "Number" },
        { name: "shippingPrice", type: "Number" },
        { name: "totalPrice", type: "Number" },
        { name: "couponCode", type: "String (Nullable)" },
        { name: "status", type: "Enum ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled')" },
        { name: "isPaid", type: "Boolean (Default: true)" },
        { name: "paidAt", type: "Date" }
      ],
      relations: ["Many -> 1 (User)", "Snapshot of Products"]
    },
    {
      name: "Review",
      collection: "reviews",
      color: "border-indigo-500 bg-indigo-50/50",
      badgeColor: "bg-indigo-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "product", type: "ObjectId -> Product._id (Ref, Indexed)" },
        { name: "user", type: "ObjectId -> User._id (Ref)" },
        { name: "userName", type: "String" },
        { name: "rating", type: "Number (1 to 5)" },
        { name: "comment", type: "String" },
        { name: "createdAt", type: "Date" }
      ],
      relations: ["Many -> 1 (Product)", "Many -> 1 (User)"]
    },
    {
      name: "Coupon",
      collection: "coupons",
      color: "border-teal-500 bg-teal-50/50",
      badgeColor: "bg-teal-600 text-white",
      fields: [
        { name: "_id", type: "ObjectId", key: true },
        { name: "code", type: "String (Unique, Uppercase, Indexed)" },
        { name: "discountPercentage", type: "Number (1-100)" },
        { name: "minPurchaseAmount", type: "Number" },
        { name: "maxDiscount", type: "Number" },
        { name: "expiryDate", type: "String / Date" },
        { name: "isActive", type: "Boolean" },
        { name: "description", type: "String" }
      ],
      relations: ["Used in Order validation"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mongoose Database ER Diagram</h2>
              <p className="text-xs text-gray-500">
                Evaluation Document: Schemas, Primary Keys, Foreign Key References & Indexes (7 Models)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {models.map(model => (
              <div
                key={model.name}
                className={`rounded-xl border p-4 shadow-2xs ${model.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b pb-2 border-gray-200/60">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${model.badgeColor}`}>
                      {model.name}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      db.{model.collection}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    {model.fields.map(f => (
                      <div key={f.name} className="flex items-start justify-between py-0.5 border-b border-gray-100/50">
                        <span className="font-semibold text-gray-800 flex items-center">
                          {f.key && <Key className="w-3 h-3 text-amber-500 mr-1" />}
                          {f.name}
                        </span>
                        <span className="text-gray-500 text-[11px] text-right ml-2">{f.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Relationships
                  </span>
                  <div className="space-y-0.5">
                    {model.relations.map((rel, idx) => (
                      <div key={idx} className="text-[11px] text-gray-600 flex items-center">
                        <ArrowRight className="w-3 h-3 text-gray-400 mr-1 shrink-0" />
                        <span>{rel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Relationships Summary Card */}
          <div className="bg-gray-900 text-gray-200 p-4 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
              Mongoose Schema Architecture Highlights
            </h4>
            <p className="text-gray-300">
              - <strong>User & Authentication:</strong> Passwords hashed with 10 salt rounds via bcryptjs; JWT signed with role claim.
            </p>
            <p className="text-gray-300">
              - <strong>Product & Category:</strong> One-to-many relationship using ObjectId reference; compound indexes on category and price for lightning-fast queries.
            </p>
            <p className="text-gray-300">
              - <strong>Order & Stock Integrity:</strong> Real-time inventory deduction upon order placement; snapshot preservation of product details and price at time of purchase.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
}
