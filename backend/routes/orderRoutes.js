const express = require('express');
const router = express.Router();
const { placeOrder, getOrderById, trackOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(placeOrder) // Public for customers
  .get(protect, getOrders); // Protected for admin

router.post('/track', trackOrder); // Public order tracking

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrderStatus);

module.exports = router;
