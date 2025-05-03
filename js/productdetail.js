// Product data - would typically come from a backend API
// Using the same product data as inventory.js for consistency
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 199.99,
        rating: 4.5,
        reviews: 124,
        category: "electronics",
        image: "assets/placeholder.jpg",
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
        category: "electronics",
        image: "assets/placeholder.jpg",
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
        category: "clothing",
        image: "assets/placeholder.jpg",
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
        category: "home",
        image: "assets/placeholder.jpg",
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
        category: "accessories",
        image: "assets/placeholder.jpg",
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
    }
];

// DOM Elements
const productTitle = document.getElementById('detail-product-name');
const productPrice = document.getElementById('detail-product-price');
const productDescription = document.getElementById('detail-product-description');
const productFullDescription = document.getElementById('full-product-description');
const productRating = document.getElementById('detail-product-stars');
const productReviews = document.getElementById('detail-product-reviews');
const productSku = document.getElementById('product-sku');
const productCategory = document.getElementById('product-category');
const productAvailability = document.getElementById('product-availability');
const productBadge = document.getElementById('product-badge');
const breadcrumbProduct = document.getElementById('breadcrumb-product');
const pageTitle = document.getElementById('product-title');
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const qtyInput = document.getElementById('product-quantity');
const qtyBtns = document.querySelectorAll('.qty-btn');
const addToCartBtn = document.getElementById('detail-add-to-cart');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const relatedProductsContainer = document.getElementById('related-products-container');
const specificationsList = document.querySelector('#specifications-tab .specs-table');
const ratingInputStars = document.querySelectorAll('.rating-input .fa-star');
const reviewForm = document.querySelector('.review-form');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const overlay = document.querySelector('.overlay');

// State
let cart = [];
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let selectedRating = 0;
let quantity = 1;

// Initialize the page
function init() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // If no ID provided, use the first product as a default
    currentProduct = products.find(p => p.id === productId) || products[0];
    
    if (currentProduct) {
        renderProductDetails();
        setupEventListeners();
        loadRelatedProducts();
        loadFromLocalStorage();
        updateCart();
    } else {
        // Handle product not found
        productTitle.textContent = 'Product Not Found';
        productDescription.textContent = 'The requested product could not be found.';
        addToCartBtn.disabled = true;
    }
}

// Render product details on the page
function renderProductDetails() {
    // Update page title and breadcrumb
    document.title = `ShopEase - ${currentProduct.name}`;
    pageTitle.textContent = currentProduct.name;
    breadcrumbProduct.textContent = currentProduct.name;
    
    // Set basic product info
    productTitle.textContent = currentProduct.name;
    productPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
    productDescription.textContent = currentProduct.description;
    productFullDescription.textContent = currentProduct.description;
    productReviews.textContent = `(${currentProduct.reviews} Reviews)`;
    productSku.textContent = currentProduct.sku;
    productCategory.textContent = currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1);
    
    // Set product rating stars
    productRating.innerHTML = generateStarRating(currentProduct.rating);
    
    // Set availability
    if (currentProduct.availability) {
        productAvailability.textContent = 'In Stock';
        productAvailability.className = 'in-stock';
        addToCartBtn.disabled = false;
    } else {
        productAvailability.textContent = 'Out of Stock';
        productAvailability.className = 'out-of-stock';
        addToCartBtn.disabled = true;
    }
    
    // Set badge if exists
    if (currentProduct.badge) {
        productBadge.textContent = currentProduct.badge;
        productBadge.className = `product-badge ${currentProduct.badge}`;
        productBadge.style.display = 'block';
    } else {
        productBadge.style.display = 'none';
    }
    
    // Set color options
    if (currentProduct.colors && currentProduct.colors.length > 0) {
        document.querySelector('.variation-group:first-child').style.display = 'block';
        selectedColor = currentProduct.colors[0]; // Default to first color
        
        // Update color buttons to match product colors
        colorOptions.forEach((option, index) => {
            if (index < currentProduct.colors.length) {
                const color = currentProduct.colors[index];
                option.style.display = 'block';
                option.dataset.color = color;
                
                // Set background color
                switch(color) {
                    case 'black':
                        option.style.backgroundColor = '#000';
                        break;
                    case 'white':
                        option.style.backgroundColor = '#fff';
                        option.style.border = '1px solid #ddd';
                        break;
                    case 'blue':
                        option.style.backgroundColor = '#0057ff';
                        break;
                    case 'red':
                        option.style.backgroundColor = '#ff0000';
                        break;
                    case 'gray':
                        option.style.backgroundColor = '#888';
                        break;
                    case 'silver':
                        option.style.backgroundColor = '#c0c0c0';
                        break;
                    case 'rose gold':
                        option.style.backgroundColor = '#e0bfb8';
                        break;
                    case 'brown':
                        option.style.backgroundColor = '#964b00';
                        break;
                    case 'tan':
                        option.style.backgroundColor = '#d2b48c';
                        break;
                    case 'stainless steel':
                        option.style.backgroundColor = '#b3b3b3';
                        break;
                    default:
                        option.style.backgroundColor = color;
                }
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        document.querySelector('.variation-group:first-child').style.display = 'none';
    }
    
    // Set size options
    if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        document.querySelector('.variation-group:last-child').style.display = 'block';
        selectedSize = currentProduct.sizes[0]; // Default to first size
        
        // Update size buttons
        sizeOptions.forEach((option, index) => {
            if (index < currentProduct.sizes.length) {
                option.style.display = 'block';
                option.textContent = currentProduct.sizes[index].toUpperCase();
                if (index === 0) option.classList.add('active');
                else option.classList.remove('active');
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        document.querySelector('.variation-group:last-child').style.display = 'none';
    }
    
    // Populate specifications tab
    let specHtml = '';
    if (currentProduct.specifications) {
        for (const [key, value] of Object.entries(currentProduct.specifications)) {
            specHtml += `
                <tr>
                    <th>${key}</th>
                    <td>${value}</td>
                </tr>
            `;
        }
        specificationsList.innerHTML = specHtml;
    }
}

// Generate HTML for star ratings
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

// Setup all event listeners
function setupEventListeners() {
    // Quantity buttons
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', handleQuantity);
    });
    
    // Color options
    colorOptions.forEach(option => {
        option.addEventListener('click', handleColorSelection);
    });
    
    // Size options
    sizeOptions.forEach(option => {
        option.addEventListener('click', handleSizeSelection);
    });
    
    // Add to cart button
    addToCartBtn.addEventListener('click', handleAddToCart);
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabChange);
    });
    
    // Rating input stars
    ratingInputStars.forEach(star => {
        star.addEventListener('click', handleRatingInput);
        star.addEventListener('mouseover', handleRatingHover);
    });
    document.querySelector('.rating-input').addEventListener('mouseout', function() {
        updateRatingStars(selectedRating);
    });
    
    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmission);
    }
    
    // Cart
    closeCartBtn.addEventListener('click', closeCart);
    document.querySelector('.cart-icon').addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    // Thumbnail gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Overlay
    overlay.addEventListener('click', () => {
        closeCart();
        navLinks.classList.remove('active');
    });
}

