import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, LogOut, ArrowLeft, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const { adminInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!adminInfo || !adminInfo.token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold mb-2">Access Restricted</h2>
        <p className="text-xs text-gray-400 mb-4">You must be logged in as an administrator to view this area.</p>
        <Link to="/admin/login" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded">
          Go to Admin Login
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-white">BharatStore</h2>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Shop Admin Panel</span>
          </div>
          <Link to="/" className="text-gray-400 hover:text-white p-1 rounded" title="Back to Customer Store">
            <Store size={18} />
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 mt-auto">
          <div className="px-3 py-2 text-xs text-gray-400 mb-2">
            Logged in as: <strong className="text-gray-200 block truncate">{adminInfo.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-red-400 hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
