const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, customerInfo } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // 1. Find or create customer (using phone as unique identifier)
    let customer = await Customer.findOne({ phone: customerInfo.phone });
    if (!customer) {
      customer = await Customer.create({
        name: customerInfo.name,
        phone: customerInfo.phone,
        addresses: [shippingAddress]
      });
    }

    // 2. Validate prices and stock against DB
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      // Snapshot data
      verifiedOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images[0] || '',
        price: product.price, // always take price from DB
        product: product._id
      });

      itemsPrice += product.price * item.qty;

      // Reduce stock
      product.stock -= item.qty;
      await product.save();
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50; // free shipping above 500
    const totalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      orderItems: verifiedOrderItems,
      customer: customer._id,
      shippingAddress,
      paymentMethod: 'COD',
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name phone');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { phone, orderId } = req.body;

    if (phone) {
      const cleanPhone = phone.trim();
      const customer = await Customer.findOne({ phone: cleanPhone });
      if (!customer) {
        return res.status(404).json({ message: 'No orders found registered with this phone number.' });
      }

      const orders = await Order.find({ customer: customer._id })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 });

      if (orders && orders.length > 0) {
        return res.json(orders);
      } else {
        return res.status(404).json({ message: 'No orders found for this phone number.' });
      }
    }

    if (orderId) {
      const order = await Order.findById(orderId).populate('customer', 'name phone');
      if (order) {
        return res.json([order]);
      } else {
        return res.status(404).json({ message: 'Order not found with provided Order ID.' });
      }
    }

    res.status(400).json({ message: 'Please enter a valid mobile phone number.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ROUTES
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('customer', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;
      if (req.body.status === 'DELIVERED') {
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getOrderById, trackOrder, getOrders, updateOrderStatus };
