/**
 * Product.js - Centralized product data management
 * This file contains the product data and related functions that will be used across the website
 */

// Product data - would typically come from an API/backend
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 199.99,
        rating: 4.5,
        reviews: 124,
        category: "Electronics",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Premium wireless headphones with noise cancellation and high-fidelity sound. Perfect for music lovers and professionals.",
        badge: "bestseller",
        sku: "EL12345",
        availability: true,
        colors: ["black", "white", "blue"],
        sizes: [], // NA for this product
        specifications: {
            "Bluetooth Version": "5.0",
            "Battery Life": "Up to 30 hours",
            "Noise Cancellation": "Active",
            "Weight": "250g",
            "Warranty": "2 years"
        }
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 249.99,
        rating: 4.2,
        reviews: 89,
        category: "Electronics",
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Feature-rich smartwatch with heart rate monitoring, GPS tracking, and a beautiful AMOLED display.",
        badge: "new",
        sku: "EL67890",
        availability: true,
        colors: ["black", "silver", "rose gold"],
        sizes: ["small", "medium", "large"],
        specifications: {
            "Display": "1.4\" AMOLED",
            "Battery Life": "Up to 7 days",
            "Water Resistance": "5 ATM",
            "Sensors": "Heart rate, Accelerometer, GPS",
            "Compatibility": "iOS 12+, Android 8.0+"
        }
    },
    {
        id: 3,
        name: "Casual T-shirt",
        price: 29.99,
        rating: 4.0,
        reviews: 210,
        category: "Clothing",
        image: "https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Comfortable cotton t-shirt for everyday wear. Available in multiple colors and sizes.",
        sku: "CL12345",
        availability: true,
        colors: ["black", "white", "blue", "red", "gray"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        specifications: {
            "Material": "100% Cotton",
            "Care": "Machine washable",
            "Style": "Crew neck",
            "Fit": "Regular",
            "Origin": "Made in USA"
        }
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 89.99,
        rating: 4.7,
        reviews: 156,
        category: "Home",
        image: "https://images.pexels.com/photos/6205791/pexels-photo-6205791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Programmable coffee maker with timer and multiple brew settings. Makes up to 12 cups.",
        sku: "HK45678",
        availability: true,
        colors: ["black", "white", "stainless steel"],
        sizes: [],
        specifications: {
            "Capacity": "12 cups",
            "Programmable": "Yes, 24-hour",
            "Settings": "Light, Medium, Bold",
            "Keep Warm": "2 hours auto-shutoff",
            "Warranty": "1 year"
        }
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 49.99,
        rating: 4.3,
        reviews: 78,
        category: "Accessories",
        image: "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Genuine leather wallet with multiple card slots and coin pocket. Slim design for comfort.",
        sku: "AC12345",
        availability: false,
        colors: ["brown", "black", "tan"],
        sizes: [],
        specifications: {
            "Material": "Genuine Leather",
            "Card Slots": "8",
            "Bill Compartments": "2",
            "Dimensions": "4.5\" x 3.5\"",
            "RFID Blocking": "Yes"
        }
    },
    {
        id: 6,
        name: "Wireless Earbuds",
        price: 149.99,
        rating: 4.4,
        reviews: 112,
        category: "Electronics",
        image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "True wireless earbuds with touch controls, water resistance, and long battery life.",
        badge: "sale",
        sku: "EL54321",
        availability: true,
        colors: ["black", "white", "blue"],
        sizes: [],
        specifications: {
            "Bluetooth Version": "5.2",
            "Battery Life": "Up to 24 hours with case",
            "Water Resistance": "IPX4",
            "Noise Cancellation": "Passive",
            "Warranty": "1 year"
        }
    },
    {
        id: 7,
        name: "Kitchen Blender",
        price: 79.99,
        rating: 4.1,
        reviews: 93,
        category: "Home",
        image: "https://images.pexels.com/photos/3209101/pexels-photo-3209101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Powerful blender with multiple speed settings and pulse function. Perfect for smoothies and soups.",
        sku: "HK78901",
        availability: true,
        colors: ["black", "white", "red"],
        sizes: [],
        specifications: {
            "Power": "1000W",
            "Capacity": "64 oz",
            "Speeds": "10 + Pulse",
            "Dishwasher Safe": "Yes",
            "Warranty": "3 years"
        }
    },
    {
        id: 8,
        name: "Denim Jacket",
        price: 69.99,
        rating: 4.6,
        reviews: 45,
        category: "Clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Classic denim jacket with a modern fit. Versatile and durable for everyday wear.",
        sku: "CL67890",
        availability: true,
        colors: ["blue", "black", "light blue"],
        sizes: ["S", "M", "L", "XL"],
        specifications: {
            "Material": "100% Cotton Denim",
            "Care": "Machine wash cold",
            "Style": "Button-up",
            "Fit": "Regular",
            "Pockets": "4 external"
        }
    },
    {
        id: 9,
        name: "Bluetooth Speaker",
        price: 129.99,
        rating: 4.8,
        reviews: 187,
        category: "Electronics",
        image: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Portable Bluetooth speaker with 360° sound and waterproof design. Perfect for outdoor activities.",
        badge: "bestseller",
        sku: "EL24680",
        availability: true,
        colors: ["black", "blue", "red"],
        sizes: [],
        specifications: {
            "Bluetooth Version": "5.0",
            "Battery Life": "Up to 12 hours",
            "Water Resistance": "IPX7",
            "Power Output": "30W",
            "Warranty": "2 years"
        }
    },
    {
        id: 10,
        name: "Yoga Mat",
        price: 35.99,
        rating: 4.3,
        reviews: 64,
        category: "Accessories",
        image: "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "High-density yoga mat with non-slip surface and carrying strap. Eco-friendly material.",
        sku: "AC13579",
        availability: true,
        colors: ["purple", "blue", "black", "pink"],
        sizes: [],
        specifications: {
            "Material": "TPE Foam",
            "Thickness": "6mm",
            "Dimensions": "72\" x 24\"",
            "Weight": "2.5 lbs",
            "Non-slip": "Yes"
        }
    },
    {
        id: 11,
        name: "Digital Camera",
        price: 499.99,
        rating: 4.7,
        reviews: 102,
        category: "Electronics",
        image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "20MP digital camera with 4K video recording, optical zoom, and built-in stabilization.",
        sku: "EL97531",
        availability: true,
        colors: ["black", "silver"],
        sizes: [],
        specifications: {
            "Resolution": "20 Megapixels",
            "Video": "4K @ 30fps",
            "Zoom": "10x Optical",
            "Storage": "SD Card (not included)",
            "Battery Life": "Approx. 350 shots"
        }
    },
    {
        id: 12,
        name: "Desk Lamp",
        price: 45.99,
        rating: 3.9,
        reviews: 58,
        category: "Home",
        image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Adjustable desk lamp with multiple brightness levels and color temperatures. USB charging port included.",
        sku: "HK24680",
        availability: true,
        colors: ["black", "white", "silver"],
        sizes: [],
        specifications: {
            "Power": "9W LED",
            "Color Temperatures": "3 settings",
            "Brightness Levels": "5 settings",
            "USB Ports": "1 x 2.1A",
            "Adjustable": "Yes, 360° flexible arm"
        }
    }
];

