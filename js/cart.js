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
        description: "Premium wireless headphones with noise cancellation and high-fidelity sound.",
        badge: "bestseller",
        sku: "EL12345",
        availability: true
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 249.99,
        rating: 4.2,
        reviews: 89,
        category: "electronics",
        image: "assets/placeholder.jpg",
        description: "Feature-rich smartwatch with heart rate monitoring and GPS tracking.",
        badge: "new",
        sku: "EL67890",
        availability: true
    },
    {
        id: 3,
        name: "Casual T-shirt",
        price: 29.99,
        rating: 4.0,
        reviews: 210,
        category: "clothing",
        image: "assets/placeholder.jpg",
        description: "Comfortable cotton t-shirt for everyday wear.",
        sku: "CL12345",
        availability: true
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 89.99,
        rating: 4.7,
        reviews: 156,
        category: "home",
        image: "assets/placeholder.jpg",
        description: "Programmable coffee maker with multiple brew settings.",
        sku: "HK45678",
        availability: true
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 49.99,
        rating: 4.3,
        reviews: 78,
        category: "accessories",
        image: "assets/placeholder.jpg",
        description: "Genuine leather wallet with multiple card slots.",
        sku: "AC12345",
        availability: false
    }
];

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const taxAmount = document.getElementById('tax-amount');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const updateCartBtn = document.getElementById('update-cart');
const discountRow = document.getElementById('discount-row');
const discountAmount = document.getElementById('discount-amount');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponInput = document.getElementById('coupon-code');
const shippingOptions = document.querySelectorAll('input[name="shipping"]');
const recentlyViewedContainer = document.getElementById('recently-viewed-container');
const cartCount = document.querySelector('.cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const nextStepBtns = document.querySelectorAll('.next-step');
const prevStepBtns = document.querySelectorAll('.prev-step');
const closeCheckoutBtns = document.querySelectorAll('.close-checkout-btn');
const confirmationEmail = document.getElementById('confirmation-email');
const orderTotal = document.getElementById('order-total');
const orderNumber = document.getElementById('order-number');
const orderDate = document.getElementById('order-date');

// State
let cart = [];
let recentlyViewed = [];
let currentShippingCost = 0;
let currentDiscount = 0;
let validCoupons = {
    'WELCOME10': 10,   // 10% discount
    'SALE20': 20,      // 20% discount
    'FREESHIP': 0      // Free shipping (handled separately)
};
let currentStep = 1;

// Initialize the page
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    renderCart();
    renderRecentlyViewed();
}

// Setup all event listeners
function setupEventListeners() {
    // Update cart button
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', renderCart);
    }
    
    // Apply coupon button
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Shipping options
    shippingOptions.forEach(option => {
        option.addEventListener('change', updateShipping);
    });
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckoutModal);
    }
    
    // Close checkout modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCheckoutModal);
    }
    
    // Next step buttons in checkout flow
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            if (validateStep(step)) {
                goToNextStep(step);
            }
        });
    });
    
    // Previous step buttons in checkout flow
    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            goToPreviousStep(step);
        });
    });
    
    // Close checkout buttons
    closeCheckoutBtns.forEach(btn => {
        btn.addEventListener('click', closeCheckoutModal);
    });
    
    // Overlay click
    overlay.addEventListener('click', function() {
        closeCheckoutModal();
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }
}

