import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);

  const cartItem = cartItems.find((item) => item._id === product._id);
  const isInCart = cartItem && cartItem.qty > 0;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="bg-white rounded-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between overflow-hidden group">
      <Link to={`/product/${product._id}`} className="p-3 block flex-1">
        {/* Product Image */}
        <div className="relative aspect-square w-full mb-3 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600">
          {product.name}
        </h3>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 mb-2">
          <span className="bg-green-700 text-white text-[11px] font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5">
            {product.ratings || 4.2} <Star size={10} className="fill-current" />
          </span>
          <span className="text-[11px] text-gray-400">({product.numReviews || 128})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm md:text-base font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-1">
          {product.stock > 0 ? (
            <span className="text-[11px] text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-[11px] text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </Link>

      {/* Add to Cart / Go to Cart Action */}
      <div className="p-2 pt-0">
        {isInCart ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate('/cart');
            }}
            className="w-full py-1.5 px-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          >
            <ShoppingBag size={14} />
            <span>Go to Cart</span>
            <ArrowRight size={12} />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            disabled={product.stock <= 0}
            className={`w-full py-1.5 px-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
              product.stock > 0
                ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
