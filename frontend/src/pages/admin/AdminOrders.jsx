import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Phone, MapPin, Eye, CheckCircle, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ORDER_STATUSES = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const { adminInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
      const res = await axios.get('/api/orders', config);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
      await axios.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.phone?.includes(searchTerm);

    const matchesStatus = statusFilter ? o.orderStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
        <p className="text-xs text-gray-500">Track and update customer order lifecycle</p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded pl-8 pr-3 py-2 focus:outline-none focus:border-blue-600"
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total (COD)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-gray-800">{o._id}</td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900 block">{o.customer?.name}</span>
                    <span className="text-gray-500 font-mono text-[11px]">{o.customer?.phone}</span>
                  </td>
                  <td className="p-3 text-gray-700">
                    {o.orderItems.length} item(s)
                  </td>
                  <td className="p-3 font-bold text-gray-900">
                    ₹{o.totalPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                        o.orderStatus === 'DELIVERED'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : o.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="font-bold text-gray-800 text-base">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gray-50 p-3 rounded border space-y-1">
                <p><strong>Order ID:</strong> <span className="font-mono">{selectedOrder._id}</span></p>
                <p><strong>Customer Name:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>Customer Phone:</strong> {selectedOrder.customer?.phone}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} (Cash On Delivery)</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 mb-2 uppercase">Items Ordered</h3>
                <div className="space-y-1">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 border rounded bg-white">
                      <span>{item.name} x {item.qty}</span>
                      <span className="font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 mb-1 uppercase">Shipping Address</h3>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                {selectedOrder.shippingAddress.landmark && (
                  <p className="text-gray-500">Landmark: {selectedOrder.shippingAddress.landmark}</p>
                )}
              </div>

              <div className="pt-3 border-t flex justify-between items-center">
                <span className="font-bold text-sm">Total Amount:</span>
                <span className="font-bold text-base text-gray-900">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
