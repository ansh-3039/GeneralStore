import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ShieldCheck, MapPin, Phone, User, Building, Truck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500 || cartItems.length === 0 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate phone (10-digit Indian phone format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6-9).');
      return;
    }

    // Validate pincode (6-digit)
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit Indian Pincode.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          qty: item.qty,
          name: item.name,
          price: item.price
        })),
        customerInfo: {
          name: formData.name,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark
        }
      };

      const res = await axios.post('/api/orders', orderPayload);

      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 text-center">
        <h2 className="text-lg font-bold text-gray-800">Your cart is empty</h2>
        <Link to="/" className="text-blue-600 text-xs font-bold underline mt-2 block">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        <h1 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Truck className="text-blue-600" size={20} /> Checkout & Delivery Address
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Shipping Form (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-md border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 border-b pb-3 mb-4 uppercase tracking-wider">
                1. Delivery Details (No Email Required)
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <User size={14} /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone size={14} /> Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="10-digit Indian number (e.g. 9876543210)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin size={14} /> House / Flat / Street Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="Full street address..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Building size={14} /> Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near City Park, Metro Gate..."
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Payment Option */}
                <div className="mt-6 border-t pt-4">
                  <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                    2. Payment Option
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-300 p-3 rounded flex items-center gap-3">
                    <CheckCircle2 className="text-yellow-700" size={20} />
                    <div>
                      <span className="text-xs font-bold text-yellow-900 block">Cash On Delivery (COD)</span>
                      <span className="text-[11px] text-yellow-800">Pay cash directly when your order is delivered to your address.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3 rounded shadow transition-colors uppercase tracking-wider mt-4"
                >
                  {loading ? 'Placing Order...' : 'CONFIRM ORDER (COD)'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm sticky top-20">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-800 line-clamp-1">{item.name}</span>
                      <span className="text-gray-400 text-[11px]">Qty: {item.qty}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-3 space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span>₹{shippingPrice}</span>
                  )}
                </div>
              </div>

              <div className="border-t my-3 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Payable</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
