const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + (order.orderStatus !== 'CANCELLED' ? order.totalPrice : 0), 0);

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('customer', 'name phone');
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);

    res.json({
      stats: { totalOrders, totalProducts, totalCustomers, totalRevenue },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authAdmin, getDashboardStats };
