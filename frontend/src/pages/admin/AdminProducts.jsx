import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit3, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminProducts() {
  const { adminInfo } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mrp: '',
    description: '',
    stock: '',
    category: '',
    discount: 0,
    imageUrls: ''
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      mrp: '',
      description: '',
      stock: '',
      category: categories[0]?._id || '',
      discount: 0
    });
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      description: product.description,
      stock: product.stock,
      category: product.category?._id || product.category,
      discount: product.discount || 0
    });
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
      await axios.delete(`/api/products/${id}`, config);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('mrp', formData.mrp);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    data.append('discount', formData.discount);
    if (formData.imageUrls) {
      data.append('imageUrls', formData.imageUrls);
    }

    for (let i = 0; i < imageFiles.length; i++) {
      data.append('images', imageFiles[i]);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`
        }
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, data, config);
      } else {
        await axios.post('/api/products', data, config);
      }

      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Product Management</h1>
          <p className="text-xs text-gray-500">Add, edit, or update stock and prices</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 shadow"
        >
          <Plus size={16} /> Add New Product
        </button>
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
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price / MRP</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/50'}
                      alt=""
                      className="w-10 h-10 object-contain border rounded p-1 bg-white"
                    />
                    <div>
                      <span className="font-bold text-gray-800 line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">ID: {p._id}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700 font-medium">
                    {p.category?.name || 'Uncategorized'}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-gray-900 block">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 line-through text-[11px]">₹{p.mrp.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="font-bold text-gray-800 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Available *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon size={14} /> Product Image URLs (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-123... (comma separated)"
                  value={formData.imageUrls || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs mb-2"
                />

                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                  Upload Local Image Files
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
