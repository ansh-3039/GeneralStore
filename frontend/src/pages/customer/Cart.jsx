import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const mrpPrice = cartItems.reduce((acc, item) => acc + (item.mrp || item.price) * item.qty, 0);
  const discountAmount = mrpPrice - itemsPrice;
  const shippingPrice = itemsPrice > 500 || cartItems.length === 0 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center max-w-md w-full">
          <ShoppingBag size={48} className="mx-auto text-blue-600 mb-3" />
          <h2 className="text-lg font-bold text-gray-800">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Explore our vast range of products and discover great deals!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded shadow hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Header Title */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">My Cart ({cartItems.length} items)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {cartItems.map((item) => {
              const itemDiscount = item.mrp > item.price
                ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                : 0;

              return (
                <div key={item._id} className="bg-white rounded-md border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Image & Main Info */}
                  <div className="flex gap-3">
                    <Link to={`/product/${item._id}`} className="w-20 h-20 bg-gray-50 border rounded flex-shrink-0 p-1 flex items-center justify-center">
                      <img src={getImageUrl(item.images?.[0])} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </Link>
                    <div>
                      <Link to={`/product/${item._id}`} className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-gray-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                        )}
                        {itemDiscount > 0 && (
                          <span className="text-xs font-bold text-green-600">{itemDiscount}% off</span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">Seller: BharatStore Official</span>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border rounded border-gray-300">
                      <button
                        onClick={() => updateQuantity(item._id, item.qty - 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-gray-800">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.qty + 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={14} />
                      <span>REMOVE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm sticky top-20">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2">
                PRICE DETAILS
              </h2>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{mrpPrice.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span>₹{shippingPrice}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed my-3 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <p className="text-[11px] text-green-600 font-medium mb-4">
                  You will save ₹{discountAmount.toLocaleString('en-IN')} on this order!
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3 rounded shadow transition-colors uppercase tracking-wider"
              >
                Place Order
              </button>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400 justify-center">
                <ShieldCheck size={16} className="text-gray-500" />
                <span>Safe and Secure Payments. 100% Authentic products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
