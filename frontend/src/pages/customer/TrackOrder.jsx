import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Check, Phone, Truck, AlertCircle, Calendar } from 'lucide-react';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDirect(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrderDirect = async (idToFetch) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/orders/${idToFetch}`);
      if (res.data) {
        setOrders([res.data]);
        if (res.data.customer?.phone) {
          setPhone(res.data.customer.phone);
        }
      }
    } catch (err) {
      setError('Order not found with the provided Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim();

    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/orders/track', { phone: cleanPhone });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No orders found for this mobile phone number.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Search Header Form (Phone Number Only) */}
        <div className="bg-white rounded-md border border-gray-200 p-4 sm:p-6 shadow-sm">
          <h1 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Package className="text-blue-600" size={20} /> Track My Orders
          </h1>
          <p className="text-xs text-gray-500 mb-4">
            Just enter your 10-digit mobile phone number to view all your order statuses.
          </p>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Enter 10-digit Phone Number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-600"
              />
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Search size={14} /> {loading ? 'Searching Orders...' : 'Track Orders'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 text-xs p-3 rounded flex items-center gap-2 border border-red-200">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Orders Results List */}
        {orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              Found {orders.length} Order(s) for <span className="text-blue-600 font-mono">{phone}</span>
            </h2>

            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-md border border-gray-200 p-4 sm:p-6 shadow-sm space-y-5">
                
                {/* Header info */}
                <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Order ID</span>
                    <span className="text-xs font-mono font-bold text-gray-800">{order._id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block">Status</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Status Progress Stepper */}
                {order.orderStatus !== 'CANCELLED' ? (
                  <div className="py-2">
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
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                isCompleted
                                  ? 'bg-green-500 border-green-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-400'
                              }`}
                            >
                              {isCompleted ? <Check size={14} /> : idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 ${isCurrent ? 'text-green-700 font-bold' : 'text-gray-500'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-3 rounded text-center text-xs font-semibold">
                    This order has been cancelled by the store administrator.
                  </div>
                )}

                {/* Items in this Order */}
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Items Ordered</h3>
                  <div className="space-y-2">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded border border-gray-200">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img src={item.image} alt="" className="w-8 h-8 object-contain border rounded bg-white p-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-gray-800 line-clamp-1">{item.name}</span>
                            <span className="text-gray-400 text-[11px]">Qty: {item.qty}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div className="border-t pt-3 flex flex-wrap justify-between items-end gap-2 text-xs">
                  <div className="text-gray-600 space-y-0.5">
                    <span className="font-bold text-gray-800 block">Delivery Address:</span>
                    <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    {order.shippingAddress.landmark && <p className="text-gray-500">Landmark: {order.shippingAddress.landmark}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[11px] block">Payment (COD)</span>
                    <span className="text-sm font-bold text-gray-900">Total: ₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