// Handle quantity changes
function handleQuantity(e) {
    const isPlus = e.currentTarget.classList.contains('plus');
    let qty = parseInt(qtyInput.value);
    
    if (isPlus) {
        qty++;
    } else {
        qty = Math.max(1, qty - 1); // Don't go below 1
    }
    
    qtyInput.value = qty;
    quantity = qty;
}

// Handle color selection
function handleColorSelection(e) {
    colorOptions.forEach(option => option.classList.remove('active'));
    e.currentTarget.classList.add('active');
    selectedColor = e.currentTarget.dataset.color;
}

// Handle size selection
function handleSizeSelection(e) {
    sizeOptions.forEach(option => option.classList.remove('active'));
    e.currentTarget.classList.add('active');
    selectedSize = e.currentTarget.textContent;
}

// Handle tab changes
function handleTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    
    // Update active tab button
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Update active tab panel
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Handle rating input in review form
function handleRatingInput(e) {
    const rating = parseInt(e.currentTarget.dataset.rating);
    selectedRating = rating;
    updateRatingStars(rating);
}

// Handle hovering over rating stars
function handleRatingHover(e) {
    const rating = parseInt(e.currentTarget.dataset.rating);
    updateRatingStars(rating, true);
}

// Update the visual stars in the rating input
function updateRatingStars(rating, isHover = false) {
    ratingInputStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Handle review form submission
function handleReviewSubmission(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('reviewer-name').value;
    const email = document.getElementById('reviewer-email').value;
    const content = document.getElementById('review-content').value;
    
    // Validate
    if (!name || !email || !content || selectedRating === 0) {
        showNotification('Please fill all fields and provide a rating', 'warning');
        return;
    }
    
    // In a real application, this would send the data to a server
    // For demo purposes, we'll just show a success message
    showNotification('Your review has been submitted successfully!', 'success');
    
    // Reset the form
    document.getElementById('reviewer-name').value = '';
    document.getElementById('reviewer-email').value = '';
    document.getElementById('review-content').value = '';
    selectedRating = 0;
    updateRatingStars(0);
}

// Handle adding to cart
function handleAddToCart() {
    if (!currentProduct || !currentProduct.availability) return;
    
    let variantInfo = '';
    if (selectedColor) variantInfo += ` - Color: ${selectedColor}`;
    if (selectedSize) variantInfo += ` - Size: ${selectedSize}`;
    
    const productToAdd = {
        id: currentProduct.id,
        name: currentProduct.name + variantInfo,
        price: currentProduct.price,
        quantity: quantity
    };
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(item => 
        item.id === productToAdd.id && 
        item.name === productToAdd.name
    );
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(productToAdd);
    }
    
    updateCart();
    showNotification(`${currentProduct.name} added to cart!`);
    saveToLocalStorage();
}

