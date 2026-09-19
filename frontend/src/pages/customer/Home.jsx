import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import { Filter, ArrowUpDown, X, Sparkles } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, currentSearch]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/products?';
      if (currentCategory) url += `category=${currentCategory}&`;
      if (currentSearch) url += `keyword=${encodeURIComponent(currentSearch)}&`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products. Please check server connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setIsFilterDrawerOpen(false);
  };

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.ratings || 0) - (a.ratings || 0);
    return 0; // featured
  });

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Category Horizontal Scroll Banner */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              !currentCategory
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat._id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                currentCategory === cat._id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        
        {/* Top Control Bar (Search Info, Filter, Sort) */}
        <div className="bg-white p-3 rounded-md shadow-sm mb-4 flex items-center justify-between gap-2 flex-wrap border border-gray-200">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5">
              <Sparkles size={16} className="text-yellow-500" />
              {currentSearch ? `Results for "${currentSearch}"` : 'Deals of the Day'}
            </h1>
            <p className="text-xs text-gray-500">
              Showing {sortedProducts.length} items
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs">
              <ArrowUpDown size={14} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Popularity / Rating</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="md:hidden flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded text-xs font-semibold"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Skeleton Buffering Loader Grid when Loading */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-4 text-blue-600 font-semibold text-xs">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching best deals for you...</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-md p-3 border border-gray-200 animate-pulse space-y-3">
                  <div className="bg-gray-200 aspect-square rounded-md w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center text-sm my-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="bg-white rounded-md p-10 text-center border border-gray-200 my-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Sparkles size={32} />
            </div>
            <h3 className="text-base font-bold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Try clearing filters or searching for something else.</p>
            <button
              onClick={() => {
                setSearchParams({});
                handleCategorySelect('');
              }}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-blue-700 shadow"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Flipkart Style Product Grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterDrawerOpen(false)}></div>
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-xl flex flex-col p-4 z-10">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <Filter size={18} /> Filters
              </h2>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium ${
                    !currentCategory ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id)}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-medium ${
                      currentCategory === cat._id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  handleCategorySelect('');
                  setIsFilterDrawerOpen(false);
                }}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded text-xs shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
