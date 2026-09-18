const Product = require('../models/Product');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    
    const products = await Product.find({ ...keyword, ...category, isActive: true }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, mrp, description, stock, category, discount, imageUrls } = req.body;
    let images = [];

    if (imageUrls) {
      if (Array.isArray(imageUrls)) {
        images.push(...imageUrls);
      } else if (typeof imageUrls === 'string') {
        images.push(...imageUrls.split(',').map(s => s.trim()).filter(Boolean));
      }
    }
    
    if (req.files && req.files.length > 0) {
      if (isCloudinaryConfigured()) {
        for (const file of req.files) {
          const cloudUrl = await uploadToCloudinary(file.path);
          images.push(cloudUrl);
        }
      } else {
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);
        images.push(...filePaths);
      }
    }

    const product = new Product({
      name, price, mrp, description, stock, category, discount, images
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, mrp, description, stock, category, discount, isActive, imageUrls } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.mrp = mrp || product.mrp;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.category = category || product.category;
      product.discount = discount || product.discount;
      if (isActive !== undefined) product.isActive = isActive;

      const newImages = [];
      if (imageUrls) {
        if (Array.isArray(imageUrls)) {
          newImages.push(...imageUrls);
        } else if (typeof imageUrls === 'string') {
          newImages.push(...imageUrls.split(',').map(s => s.trim()).filter(Boolean));
        }
      }

      if (req.files && req.files.length > 0) {
        if (isCloudinaryConfigured()) {
          for (const file of req.files) {
            const cloudUrl = await uploadToCloudinary(file.path);
            newImages.push(cloudUrl);
          }
        } else {
          const filePaths = req.files.map(file => `/uploads/${file.filename}`);
          newImages.push(...filePaths);
        }
      }

      if (newImages.length > 0) {
        product.images = [...product.images, ...newImages];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
