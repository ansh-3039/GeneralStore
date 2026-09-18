const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, upload.single('image'), createCategory);

router.route('/:id')
  .put(protect, upload.single('image'), updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