// Render the cart items
function renderCart() {
    if (!cartItemsContainer) return;
    
    // Show empty cart message if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="../inventory.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    // Clear cart container
    cartItemsContainer.innerHTML = '';
    
    // Add each cart item
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        
        // Determine if this item has variants (color, size)
        let variantInfo = '';
        if (item.name.includes(' - ')) {
            const [baseName, variants] = item.name.split(' - ');
            variantInfo = `<div class="item-variant">${variants}</div>`;
        }
        
        cartItemElement.innerHTML = `
            <div class="cart-item-mobile-row">
                <div class="cart-item-image">
                    <div class="image-placeholder"></div>
                </div>
                <div class="cart-item-details">
                    <h3>${item.name.split(' - ')[0]}</h3>
                    ${variantInfo}
                    <span class="item-price-mobile">$${item.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-controls">
                <button class="qty-btn minus" data-id="${item.id}" data-name="${item.name}">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" min="1" value="${item.quantity}" class="qty-input" 
                    data-id="${item.id}" data-name="${item.name}">
                <button class="qty-btn plus" data-id="${item.id}" data-name="${item.name}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-subtotal">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}" data-name="${item.name}" aria-label="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to quantity controls and remove buttons
    addCartItemListeners();
    
    // Update cart summary
    updateCartSummary();
}

// Add event listeners to cart item controls
function addCartItemListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.cart-item .qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.cart-item .qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    // Quantity input fields
    document.querySelectorAll('.cart-item .qty-input').forEach(input => {
        input.addEventListener('change', updateQuantityFromInput);
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeCartItem);
    });
}

// Decrease quantity of an item
function decreaseQuantity(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    const cartItem = cart.find(item => 
        item.id === productId && 
        item.name === productName
    );
    
    if (cartItem) {
        cartItem.quantity--;
        
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => 
                !(item.id === productId && item.name === productName)
            );
        }
        
        saveToLocalStorage();
        renderCart();
    }
}

// Increase quantity of an item
function increaseQuantity(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    const cartItem = cart.find(item => 
        item.id === productId && 
        item.name === productName
    );
    
    if (cartItem) {
        cartItem.quantity++;
        saveToLocalStorage();
        renderCart();
    }
}

// Update quantity from input field
function updateQuantityFromInput(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    let newQuantity = parseInt(e.currentTarget.value);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        e.currentTarget.value = 1;
    }
    
    const cartItem = cart.find(item => 
        item.id === productId && 
        item.name === productName
    );
    
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveToLocalStorage();
        renderCart();
    }
}

// Remove an item from cart
function removeCartItem(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const productName = e.currentTarget.dataset.name;
    
    cart = cart.filter(item => 
        !(item.id === productId && item.name === productName)
    );
    
    saveToLocalStorage();
    renderCart();
    showNotification('Item removed from cart');
}

// Update cart summary
function updateCartSummary() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        if (cartSubtotal) cartSubtotal.textContent = '$0.00';
        if (taxAmount) taxAmount.textContent = '$0.00';
        if (cartTotal) cartTotal.textContent = '$0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (updateCartBtn) updateCartBtn.disabled = true;
        return;
    }
    
    // Enable buttons
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (updateCartBtn) updateCartBtn.disabled = false;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Calculate tax (10%)
    const tax = subtotal * 0.1;
    if (taxAmount) taxAmount.textContent = `$${tax.toFixed(2)}`;
    
    // Calculate discount
    let discountValue = 0;
    if (currentDiscount > 0) {
        discountValue = subtotal * (currentDiscount / 100);
        if (discountRow) discountRow.style.display = 'flex';
        if (discountAmount) discountAmount.textContent = `-$${discountValue.toFixed(2)}`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
    
    // Calculate total
    const total = subtotal + tax + currentShippingCost - discountValue;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Apply a coupon code
function applyCoupon() {
    if (!couponInput || !couponInput.value) {
        showNotification('Please enter a coupon code', 'warning');
        return;
    }
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (validCoupons.hasOwnProperty(couponCode)) {
        if (couponCode === 'FREESHIP') {
            // Apply free shipping
            document.getElementById('free-shipping').checked = true;
            currentShippingCost = 0;
            showNotification('Free shipping coupon applied!', 'success');
        } else {
            // Apply percentage discount
            currentDiscount = validCoupons[couponCode];
            showNotification(`${currentDiscount}% discount applied!`, 'success');
        }
        
        // Clear the input
        couponInput.value = '';
        
        // Update the cart summary
        updateCartSummary();
    } else {
        showNotification('Invalid coupon code', 'error');
    }
}

// Update shipping based on selected option
function updateShipping() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        currentShippingCost = parseInt(selectedShipping.value);
        updateCartSummary();
    }
}

// Render recently viewed products
function renderRecentlyViewed() {
    if (!recentlyViewedContainer || recentlyViewed.length === 0) return;
    
    // Clear container
    recentlyViewedContainer.innerHTML = '';
    
    // Get unique products (no duplicates)
    const uniqueProducts = [...new Set(recentlyViewed)]
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);
    
    // Limit to 4 products
    const limitedProducts = uniqueProducts.slice(0, 4);
    
    // Render products
    limitedProducts.forEach(product => {
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
                <a href="../html/productdetail.html?id=${product.id}" class="quick-view-btn">
                    View Details
                </a>
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
        
        recentlyViewedContainer.appendChild(productCard);
    });
    
    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = products.find(p => p.id === productId);
            
            if (product && product.availability) {
                addToCart(product);
                showNotification(`${product.name} added to cart!`);
            }
        });
    });
}

// Add a product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
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
    
    saveToLocalStorage();
    renderCart();
}

// Generate star rating HTML
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

// Checkout flow
function openCheckoutModal() {
    if (cart.length === 0) return;
    
    // Reset to first step
    currentStep = 1;
    updateCheckoutSteps();
    
    // Show the modal and overlay
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
}

function goToNextStep(currentStepNum) {
    const nextStepNum = currentStepNum + 1;
    
    // Update step states
    const currentStepElement = document.querySelector(`.step[data-step="${currentStepNum}"]`);
    currentStepElement.classList.remove('active');
    currentStepElement.classList.add('completed');
    
    const nextStepElement = document.querySelector(`.step[data-step="${nextStepNum}"]`);
    nextStepElement.classList.add('active');
    
    // Hide current form, show next form
    document.querySelectorAll('.checkout-form').forEach(form => {
        form.classList.remove('active');
    });
    
    if (nextStepNum === 3) {
        // Final step - confirmation
        completeOrder();
        document.getElementById('confirmation').classList.add('active');
    } else {
        // Go to next form
        const forms = ['shipping-form', 'payment-form', 'confirmation'];
        document.getElementById(forms[nextStepNum - 1]).classList.add('active');
    }
    
    currentStep = nextStepNum;
}

function goToPreviousStep(currentStepNum) {
    const prevStepNum = currentStepNum - 1;
    
    // Update step states
    const currentStepElement = document.querySelector(`.step[data-step="${currentStepNum}"]`);
    currentStepElement.classList.remove('active');
    
    const prevStepElement = document.querySelector(`.step[data-step="${prevStepNum}"]`);
    prevStepElement.classList.remove('completed');
    prevStepElement.classList.add('active');
    
    // Hide current form, show previous form
    document.querySelectorAll('.checkout-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const forms = ['shipping-form', 'payment-form', 'confirmation'];
    document.getElementById(forms[prevStepNum - 1]).classList.add('active');
    
    currentStep = prevStepNum;
}

function updateCheckoutSteps() {
    // Reset all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Set current step as active
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Set previous steps as completed
    for (let i = 1; i < currentStep; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
    }
    
    // Show the appropriate form
    document.querySelectorAll('.checkout-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const forms = ['shipping-form', 'payment-form', 'confirmation'];
    document.getElementById(forms[currentStep - 1]).classList.add('active');
}

function validateStep(step) {
    if (step === 1) {
        // Validate shipping form
        const requiredFields = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip', 'country', 'phone'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'warning');
            return false;
        }
        
        // Set email for confirmation
        const email = document.getElementById('email').value;
        if (confirmationEmail) confirmationEmail.textContent = email;
        
        return true;
    } else if (step === 2) {
        // Validate payment form
        const requiredFields = ['card-name', 'card-number', 'expiry', 'cvv'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all payment details', 'warning');
            return false;
        }
        
        return true;
    }
    
    return true;
}

function completeOrder() {
    // Generate order number
    const randomOrderNum = Math.floor(10000000 + Math.random() * 90000000);
    if (orderNumber) orderNumber.textContent = `SE-${randomOrderNum}`;
    
    // Set order date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    if (orderDate) orderDate.textContent = dateStr;
    
    // Clear cart after successful order
    cart = [];
    saveToLocalStorage();
}

// Theme toggle functionality
function toggleTheme() {
    const htmlElement = document.documentElement;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
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

// Save state to localStorage
function saveToLocalStorage() {
    localStorage.setItem('shopEaseCart', JSON.stringify(cart));
    localStorage.setItem('shopEaseRecentlyViewed', JSON.stringify(recentlyViewed));
}

// Load state from localStorage
function loadFromLocalStorage() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Load cart
    const savedCart = localStorage.getItem('shopEaseCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Load recently viewed
    const savedRecentlyViewed = localStorage.getItem('shopEaseRecentlyViewed');
    if (savedRecentlyViewed) {
        recentlyViewed = JSON.parse(savedRecentlyViewed);
    }
}

// Add CSS for notifications
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
        
        .invalid {
            border-color: var(--error-color, #F44336) !important;
            background-color: rgba(244, 67, 54, 0.05) !important;
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
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    init();
});