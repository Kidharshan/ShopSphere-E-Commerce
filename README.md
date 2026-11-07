# ShopSphere - MERN Full Stack E-Commerce Application

A comprehensive full stack E-commerce application built for academic assessment, implementing all core syllabus requirements for a 2nd year Computer Science MERN project.

## 📋 Project Overview & Architecture

- **Frontend**: React 19 with Vite, `react-router-dom` for role-based routing, controlled forms with `event.preventDefault()`, and React Context API for state management (`AuthContext` and `CartContext`).
- **Backend**: Node.js & Express.js with clean modular architecture separating `routes`, `controllers`, `middleware`, `models`, and `config`.
- **Database**: MongoDB Atlas with 7 Mongoose schemas, data validation, compound indexes, and relational ObjectId referencing (`User`, `Product`, `Category`, `Cart`, `Order`, `Review`, `Coupon`). Includes local fallback in-memory store for instant zero-config evaluation.
- **Security**: JWT (JSON Web Tokens) with Bearer authentication header, `bcryptjs` password hashing (10 salt rounds), and role-based access control (RBAC).

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ecommerce.edu` | `admin123` | Full CRUD on products, categories, orders, coupons, users & analytics dashboard |
| **Customer** | `customer@ecommerce.edu` | `user123` | Browse catalog, cart management, checkout, promo discounts, tracking & reviews |

*(Note: The login page includes 1-click quick-fill buttons for immediate evaluation without typing!)*

---

## 🏷️ Test Coupons

| Coupon Code | Discount | Minimum Cart Spend | Maximum Discount Cap |
| :--- | :--- | :--- | :--- |
| `WELCOME10` | 10% OFF | $30.00 | $20.00 |
| `STUDENT20` | 20% OFF | $50.00 | $40.00 |
| `FLAT15` | 15% OFF | $40.00 | $25.00 |

---

## 🗄️ Mongoose Data Models (7 Models)

1. **User (`users`)**: Full name, unique email (indexed), bcrypt password hash, role (`admin` \| `customer`), shipping address, phone.
2. **Product (`products`)**: Name, description, price, category (Ref `Category`), brand, stock inventory, image URL, rating (1-5), review count, featured flag.
3. **Category (`categories`)**: Name, slug (indexed), description, banner image.
4. **Cart (`carts`)**: User (Ref `User`), array of items with quantities and unit prices, subtotal calculation.
5. **Order (`orders`)**: User ref, snapshot of purchased items, shipping address, payment method, item subtotal, coupon discount, shipping price, total price, status pipeline (`Pending` → `Processing` → `Shipped` → `Delivered`), timestamps.
6. **Review (`reviews`)**: Product ref, User ref, reviewer name, rating (1-5), comment, auto-recalculates product average rating.
7. **Coupon (`coupons`)**: Code (unique uppercase, indexed), discount percentage, minimum spend bounds, maximum discount cap, expiry date, active boolean.

*(An interactive visual ER diagram is available directly inside the app navigation bar via the **Mongoose ER Diagram** button)*

---

## 🚀 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new customer or admin account
- `POST /api/auth/login` - Authenticate credentials and return JWT token
- `GET /api/auth/profile` - Get logged-in user profile (JWT protected)
- `PUT /api/auth/profile` - Update user address/phone (JWT protected)

### Products (`/api/products`)
- `GET /api/products` - Catalog search, category filter, price bounds, sorting, pagination
- `GET /api/products/:id` - Product details with reviews
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product & inventory stock (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories (`/api/categories`)
- `GET /api/categories` - List all store categories
- `POST /api/categories` - Create new category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Remove category (Admin only)

### Cart (`/api/cart`)
- `GET /api/cart` - Fetch user's cart from database
- `PUT /api/cart` - Update entire cart items list
- `POST /api/cart/add` - Add single item with inventory stock check
- `DELETE /api/cart/item/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear user's cart

### Orders (`/api/orders`)
- `POST /api/orders` - Checkout & place order (validates stock, deducts inventory, applies coupon)
- `GET /api/orders/myorders` - Customer's past orders and tracking history
- `GET /api/orders/:id` - Detailed order receipt
- `GET /api/orders` - View all store orders (Admin only)
- `PUT /api/orders/:id/status` - Advance order status in fulfillment pipeline (Admin only)

### Coupons (`/api/coupons`)
- `POST /api/coupons/validate` - Validate coupon code, check bounds & calculate discount
- `GET /api/coupons/active` - List active coupons for checkout preview
- `GET /api/coupons` - List all coupons (Admin only)
- `POST /api/coupons` - Create new coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon bounds or toggle active (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)

### Admin Analytics (`/api/reports`)
- `GET /api/reports/dashboard` - Total revenue, orders, registered users, category sales, low-stock inventory alerts

### Postman Collection (`/api/postman`)
- `GET /api/postman` - Returns full Postman Collection v2.1.0 JSON format for automated testing

---

## 🛠️ Local Development & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables** (see `.env.example`):
   ```env
   PORT=3000
   JWT_SECRET=college_student_mern_secret_key_2025
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce
   ```
   *(If `MONGODB_URI` is left blank, the built-in Mongoose memory store runs automatically with pre-seeded products, users, categories, orders, and coupons!)*
3. **Start Full Stack Server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```