/**
 * Get all unique categories from products
 * @returns {Array} Array of unique categories
 */
function getCategories() {
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
}

/**
 * Get products by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered products
 */
function getProductsByCategory(category) {
    if (!category) return products;
    return products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get a product by ID
 * @param {number} id - Product ID
 * @returns {Object|null} Product object or null if not found
 */
function getProductById(id) {
    return products.find(product => product.id === parseInt(id)) || null;
}

/**
 * Search products by name
 * @param {string} query - Search query
 * @returns {Array} Matching products
 */
function searchProducts(query) {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

/**
 * Get related products (same category, excluding the current product)
 * @param {number} productId - Current product ID
 * @param {number} limit - Maximum number of related products to return
 * @returns {Array} Related products
 */
function getRelatedProducts(productId, limit = 4) {
    const currentProduct = getProductById(productId);
    if (!currentProduct) return [];
    
    return products
        .filter(product => 
            product.category === currentProduct.category && 
            product.id !== currentProduct.id
        )
        .slice(0, limit);
}

/**
 * Generate HTML for star ratings
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Export functions for use in other files
window.ProductService = {
    getAllProducts: () => products,
    getCategories,
    getProductsByCategory,
    getProductById,
    searchProducts,
    getRelatedProducts,
    generateStarRating
};