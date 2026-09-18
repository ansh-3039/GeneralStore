import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Zap, ShieldCheck, Truck, RotateCcw, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import ProductCard from '../../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(0);
      }

      // Fetch related products in same category
      if (res.data.category?._id) {
        const relatedRes = await axios.get(`/api/products?category=${res.data.category._id}`);
        setRelatedProducts(relatedRes.data.filter((p) => p._id !== id));
      }
    } catch (err) {
      setError('Product not found or failed to load.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, qty);
    }
  };

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      addToCart(product, qty);
      navigate('/checkout');
    }
  };

  const checkDelivery = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryMsg(`Delivery available to ${pincode} by tomorrow!`);
    } else {
      setDeliveryMsg('Please enter a valid 6-digit Indian pincode.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/500?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-sm border text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600 mb-2">{error || 'Product Not Found'}</h2>
          <Link to="/" className="inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 flex-wrap">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={12} />
          <span>{product.category?.name || 'Category'}</span>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Container Card */}
        <div className="bg-white rounded-md border border-gray-200 shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="border border-gray-200 rounded-md p-2 bg-white aspect-square flex items-center justify-center relative overflow-hidden">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 border rounded p-1 bg-white flex-shrink-0 flex items-center justify-center ${
                      selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Action Buttons under image */}
            <div className="hidden md:grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  product.stock > 0
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={18} />
                <span>ADD TO CART</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`py-3 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  product.stock > 0
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap size={18} />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Right Column: Product Details (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  {product.ratings || 4.2} <Star size={12} className="fill-current" />
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {product.numReviews || 128} Ratings & Reviews
                </span>
              </div>

              {/* Pricing Block */}
              <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-sm font-bold text-green-600">
                    {discountPercent}% off
                  </span>
                )}
              </div>

              {/* Stock Tag */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-1.5 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-800">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="p-1.5 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Pincode / Delivery Check */}
              <div className="border-t border-b py-4 mb-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Truck size={16} className="text-blue-600" /> Delivery Options
                </h4>
                <form onSubmit={checkDelivery} className="flex gap-2 max-w-xs">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-600"
                  />
                  <button type="submit" className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-900">
                    Check
                  </button>
                </form>
                {deliveryMsg && (
                  <p className={`text-xs mt-2 font-medium ${deliveryMsg.includes('available') ? 'text-green-600' : 'text-red-500'}`}>
                    {deliveryMsg}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Specifications</h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className={`flex py-2 px-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <span className="w-1/3 text-gray-500 font-medium">{spec.key}</span>
                        <span className="w-2/3 text-gray-800 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Action Buttons Sticky Bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 grid grid-cols-2 gap-2 z-40 shadow-lg">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-2.5 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 ${
                  product.stock > 0
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={16} />
                <span>ADD TO CART</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`py-2.5 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 ${
                  product.stock > 0
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap size={16} />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-bold text-gray-900 mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
