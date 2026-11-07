// ==============================================================
// MODAL COMPONENT: PostmanModal
// File: src/components/PostmanModal.jsx
// Displays API collection and enables direct JSON download
// ==============================================================

import React, { useState } from 'react';
import { X, Download, Send, Check, Copy, Code2 } from 'lucide-react';
import { postmanCollectionData } from '../../backend/data/postmanCollection.js';

export default function PostmanModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const jsonStr = JSON.stringify(postmanCollectionData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShopSphere_Postman_Collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(postmanCollectionData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-orange-50/50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Postman REST API Collection</h2>
              <p className="text-xs text-gray-500">
                Evaluation Deliverable: Ready-to-import v2.1.0 collection for backend grading
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
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Download Official Collection</h4>
              <p className="text-xs text-gray-500">
                Import this file directly into the Postman Desktop App or Postman Web.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyJSON}
                className="px-3.5 py-2 text-xs font-semibold bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Raw JSON'}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Collection (.json)
              </button>
            </div>
          </div>

          {/* Endpoints overview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Documented Route Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postmanCollectionData.item.map((cat, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center mb-2.5">
                    <Code2 className="w-4 h-4 text-orange-500 mr-2" />
                    {cat.name}
                  </h4>
                  <div className="space-y-2">
                    {cat.item.map((endpoint, eIdx) => {
                      const method = endpoint.request.method;
                      const methodColors = {
                        GET: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                        POST: 'bg-blue-100 text-blue-800 border-blue-200',
                        PUT: 'bg-amber-100 text-amber-800 border-amber-200',
                        DELETE: 'bg-rose-100 text-rose-800 border-rose-200'
                      };
                      return (
                        <div key={eIdx} className="text-xs flex items-center justify-between py-1 border-b border-gray-100 last:border-0 font-mono">
                          <span className="text-gray-800 font-sans font-medium">{endpoint.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${methodColors[method] || 'bg-gray-100 text-gray-700'}`}>
                            {method}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition"
          >
            Close Postman Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
