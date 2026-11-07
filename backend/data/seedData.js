// ==============================================================
// SEED DATA FOR MERN E-COMMERCE COLLEGE PROJECT
// Contains sample users (Admin & Customer), categories, products,
// coupons, reviews, and sample orders for testing and grading.
// ==============================================================

export const initialCategories = [
  {
    _id: "cat_1",
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    description: "Laptops, audio, accessories, and smart devices for tech enthusiasts.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80"
  },
  {
    _id: "cat_2",
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    description: "Trendy clothes, streetwear, footwear, and casual essentials.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80"
  },
  {
    _id: "cat_3",
    name: "Home & Study Essentials",
    slug: "home-study-essentials",
    description: "Desks, lamps, stationery, and organizers built for productive study.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80"
  },
  {
    _id: "cat_4",
    name: "Campus Books & Guides",
    slug: "campus-books-guides",
    description: "Engineering textbooks, coding handbooks, and reference manuals.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
  }
];

export const initialProducts = [
  {
    _id: "prod_1",
    name: "Wireless Noise-Cancelling Headphones Pro",
    description: "High-fidelity active noise cancellation, 40-hour battery life, ergonomic memory foam ear cushions, and ultra-low latency audio for coding and studying.",
    price: 89.99,
    category: "cat_1",
    categoryName: "Electronics & Gadgets",
    brand: "SoundWave",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
    rating: 4.8,
    numReviews: 14,
    isFeatured: true
  },
  {
    _id: "prod_2",
    name: "Ergonomic Mechanical Keyboard (RGB)",
    description: "Tactile mechanical switches, customizable RGB backlighting, detachable braided USB-C cable, and durable PBT keycaps ideal for programmers.",
    price: 64.50,
    category: "cat_1",
    categoryName: "Electronics & Gadgets",
    brand: "KeyCrafter",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80",
    rating: 4.7,
    numReviews: 9,
    isFeatured: true
  },
  {
    _id: "prod_3",
    name: "Ultra-Lightweight Minimalist Laptop Backpack",
    description: "Water-resistant ballistic nylon, dedicated 15.6-inch padded laptop sleeve, hidden anti-theft zipper, and external USB passthrough port.",
    price: 45.00,
    category: "cat_2",
    categoryName: "Fashion & Apparel",
    brand: "UrbanPack",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80",
    rating: 4.6,
    numReviews: 8,
    isFeatured: true
  },
  {
    _id: "prod_4",
    name: "Smart LED Study Desk Lamp with Wireless Charger",
    description: "3 color temperature modes, 5 brightness levels, flicker-free eye care technology, and a 10W fast wireless charging base for smartphones.",
    price: 32.99,
    category: "cat_3",
    categoryName: "Home & Study Essentials",
    brand: "Lumina",
    stock: 4, // low stock alert for admin dashboard!
    imageUrl: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=700&auto=format&fit=crop&q=80",
    rating: 4.5,
    numReviews: 6,
    isFeatured: false
  },
  {
    _id: "prod_5",
    name: "Full Stack Web Development Handbook (2025 Edition)",
    description: "A comprehensive reference guide covering React 19, Node.js, Express, MongoDB, RESTful APIs, authentication, and modern full-stack best practices.",
    price: 29.50,
    category: "cat_4",
    categoryName: "Campus Books & Guides",
    brand: "CS Press",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=700&auto=format&fit=crop&q=80",
    rating: 4.9,
    numReviews: 21,
    isFeatured: true
  },
  {
    _id: "prod_6",
    name: "Classic Heavyweight Cotton Campus Hoodie",
    description: "Plush 100% combed cotton blend, double-stitched kangaroo pocket, ribbed cuffs, and unisex relaxed fit perfect for cool evenings.",
    price: 39.99,
    category: "cat_2",
    categoryName: "Fashion & Apparel",
    brand: "CampusThreads",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&auto=format&fit=crop&q=80",
    rating: 4.4,
    numReviews: 5,
    isFeatured: false
  },
  {
    _id: "prod_7",
    name: "Portable 2TB NVMe USB-C Solid State Drive",
    description: "Blazing fast read/write speeds up to 1050 MB/s, shock-resistant anodized aluminum enclosure, and universal compatibility with Mac, Windows, and Linux.",
    price: 119.00,
    category: "cat_1",
    categoryName: "Electronics & Gadgets",
    brand: "DataVault",
    stock: 3, // low stock alert!
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=700&auto=format&fit=crop&q=80",
    rating: 4.9,
    numReviews: 18,
    isFeatured: true
  },
  {
    _id: "prod_8",
    name: "Insulated Stainless Steel Water Bottle (750ml)",
    description: "Double-walled vacuum insulation keeps drinks ice cold for 24 hours or steaming hot for 12 hours. BPA-free leak-proof lid with carry loop.",
    price: 18.50,
    category: "cat_3",
    categoryName: "Home & Study Essentials",
    brand: "HydroPeak",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&auto=format&fit=crop&q=80",
    rating: 4.6,
    numReviews: 11,
    isFeatured: false
  }
];

