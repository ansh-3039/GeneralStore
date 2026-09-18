# BharatStore - Modern MERN E-Commerce Platform

A full-stack Indian e-commerce application inspired by **Flipkart's UI and shopping experience**, featuring:
- **Flipkart-style 2-column mobile product grid**, horizontal category scroll, and responsive touch drawer.
- **No Email requirement for customers**: Indian mobile phone number is the primary contact identifier.
- **Cash on Delivery (COD) Checkout** with complete Indian address format (City, State, Pincode, Landmark).
- **Live Order Tracking**: Interactive step-by-step order progress timeline (`PLACED` -> `CONFIRMED` -> `PACKED` -> `SHIPPED` -> `DELIVERED`).
- **Secure Admin Dashboard**: Only authenticated admin with JWT tokens can add products, manage categories, change prices/stock, and update order statuses.
- **Backend security**: Rate limiting, Helmet headers, CORS, bcrypt password hashing, and DB stock/price verification.

---

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM, Axios, Zustand
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Bcrypt, Multer, Helmet, Express-Rate-Limit

---

## 📁 Project Structure

```
GeneralStore/
├── backend/
│   ├── controllers/       # Route controllers (Admin, Category, Product, Order)
│   ├── middleware/        # Auth (JWT) & Upload (Multer) middleware
│   ├── models/            # Mongoose schemas (Admin, Category, Customer, Product, Order)
│   ├── routes/            # Express routes
│   ├── uploads/           # Product image storage
│   ├── .env               # Environment variables (configured with MongoDB URI)
│   ├── .env.example       # Sample environment template
│   ├── seed.js            # Initial database seed script
│   └── server.js          # Express app entry point
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Header, Footer, ProductCard)
    │   ├── pages/
    │   │   ├── customer/  # Home, ProductDetails, Cart, Checkout, OrderSuccess, TrackOrder
    │   │   └── admin/     # AdminLogin, AdminLayout, Dashboard, Products, Categories, Orders
    │   ├── store/         # Zustand state (cartStore, authStore)
    │   ├── App.jsx        # App routes setup
    │   └── main.jsx       # Entry point
    └── vite.config.js     # Vite configuration with API proxy
```

---

## 🛠️ Getting Started & Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

Make sure your `.env` file is configured:
```env
PORT=5000
MONGO_URI=mongodb+srv://anshkesharwaninaini_db_user:DkRkQh8fU1OfUgrR@cluster0.3sb1mfw.mongodb.net/?appName=Cluster0
JWT_SECRET=supersecret_ecommerce_key_change_in_production
NODE_ENV=development
```

#### Run Database Seed Script
Populate initial categories and the default Admin user (`admin@example.com` / `password123`):
```bash
node seed.js
```

#### Start Backend Server
```bash
npm run dev
# or
node server.js
```
*Server runs on port `5000`.*

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:3000`.*

---

## 🔑 Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `password123`
- **Login URL**: `http://localhost:3000/admin/login`

---

## 🌐 Deploying to Vercel

The repository is pre-configured with `vercel.json` for one-click deployment of both the React frontend and Express backend.

### Option A: Via Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In **Environment Variables**, add the following keys:
   - `MONGO_URI`: `mongodb+srv://anshkesharwaninaini_db_user:DkRkQh8fU1OfUgrR@cluster0.3sb1mfw.mongodb.net/?appName=Cluster0`
   - `JWT_SECRET`: `supersecret_ecommerce_key_change_in_production`
   - `NODE_ENV`: `production`
4. Click **Deploy**. Vercel will build the frontend and deploy the backend serverless function automatically!

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy directly from workspace root
vercel
```
Follow the prompts and add your environment variables (`MONGO_URI`, `JWT_SECRET`).

---

## 🧪 Testing the Complete E-Commerce Flow

1. **Admin Login**: Go to `/admin/login`, log in with `admin@example.com` / `password123`.
2. **Add Products**: Go to **Products** in the admin sidebar, click **Add New Product**, upload image(s), set selling price, MRP, category, and stock quantity.
3. **Customer Browsing**: Go to `/`, view the product grid on desktop or mobile. Click on a product card to inspect full details, quantity selector, and description.
4. **Cart & Checkout**: Click **Add to Cart**, then proceed to `/cart` and `/checkout`. Enter name, 10-digit Indian mobile number, and address details. Click **CONFIRM ORDER (COD)**.
5. **Order Verification & Stock Reduction**: MongoDB records the order snapshot and automatically decrements product stock.
6. **Order Tracking**: Go to `/track`, enter the Order ID and Phone number to view live status.
7. **Admin Status Update**: Log in to Admin, go to **Orders**, update status from `PLACED` to `CONFIRMED` / `SHIPPED` / `DELIVERED`. Notice the updated step timeline when refreshing `/track`.
