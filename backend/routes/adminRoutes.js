const express = require('express');
const router = express.Router();
const { authAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.get('/stats', protect, getDashboardStats);

module.exports = router;
