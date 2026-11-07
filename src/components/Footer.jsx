// ==============================================================
// REUSABLE COMPONENT: Footer
// File: src/components/Footer.jsx
// ==============================================================

import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Terminal, Database, Code2 } from 'lucide-react';

export default function Footer({ onOpenER, onOpenPostman, onOpenDocs }) {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Project Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Shop<span className="text-blue-500">Sphere</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Full Stack E-commerce Application developed as 2nd year college coursework fulfilling all MERN syllabus requirements.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-mono">
              <span className="px-2 py-0.5 rounded bg-gray-800 text-emerald-400 border border-gray-700">MongoDB</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 text-blue-400 border border-gray-700">Express</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 text-cyan-400 border border-gray-700">React</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 text-amber-400 border border-gray-700">Node</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              Store Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-white transition">Home Storefront</a></li>
              <li><a href="/products" className="hover:text-white transition">Full Product Catalog</a></li>
              <li><a href="/cart" className="hover:text-white transition">Cart & Discounts</a></li>
              <li><a href="/orders" className="hover:text-white transition">Order Status & Tracking</a></li>
            </ul>
          </div>

          {/* Submission Deliverables */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              Coursework Artifacts
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenDocs} className="hover:text-white transition text-left flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  README & Demo Accounts
                </button>
              </li>
              <li>
                <button onClick={onOpenER} className="hover:text-white transition text-left flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Mongoose ER Diagram (7 Models)
                </button>
              </li>
              <li>
                <button onClick={onOpenPostman} className="hover:text-white transition text-left flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-orange-400" />
                  Postman Collection (Export JSON)
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              Security & Architecture
            </h4>
            <div className="space-y-1.5 text-[11px] text-gray-400">
              <div>- JSON Web Token (JWT) Bearer Auth</div>
              <div>- bcrypt password encryption (10 salt rounds)</div>
              <div>- Controlled forms with event.preventDefault()</div>
              <div>- React Context API (Auth & Cart state)</div>
              <div>- Server-authoritative inventory bounds</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <p>© 2025 ShopSphere MERN Application. Built for Computer Science Academic Assessment.</p>
          <div className="flex items-center space-x-1">
            <span>Evaluated with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>using React, Express, and MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
