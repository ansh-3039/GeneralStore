import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Check, Clock, Truck, Home as HomeIcon, AlertCircle } from 'lucide-react';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialOrderId) {
      // Auto fetch if orderId query param provided
      fetchOrderDirect(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrderDirect = async (idToFetch) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/orders/${idToFetch}`);
      setOrder(res.data);
    } catch (err) {
      setError('Order not found with the provided Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || !phone) {
      setError('Please provide both Order ID and Phone Number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/orders/track', { orderId, phone });
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to locate order with given details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Search Header */}
        <div className="bg-white rounded-md border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
          <h1 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Package className="text-blue-600" size={20} /> Track Your Package
          </h1>
          <p className="text-xs text-gray-500 mb-4">
            Enter your Order ID and registered Phone Number to track status in real-time.
          </p>

          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder="Order ID (e.g. 64b8f...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="tel"
                placeholder="Mobile Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Search size={14} /> {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 bg-red-50 text-red-600 text-xs p-3 rounded flex items-center gap-2 border border-red-200">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Step Tracker */}
        {order && (
          <div className="bg-white rounded-md border border-gray-200 p-4 sm:p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-center border-b pb-4 gap-2">
              <div>
                <span className="text-xs text-gray-400 block">Order ID</span>
                <span className="text-sm font-mono font-bold text-gray-800">{order._id}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Status</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper (Only if not cancelled) */}
            {order.orderStatus !== 'CANCELLED' ? (
              <div className="py-4">
                <div className="relative flex items-center justify-between">
                  {/* Progress Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 z-0 transition-all duration-500"
                    style={{
                      width: `${(getStepIndex(order.orderStatus) / (STATUS_STEPS.length - 1)) * 100}%`
                    }}
                  ></div>

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= getStepIndex(order.orderStatus);
                    const isCurrent = idx === getStepIndex(order.orderStatus);

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            isCompleted
                              ? 'bg-green-500 border-green-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold mt-2 ${isCurrent ? 'text-green-700' : 'text-gray-500'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-4 rounded text-center text-xs font-semibold">
                This order has been cancelled by the store administrator.
              </div>
            )}

            {/* Order Items List */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Items in this order</h3>
              <div className="space-y-2">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded border">
                    <div>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-gray-400 ml-2">Qty: {item.qty}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-4 text-xs text-gray-600 space-y-1">
              <span className="font-bold text-gray-800 block mb-1">Delivery Address:</span>
              <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
