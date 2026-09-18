import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Package, ShieldCheck, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.cartItems);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] text-white shadow-md">
      {/* Top Banner / Main Nav */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-1 rounded-md text-white hover:bg-blue-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-tight italic font-serif leading-none">
              BharatStore
            </span>
            <span className="text-[10px] text-yellow-300 font-medium italic tracking-wider flex items-center gap-0.5">
              Explore <span className="text-white font-bold">Plus</span>
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-gray-800 placeholder-gray-500 pl-4 pr-10 py-2 rounded-sm text-sm focus:outline-none shadow-inner"
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3 text-[#2874f0] hover:text-blue-700">
            <Search size={18} />
          </button>
        </form>

        {/* Action Links */}
        <div className="flex items-center gap-4 md:gap-8 text-sm font-medium">
          <Link to="/track" className="hidden md:flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
            <Package size={18} />
            <span>Track Order</span>
          </Link>

          <Link to="/admin/login" className="hidden md:flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
            <ShieldCheck size={18} />
            <span>Admin</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-2 bg-white text-[#2874f0] md:bg-transparent md:text-white px-3 py-1.5 md:px-0 md:py-0 rounded-sm font-bold md:font-medium hover:text-yellow-300 transition-colors relative">
            <div className="relative">
              <ShoppingCart size={20} />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-xs md:text-sm">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-3 pb-2.5 md:hidden">
        <form onSubmit={handleSearch} className="flex relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-gray-800 placeholder-gray-500 pl-3 pr-9 py-1.5 rounded-md text-xs focus:outline-none shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-0 h-full text-[#2874f0]">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500 px-4 py-3 space-y-3">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="block text-white font-medium py-1.5 hover:text-yellow-300"
          >
            Home
          </Link>
          <Link 
            to="/track" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="block text-white font-medium py-1.5 hover:text-yellow-300"
          >
            Track Your Order
          </Link>
          <Link 
            to="/admin/login" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="block text-white font-medium py-1.5 hover:text-yellow-300"
          >
            Admin Dashboard Login
          </Link>
        </div>
      )}
    </header>
  );
}
