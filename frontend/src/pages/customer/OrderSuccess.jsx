import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, ArrowRight, Phone, MapPin } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-md shadow-sm border border-gray-200 max-w-lg w-full text-center">
        
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Order Placed Successfully!</h1>
        <p className="text-xs text-gray-500 mb-6">
          Thank you for shopping with BharatStore. Your Cash on Delivery order is confirmed.
        </p>

        {order && (
          <div className="bg-gray-50 p-4 rounded-md text-left text-xs space-y-2 mb-6 border border-gray-200">
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold text-gray-700">Order ID:</span>
              <span className="font-mono font-bold text-blue-600">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Customer Contact:</span>
              <span>{order.customer?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Total Amount (COD):</span>
              <span className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Status:</span>
              <span className="font-bold text-green-700">{order.orderStatus}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track?orderId=${id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded flex items-center justify-center gap-1.5"
          >
            <Package size={16} /> Track Order Status
          </Link>

          <Link
            to="/"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 rounded flex items-center justify-center gap-1"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
