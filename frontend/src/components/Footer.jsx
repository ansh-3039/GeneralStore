import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs mt-12 border-t border-gray-800">
      {/* Features Bar */}
      <div className="bg-gray-800 border-b border-gray-700 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <Truck className="text-yellow-400" size={20} />
            <span className="font-semibold text-gray-200">Fast & Free Delivery</span>
            <span className="text-[11px] text-gray-400">On orders over ₹500</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <RotateCcw className="text-yellow-400" size={20} />
            <span className="font-semibold text-gray-200">Easy COD Orders</span>
            <span className="text-[11px] text-gray-400">Pay cash upon delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <ShieldCheck className="text-yellow-400" size={20} />
            <span className="font-semibold text-gray-200">100% Genuine</span>
            <span className="text-[11px] text-gray-400">Directly sourced products</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <Phone className="text-yellow-400" size={20} />
            <span className="font-semibold text-gray-200">Order Support</span>
            <span className="text-[11px] text-gray-400">Contact via phone number</span>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-bold text-sm mb-2">ABOUT BHARATSTORE</h4>
          <p className="text-gray-400 leading-relaxed">
            BharatStore is India's modern e-commerce marketplace delivering quality electronics, fashion, and home essentials directly to your doorstep.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">CUSTOMER HELP</h4>
          <ul className="space-y-1.5">
            <li><a href="/track" className="hover:underline">Track Your Order</a></li>
            <li><a href="#" className="hover:underline">Cash On Delivery Policy</a></li>
            <li><a href="#" className="hover:underline">Shipping & Delivery Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">SHOP OWNER ASSISTANCE</h4>
          <p className="text-gray-400 mb-2">
            For administrator access and stock management:
          </p>
          <a href="/admin/login" className="inline-block bg-blue-600 text-white font-semibold px-3 py-1.5 rounded hover:bg-blue-700">
            Admin Login
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-4 text-center text-gray-500 text-[11px]">
        © 2026 BharatStore E-Commerce Ltd. All rights reserved. Built with MERN Stack.
      </div>
    </footer>
  );
}
