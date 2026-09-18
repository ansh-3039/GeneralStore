const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Admin.deleteMany();
    await Category.deleteMany();

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'password123'
    });
    
    await admin.save();

    const categories = [
      { name: 'Mobiles', description: 'Smartphones and accessories', isActive: true },
      { name: 'Electronics', description: 'Laptops, TVs, and more', isActive: true },
      { name: 'Fashion', description: 'Clothing and apparel', isActive: true },
      { name: 'Home & Furniture', description: 'Home decor and furniture', isActive: true }
    ];

    await Category.insertMany(categories);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