// Load related products
function loadRelatedProducts() {
    if (!currentProduct) return;
    
    // Find products in the same category (excluding current product)
    const related = products.filter(p => 
        p.category === currentProduct.category && 
        p.id !== currentProduct.id
    );
    
    // If not enough in same category, add some from other categories
    if (related.length < 4) {
        const additional = products.filter(p => 
            p.category !== currentProduct.category && 
            p.id !== currentProduct.id
        ).slice(0, 4 - related.length);
        
        related.push(...additional);
    }
    
    // Limit to 4 products
    const limitedRelated = related.slice(0, 4);
    
    // Render related products
    relatedProductsContainer.innerHTML = '';
    
    limitedRelated.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<span class="product-badge ${product.badge}">${product.badge}</span>`;
        }
        
        const stars = generateStarRating(product.rating);
        
        productCard.innerHTML = `
            <div class="product-image">
                ${badgeHtml}
                <div class="image-placeholder"></div>
                <a href="productdetail.html?id=${product.id}" class="quick-view-btn">View Details</a>
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span>(${product.reviews} Reviews)</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" ${!product.availability ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> ${product.availability ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `;
        
        relatedProductsContainer.appendChild(productCard);
    });
    
    // Add event listeners to related products' "Add to Cart" buttons
    document.querySelectorAll('#related-products-container .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleRelatedProductAddToCart);
    });
}

// Handle adding related products to cart
function handleRelatedProductAddToCart(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product || !product.availability) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
    saveToLocalStorage();
}

// Cart functionality
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    
    // Calculate total
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <div class="image-placeholder"></div>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}" data-name="${item.name}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}" data-name="${item.name}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}" data-name="${item.name}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    totalAmount.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons and remove button
    document.querySelectorAll('.cart-item .qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.cart-item .qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeCartItem);
    });
}

function decreaseQuantity(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    const cartItem = cart.find(item => 
        item.id === productId && 
        item.name === productName
    );
    
    if (cartItem) {
        cartItem.quantity--;
        
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => 
                !(item.id === productId && item.name === productName)
            );
        }
        
        updateCart();
        saveToLocalStorage();
    }
}

function increaseQuantity(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    const cartItem = cart.find(item => 
        item.id === productId && 
        item.name === productName
    );
    
    if (cartItem) {
        cartItem.quantity++;
        updateCart();
        saveToLocalStorage();
    }
}

function removeCartItem(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    cart = cart.filter(item => 
        !(item.id === productId && item.name === productName)
    );
    
    updateCart();
    showNotification(`Item removed from cart.`);
    saveToLocalStorage();
}

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function handleCheckout() {
    if (cart.length === 0) return;
    
    // Just for demo, we'll clear the cart and show notification
    showNotification('Order placed successfully!', 'success');
    cart = [];
    updateCart();
    closeCart();
    saveToLocalStorage();
}

// Show notification
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Theme toggle functionality
// function toggleTheme() {
//     const htmlElement = document.documentElement;
//     const themeIcon = document.querySelector('#theme-toggle i');
    
//     if (htmlElement.getAttribute('data-theme') === 'dark') {
//         htmlElement.removeAttribute('data-theme');
//         themeIcon.classList.remove('fa-sun');
//         themeIcon.classList.add('fa-moon');
//         localStorage.setItem('theme', 'light');
//     } else {
//         htmlElement.setAttribute('data-theme', 'dark');
//         themeIcon.classList.remove('fa-moon');
//         themeIcon.classList.add('fa-sun');
//         localStorage.setItem('theme', 'dark');
//     }
// }

// Save state to localStorage
function saveToLocalStorage() {
    localStorage.setItem('shopEaseCart', JSON.stringify(cart));
}

// Load state from localStorage
// function loadFromLocalStorage() {
//     const savedTheme = localStorage.getItem('theme');
//     const themeIcon = document.querySelector('#theme-toggle i');
    
//     if (savedTheme === 'dark') {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         themeIcon.classList.remove('fa-moon');
//         themeIcon.classList.add('fa-sun');
//     }
    
//     // Load cart
//     const savedCart = localStorage.getItem('shopEaseCart');
//     if (savedCart) {
//         cart = JSON.parse(savedCart);
//     }
// }

// Add CSS for notifications and other dynamic elements
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius-md);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.success {
            background-color: var(--success-color, #4CAF50);
        }
        
        .notification.warning {
            background-color: var(--warning-color, #FF9800);
        }
        
        .notification.error {
            background-color: var(--error-color, #F44336);
        }
        
        .product-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border-radius: var(--border-radius-sm);
            color: white;
            z-index: 1;
        }
        
        .product-badge.bestseller {
            background-color: var(--success-color, #4CAF50);
        }
        
        .product-badge.new {
            background-color: var(--primary-color);
        }
        
        .product-badge.sale {
            background-color: var(--accent-color);
        }
        
        .in-stock {
            color: var(--success-color, #4CAF50);
        }
        
        .out-of-stock {
            color: var(--accent-color);
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    init();
});