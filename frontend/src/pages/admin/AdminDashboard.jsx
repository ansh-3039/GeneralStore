import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, ShoppingBag, Package, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboard() {
  const { adminInfo } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` }
      };
      const res = await axios.get('/api/admin/stats', config);
      setStats(res.data.stats);
      setRecentOrders(res.data.recentOrders);
      setLowStockProducts(res.data.lowStockProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-xs text-gray-500">Real-time performance metrics of your store</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Revenue</span>
            <span className="text-xl font-extrabold text-gray-900">₹{stats?.totalRevenue.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <IndianRupee size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Orders</span>
            <span className="text-xl font-extrabold text-gray-900">{stats?.totalOrders || 0}</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Total Products</span>
            <span className="text-xl font-extrabold text-gray-900">{stats?.totalProducts || 0}</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <Package size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Customers</span>
            <span className="text-xl font-extrabold text-gray-900">{stats?.totalCustomers || 0}</span>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <h2 className="text-sm font-bold text-gray-800">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No orders placed yet.</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center text-xs p-2.5 rounded bg-gray-50 border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800 block">{order.customer?.name} ({order.customer?.phone})</span>
                    <span className="text-[11px] font-mono text-gray-500">ID: {order._id}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-blue-600">{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Warning (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 text-amber-700">
              <AlertTriangle size={16} /> Low Stock Warnings
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">All product stocks are healthy!</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex justify-between items-center text-xs p-2.5 rounded bg-amber-50 border border-amber-200">
                  <span className="font-medium text-gray-800 line-clamp-1">{prod.name}</span>
                  <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                    {prod.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
