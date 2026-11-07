// ==============================================================
// POSTMAN COLLECTION EXPORT SPECIFICATION
// File: backend/data/postmanCollection.js
// Standard Postman Collection v2.1.0 for REST API evaluation
// ==============================================================

export const postmanCollectionData = {
  info: {
    name: "ShopSphere - MERN E-Commerce REST API",
    _postman_id: "7b47e5fb-a89e-4a6c-94df-74f85b88139a",
    description: "Complete REST API collection for MERN E-commerce college project. Covers User Auth, Products, Categories, Cart, Orders, Reviews, Coupons, and Admin Analytics.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    {
      name: "1. Authentication",
      item: [
        {
          name: "Register Customer",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Alex Student",
                email: "alex@college.edu",
                password: "password123",
                role: "customer"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/auth/register", host: ["{{baseUrl}}"], path: ["api", "auth", "register"] }
          }
        },
        {
          name: "Login User (Admin or Customer)",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "admin@ecommerce.edu",
                password: "admin123"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
          }
        },
        {
          name: "Get User Profile",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/auth/profile", host: ["{{baseUrl}}"], path: ["api", "auth", "profile"] }
          }
        }
      ]
    },
    {
      name: "2. Products & Catalogue",
      item: [
        {
          name: "Get Products (with Filter, Search, Pagination)",
          request: {
            method: "GET",
            url: {
              raw: "{{baseUrl}}/api/products?search=headphones&page=1&limit=10&sort=newest",
              host: ["{{baseUrl}}"],
              path: ["api", "products"],
              query: [
                { key: "search", value: "headphones" },
                { key: "page", value: "1" },
                { key: "limit", value: "10" },
                { key: "sort", value: "newest" }
              ]
            }
          }
        },
        {
          name: "Get Product by ID",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/api/products/prod_1", host: ["{{baseUrl}}"], path: ["api", "products", "prod_1"] }
          }
        },
        {
          name: "Create Product (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{adminToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Smart Fitness Tracker Band",
                description: "Heart rate monitoring, waterproof, sleep tracking, 14-day battery life.",
                price: 49.99,
                category: "cat_1",
                brand: "FitTech",
                stock: 20,
                imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/products", host: ["{{baseUrl}}"], path: ["api", "products"] }
          }
        }
      ]
    },
    {
      name: "3. Categories",
      item: [
        {
          name: "Get All Categories",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
          }
        },
        {
          name: "Create Category (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{adminToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Sports & Fitness",
                description: "Campus athletics, gym gear, and sports equipment."
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
          }
        }
      ]
    },
    {
      name: "4. Shopping Cart",
      item: [
        {
          name: "Get User Cart",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/cart", host: ["{{baseUrl}}"], path: ["api", "cart"] }
          }
        },
        {
          name: "Add Item to Cart",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ productId: "prod_1", quantity: 1 }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/cart/add", host: ["{{baseUrl}}"], path: ["api", "cart", "add"] }
          }
        }
      ]
    },
    {
      name: "5. Checkout & Orders",
      item: [
        {
          name: "Validate Coupon Code",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ code: "WELCOME10", amount: 100 }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/coupons/validate", host: ["{{baseUrl}}"], path: ["api", "coupons", "validate"] }
          }
        },
        {
          name: "Place New Order",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                orderItems: [{ product: "prod_1", quantity: 1 }],
                shippingAddress: {
                  fullName: "Alex Student",
                  address: "Room 101, Campus Dorms",
                  city: "Boston",
                  postalCode: "02115",
                  country: "United States"
                },
                paymentMethod: "Credit Card",
                couponCode: "WELCOME10"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/orders", host: ["{{baseUrl}}"], path: ["api", "orders"] }
          }
        },
        {
          name: "Get My Orders (Customer History)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/orders/myorders", host: ["{{baseUrl}}"], path: ["api", "orders", "myorders"] }
          }
        },
        {
          name: "Update Order Status (Admin)",
          request: {
            method: "PUT",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{adminToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "Delivered" }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/orders/ord_1001/status", host: ["{{baseUrl}}"], path: ["api", "orders", "ord_1001", "status"] }
          }
        }
      ]
    },
    {
      name: "6. Admin Reports & Analytics",
      item: [
        {
          name: "Get Summary Dashboard Stats",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/api/reports/dashboard", host: ["{{baseUrl}}"], path: ["api", "reports", "dashboard"] }
          }
        }
      ]
    }
  ]
};