export const initialCoupons = [
  {
    _id: "coupon_1",
    code: "WELCOME10",
    discountPercentage: 10,
    minPurchaseAmount: 30,
    maxDiscount: 20,
    expiryDate: "2026-12-31",
    isActive: true,
    description: "10% off on orders above $30 (New Customers)"
  },
  {
    _id: "coupon_2",
    code: "STUDENT20",
    discountPercentage: 20,
    minPurchaseAmount: 50,
    maxDiscount: 40,
    expiryDate: "2026-12-31",
    isActive: true,
    description: "20% student discount for study supplies & tech"
  },
  {
    _id: "coupon_3",
    code: "FLAT15",
    discountPercentage: 15,
    minPurchaseAmount: 40,
    maxDiscount: 25,
    expiryDate: "2026-12-31",
    isActive: true,
    description: "15% off site-wide on orders over $40"
  }
];

export const initialReviews = [
  {
    _id: "rev_1",
    product: "prod_1",
    user: "user_customer",
    userName: "Alex Johnson",
    rating: 5,
    comment: "The noise cancellation is phenomenal during long study sessions in the campus library. Battery lasts all week!",
    createdAt: "2025-10-14T10:30:00Z"
  },
  {
    _id: "rev_2",
    product: "prod_1",
    user: "user_reviewer2",
    userName: "Maya Lin",
    rating: 4,
    comment: "Great sound quality and bass response. Very comfortable around the ears even with glasses.",
    createdAt: "2025-10-22T14:15:00Z"
  },
  {
    _id: "rev_3",
    product: "prod_2",
    user: "user_customer",
    userName: "Alex Johnson",
    rating: 5,
    comment: "Typing code on this feels so crisp and satisfying. RGB lights look great on my dorm desk.",
    createdAt: "2025-11-01T09:45:00Z"
  },
  {
    _id: "rev_4",
    product: "prod_5",
    user: "user_customer",
    userName: "Alex Johnson",
    rating: 5,
    comment: "This book explained REST APIs and MERN authentication clearer than my university syllabus!",
    createdAt: "2025-11-02T16:20:00Z"
  }
];

export const initialOrders = [
  {
    _id: "ord_1001",
    user: "user_customer",
    userName: "Alex Johnson",
    userEmail: "customer@ecommerce.edu",
    orderItems: [
      {
        product: "prod_1",
        name: "Wireless Noise-Cancelling Headphones Pro",
        quantity: 1,
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80"
      },
      {
        product: "prod_5",
        name: "Full Stack Web Development Handbook (2025 Edition)",
        quantity: 1,
        price: 29.50,
        image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=700&auto=format&fit=crop&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Alex Johnson",
      address: "North Quad Hall, Dorm 402, Campus Way",
      city: "Boston",
      postalCode: "02115",
      country: "United States"
    },
    paymentMethod: "Credit Card",
    itemsPrice: 119.49,
    discountAmount: 11.95,
    shippingPrice: 0.00,
    totalPrice: 107.54,
    couponCode: "WELCOME10",
    isPaid: true,
    paidAt: "2025-11-03T11:20:00Z",
    status: "Shipped",
    createdAt: "2025-11-03T11:15:00Z"
  },
  {
    _id: "ord_1002",
    user: "user_customer",
    userName: "Alex Johnson",
    userEmail: "customer@ecommerce.edu",
    orderItems: [
      {
        product: "prod_3",
        name: "Ultra-Lightweight Minimalist Laptop Backpack",
        quantity: 1,
        price: 45.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Alex Johnson",
      address: "North Quad Hall, Dorm 402, Campus Way",
      city: "Boston",
      postalCode: "02115",
      country: "United States"
    },
    paymentMethod: "PayPal",
    itemsPrice: 45.00,
    discountAmount: 0.00,
    shippingPrice: 5.00,
    totalPrice: 50.00,
    couponCode: null,
    isPaid: true,
    paidAt: "2025-11-05T08:10:00Z",
    status: "Processing",
    createdAt: "2025-11-05T08:00:00Z"
  }
];
