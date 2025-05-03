// Product data - would typically come from an API/backend
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
        description: "Feature-rich smartwatch with heart rate monitoring, GPS tracking, and a beautiful AMOLED display.",
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
        description: "Comfortable cotton t-shirt for everyday wear. Available in multiple colors and sizes.",
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
        description: "Programmable coffee maker with timer and multiple brew settings. Makes up to 12 cups.",
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
        description: "Genuine leather wallet with multiple card slots and coin pocket. Slim design for comfort.",
        sku: "AC12345",
        availability: false
    },
    {
        id: 6,
        name: "Wireless Earbuds",
        price: 149.99,
        rating: 4.4,
        reviews: 112,
        category: "electronics",
        image: "assets/placeholder.jpg",
        description: "True wireless earbuds with touch controls, water resistance, and long battery life.",
        badge: "sale",
        sku: "EL54321",
        availability: true
    },
    {
        id: 7,
        name: "Kitchen Blender",
        price: 79.99,
        rating: 4.1,
        reviews: 93,
        category: "home",
        image: "assets/placeholder.jpg",
        description: "Powerful blender with multiple speed settings and pulse function. Perfect for smoothies and soups.",
        sku: "HK78901",
        availability: true
    },
    {
        id: 8,
        name: "Denim Jacket",
        price: 69.99,
        rating: 4.6,
        reviews: 45,
        category: "clothing",
        image: "assets/placeholder.jpg",
        description: "Classic denim jacket with a modern fit. Versatile and durable for everyday wear.",
        sku: "CL67890",
        availability: true
    },
    {
        id: 9,
        name: "Bluetooth Speaker",
        price: 129.99,
        rating: 4.8,
        reviews: 187,
        category: "electronics",
        image: "assets/placeholder.jpg",
        description: "Portable Bluetooth speaker with 360° sound and waterproof design. Perfect for outdoor activities.",
        badge: "bestseller",
        sku: "EL24680",
        availability: true
    },
    {
        id: 10,
        name: "Yoga Mat",
        price: 35.99,
        rating: 4.3,
        reviews: 64,
        category: "accessories",
        image: "assets/placeholder.jpg",
        description: "High-density yoga mat with non-slip surface and carrying strap. Eco-friendly material.",
        sku: "AC13579",
        availability: true
    },
    {
        id: 11,
        name: "Digital Camera",
        price: 499.99,
        rating: 4.7,
        reviews: 102,
        category: "electronics",
        image: "assets/placeholder.jpg",
        description: "20MP digital camera with 4K video recording, optical zoom, and built-in stabilization.",
        sku: "EL97531",
        availability: true
    },
    {
        id: 12,
        name: "Desk Lamp",
        price: 45.99,
        rating: 3.9,
        reviews: 58,
        category: "home",
        image: "assets/placeholder.jpg",
        description: "Adjustable desk lamp with multiple brightness levels and color temperatures. USB charging port included.",
        sku: "HK24680",
        availability: true
    }
];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const sortSelect = document.getElementById('sort-by');
const viewButtons = document.querySelectorAll('.view-btn');
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
const ratingRadios = document.querySelectorAll('input[name="rating"]');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minRangeInput = document.querySelector('.min-range');
const maxRangeInput = document.querySelector('.max-range');
const applyFiltersBtn = document.querySelector('.apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');
const modalProductTitle = document.getElementById('modal-product-title');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductDescription = document.getElementById('modal-product-description');
const modalProductSku = document.getElementById('modal-product-sku');
const modalProductCategory = document.getElementById('modal-product-category');
const modalProductAvailability = document.getElementById('modal-product-availability');
const productModal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const emptyCartMessage = document.querySelector('.empty-cart-message');
const modalQtyInput = document.querySelector('.qty-input');
const modalQtyBtns = document.querySelectorAll('.quantity-selector .qty-btn');
const modalAddToCartBtn = document.querySelector('.modal-body .add-to-cart-btn');
const checkoutBtn = document.querySelector('.checkout-btn');

// Current state
let currentProducts = [...products];
let currentView = 'grid';
let currentFilters = {
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    rating: 0
};
let cart = [];
let currentProductId = null;
let currentPage = 1;
let itemsPerPage = 8;

// Initialize the page
function init() {
    loadFromLocalStorage();
    renderProducts(currentProducts, currentPage);
    updatePagination();
    setupEventListeners();
    updateCart();
    setupRangeSlider();
}

// Render products based on current filters, sort and pagination
function renderProducts(products, page) {
    productsContainer.innerHTML = '';
    
    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
    
    if (paginatedProducts.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products found matching your filters.</div>';
        return;
    }
    
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<span class="product-badge ${product.badge}">${product.badge}</span>`;
        }
        
        const availabilityClass = product.availability ? 'in-stock' : 'out-of-stock';
        const availabilityText = product.availability ? 'In Stock' : 'Out of Stock';
        
        const stars = generateStarRating(product.rating);
        
        productCard.innerHTML = `
           <a href="html/productdetail.html" class="product-link" data-id="${product.id}">
            <div class="product-image">
                ${badgeHtml}
                <img src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="${product.name}" class="product-img">
                <div class="image-placeholder"></div>
                <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
            </div>
            </a>
            <div class="product-details" style="margin :10px 10px 10px 10px;">
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
        
        productsContainer.appendChild(productCard);
    });
    
    // Add quick view functionality to newly rendered products
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickView);
    });
    
    // Add add-to-cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

// Update pagination UI
function updatePagination() {
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    const paginationNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Update page numbers
    paginationNumbers.innerHTML = '';
    
    // Logic for showing limited page numbers with ellipsis
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            paginationNumbers.innerHTML += `<button class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    } else {
        // Always show first page
        paginationNumbers.innerHTML += `<button class="page-num ${1 === currentPage ? 'active' : ''}" data-page="1">1</button>`;
        
        // Show ellipsis or pages depending on current page
        if (currentPage > 3) {
            paginationNumbers.innerHTML += `<span class="ellipsis">...</span>`;
        }
        
        // Show current page and surrounding pages
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
                paginationNumbers.innerHTML += `<button class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            paginationNumbers.innerHTML += `<span class="ellipsis">...</span>`;
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            paginationNumbers.innerHTML += `<button class="page-num ${totalPages === currentPage ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
        }
    }
    
    // Add event listeners to page numbers
    document.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', function() {
            currentPage = parseInt(this.getAttribute('data-page'));
            renderProducts(currentProducts, currentPage);
            updatePagination();
        });
    });
    
    // Add event listeners to prev/next buttons
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(currentProducts, currentPage);
            updatePagination();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(currentProducts, currentPage);
            updatePagination();
        }
    });
}

// Set up the price range slider functionality
function setupRangeSlider() {
    const minValue = parseInt(minRangeInput.value);
    const maxValue = parseInt(maxRangeInput.value);
    const minPercent = (minValue / parseInt(minRangeInput.max)) * 100;
    const maxPercent = (maxValue / parseInt(maxRangeInput.max)) * 100;
    
    const track = document.querySelector('.slider-track');
    track.style.left = minPercent + '%';
    track.style.width = (maxPercent - minPercent) + '%';
    
    // Update the track as sliders move
    [minRangeInput, maxRangeInput].forEach(input => {
        input.addEventListener('input', function() {
            const minValue = parseInt(minRangeInput.value);
            const maxValue = parseInt(maxRangeInput.value);
            const minPercent = (minValue / parseInt(minRangeInput.max)) * 100;
            const maxPercent = (maxValue / parseInt(maxRangeInput.max)) * 100;
            
            track.style.left = minPercent + '%';
            track.style.width = (maxPercent - minPercent) + '%';
        });
    });
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

// Setup all event listeners
function setupEventListeners() {
    // Sort products
    sortSelect.addEventListener('change', handleSort);
    
    // Toggle view (grid/list)
    viewButtons.forEach(button => {
        button.addEventListener('click', handleViewToggle);
    });
    
    // Filter by category
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryFilter);
    });
    
    // Filter by rating
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', handleRatingFilter);
    });
    
    // Price range inputs
    minPriceInput.addEventListener('input', handlePriceInputChange);
    maxPriceInput.addEventListener('input', handlePriceInputChange);
    minRangeInput.addEventListener('input', handleRangeInputChange);
    maxRangeInput.addEventListener('input', handleRangeInputChange);
    
    // Apply/Clear filters
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Modal and overlay
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', () => {
        closeModal();
        closeCart();
    });
    
    // Modal quantity buttons
    modalQtyBtns.forEach(btn => {
        btn.addEventListener('click', handleModalQuantity);
    });
    
    // Modal add to cart button
    modalAddToCartBtn.addEventListener('click', handleModalAddToCart);
    
    // Cart
    closeCartBtn.addEventListener('click', closeCart);
    document.querySelector('.cart-icon').addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Checkout button event listener already set above
}

// Sort products
function handleSort() {
    const sortValue = sortSelect.value;
    
    switch(sortValue) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            currentProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            currentProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            // Default 'featured' sort
            currentProducts.sort((a, b) => {
                if (a.badge === 'bestseller') return -1;
                if (b.badge === 'bestseller') return 1;
                if (a.badge === 'new') return -1;
                if (b.badge === 'new') return 1;
                return 0;
            });
    }
    
    currentPage = 1; // Reset to first page when sorting
    renderProducts(currentProducts, currentPage);
    updatePagination();
    saveToLocalStorage();
}

// Toggle between grid and list view
function handleViewToggle(e) {
    const viewType = e.currentTarget.dataset.view;
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    if (viewType === 'grid') {
        productsContainer.classList.remove('list-view');
        currentView = 'grid';
    } else {
        productsContainer.classList.add('list-view');
        currentView = 'list';
    }
    
    saveToLocalStorage();
}

// Handle category filter changes
function handleCategoryFilter() {
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    currentFilters.categories = selectedCategories;
}

// Handle rating filter changes
function handleRatingFilter(e) {
    const ratingValue = e.target.value;
    
    switch(ratingValue) {
        case '4up':
            currentFilters.rating = 4;
            break;
        case '3up':
            currentFilters.rating = 3;
            break;
        case '2up':
            currentFilters.rating = 2;
            break;
        case '1up':
            currentFilters.rating = 1;
            break;
        default:
            currentFilters.rating = 0;
    }
}

// Handle price input changes (from number inputs)
function handlePriceInputChange() {
    let minValue = parseFloat(minPriceInput.value);
    let maxValue = parseFloat(maxPriceInput.value);
    
    // Validate values
    if (isNaN(minValue)) minValue = 0;
    if (isNaN(maxValue)) maxValue = 1000;
    
    // Ensure min doesn't exceed max
    if (minValue > maxValue) {
        minValue = maxValue;
        minPriceInput.value = minValue;
    }
    
    // Update range inputs
    minRangeInput.value = minValue;
    maxRangeInput.value = maxValue;
    
    currentFilters.minPrice = minValue;
    currentFilters.maxPrice = maxValue;
    
    setupRangeSlider(); // Update the visual slider
}

// Handle range slider changes
function handleRangeInputChange() {
    let minValue = parseFloat(minRangeInput.value);
    let maxValue = parseFloat(maxRangeInput.value);
    
    // Ensure min doesn't exceed max
    if (minValue > maxValue) {
        if (this === minRangeInput) {
            minValue = maxValue;
            minRangeInput.value = minValue;
        } else {
            maxValue = minValue;
            maxRangeInput.value = maxValue;
        }
    }
    
    // Update text inputs
    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;
    
    currentFilters.minPrice = minValue;
    currentFilters.maxPrice = maxValue;
    
    setupRangeSlider(); // Update the visual slider
}

// Apply all current filters
function applyFilters() {
    let filteredProducts = [...products];
    
    // Filter by category
    if (currentFilters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            currentFilters.categories.includes(product.category)
        );
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => 
        product.price >= currentFilters.minPrice && product.price <= currentFilters.maxPrice
    );
    
    // Filter by rating
    if (currentFilters.rating > 0) {
        filteredProducts = filteredProducts.filter(product => product.rating >= currentFilters.rating);
    }
    
    currentProducts = filteredProducts;
    currentPage = 1; // Reset to first page when filtering
    
    // Apply current sort
    handleSort();
    
    // Save state
    saveToLocalStorage();
}

// Clear all filters
function clearFilters() {
    // Reset checkbox filters
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset radio filters
    ratingRadios.forEach(radio => {
        radio.checked = false;
    });
    
    // Reset price filters
    minPriceInput.value = 0;
    maxPriceInput.value = 1000;
    minRangeInput.value = 0;
    maxRangeInput.value = 1000;
    
    // Reset filter object
    currentFilters = {
        categories: [],
        minPrice: 0,
        maxPrice: 1000,
        rating: 0
    };
    
    // Reset products and sort
    currentProducts = [...products];
    currentPage = 1;
    sortSelect.value = 'featured';
    handleSort();
    
    // Update visual slider
    setupRangeSlider();
    
    // Save state
    saveToLocalStorage();
}

// Handle Quick View
function handleQuickView(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    currentProductId = productId;
    modalQtyInput.value = 1; // Reset quantity
    
    modalProductTitle.textContent = product.name;
    modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
    modalProductDescription.textContent = product.description;
    modalProductSku.textContent = product.sku;
    modalProductCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    
    // Update modal stars
    const modalStarsContainer = productModal.querySelector('.stars');
    modalStarsContainer.innerHTML = generateStarRating(product.rating);
    productModal.querySelector('.product-rating span').textContent = `(${product.reviews} Reviews)`;
    
    if (product.availability) {
        modalProductAvailability.textContent = 'In Stock';
        modalProductAvailability.className = 'in-stock';
        modalAddToCartBtn.disabled = false;
    } else {
        modalProductAvailability.textContent = 'Out of Stock';
        modalProductAvailability.className = 'out-of-stock';
        modalAddToCartBtn.disabled = true;
    }
    
    productModal.classList.add('active');
    overlay.classList.add('active');
}

// Handle modal quantity buttons
function handleModalQuantity(e) {
    const isPlus = e.currentTarget.classList.contains('plus');
    let qty = parseInt(modalQtyInput.value);
    
    if (isPlus) {
        qty++;
    } else {
        qty = Math.max(1, qty - 1); // Don't go below 1
    }
    
    modalQtyInput.value = qty;
}

// Handle adding to cart from modal
function handleModalAddToCart() {
    if (!currentProductId) return;
    
    const product = products.find(p => p.id === currentProductId);
    const quantity = parseInt(modalQtyInput.value);
    
    if (!product || !product.availability || isNaN(quantity) || quantity < 1) return;
    
    const existingItem = cart.find(item => item.id === currentProductId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    updateCart();
    closeModal();
    showNotification(`${product.name} added to cart!`);
    saveToLocalStorage();
}

function closeModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    currentProductId = null;
}

// Cart functionality
function handleAddToCart(e) {
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
                    <button class="qty-btn minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
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
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity--;
        
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
        saveToLocalStorage();
    }
}

function increaseQuantity(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity++;
        updateCart();
        saveToLocalStorage();
    }
}

function removeCartItem(e) {
    const productId = parseInt(e.currentTarget.dataset.id);
    const product = products.find(p => p.id === productId);
    
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    
    if (product) {
        showNotification(`${product.name} removed from cart.`);
    }
    
    saveToLocalStorage();
}

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    if (!productModal.classList.contains('active')) {
        overlay.classList.remove('active');
    }
}

function handleCheckout() {
    if (cart.length === 0) return;
    
    // Just for demo, we'll clear the cart and show a notification
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

// Theme toggle functionality has been removed

// Save state to localStorage
function saveToLocalStorage() {
    const state = {
        cart: cart,
        currentView: currentView,
        currentFilters: currentFilters,
        currentSort: sortSelect.value
    };
    
    localStorage.setItem('shopEaseState', JSON.stringify(state));
}

// Load state from localStorage
function loadFromLocalStorage() {
    // Theme-related code has been removed
    
    // Load app state
    const savedState = localStorage.getItem('shopEaseState');
    
    if (savedState) {
        const state = JSON.parse(savedState);
        
        // Restore cart
        cart = state.cart || [];
        
        // Restore view
        currentView = state.currentView || 'grid';
        if (currentView === 'list') {
            productsContainer.classList.add('list-view');
            viewButtons.forEach(btn => {
                if (btn.dataset.view === 'list') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // Restore filters
        if (state.currentFilters) {
            currentFilters = state.currentFilters;
            
            // Apply saved filters to UI
            if (currentFilters.categories.length > 0) {
                categoryCheckboxes.forEach(checkbox => {
                    checkbox.checked = currentFilters.categories.includes(checkbox.value);
                });
            }
            
            if (currentFilters.rating > 0) {
                ratingRadios.forEach(radio => {
                    switch (currentFilters.rating) {
                        case 4:
                            radio.checked = radio.value === '4up';
                            break;
                        case 3:
                            radio.checked = radio.value === '3up';
                            break;
                        case 2:
                            radio.checked = radio.value === '2up';
                            break;
                        case 1:
                            radio.checked = radio.value === '1up';
                            break;
                    }
                });
            }
            
            minPriceInput.value = currentFilters.minPrice;
            maxPriceInput.value = currentFilters.maxPrice;
            minRangeInput.value = currentFilters.minPrice;
            maxRangeInput.value = currentFilters.maxPrice;
        }
        
        // Apply filters
        let filteredProducts = [...products];
        
        // Filter by category
        if (currentFilters.categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                currentFilters.categories.includes(product.category)
            );
        }
        
        // Filter by price
        filteredProducts = filteredProducts.filter(product => 
            product.price >= currentFilters.minPrice && product.price <= currentFilters.maxPrice
        );
        
        // Filter by rating
        if (currentFilters.rating > 0) {
            filteredProducts = filteredProducts.filter(product => product.rating >= currentFilters.rating);
        }
        
        currentProducts = filteredProducts;
        
        // Restore sort
        if (state.currentSort) {
            sortSelect.value = state.currentSort;
        }
    }
}

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
        
        .no-products {
            grid-column: 1 / -1;
            text-align: center;
            padding: var(--spacing-xl);
            color: var(--text-secondary);
            font-size: var(--font-size-lg);
        }
        
        .empty-cart-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-xl) 0;
            color: var(--text-secondary);
        }
        
        .empty-cart-message i {
            font-size: 3rem;
            margin-bottom: var(--spacing-md);
            opacity: 0.5;
        }
        
        .cart-item {
            display: grid;
            grid-template-columns: 60px 1fr auto;
            gap: 10px;
            padding: 15px 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            overflow: hidden;
            border-radius: var(--border-radius-sm);
        }
        
        .cart-item-details h4 {
            font-size: var(--font-size-sm);
            margin-bottom: 5px;
        }
        
        .cart-item-price {
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
        }
        
        .cart-item-quantity span {
            padding: 0 10px;
        }
        
        .qty-btn {
            background: none;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            width: 24px;
            height: 24px;
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .qty-btn:hover {
            background-color: var(--bg-hover);
        }
        
        .remove-item {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            transition: color var(--transition-fast);
        }
        
        .remove-item:hover {
            color: var(--accent-color);
        }
        
        .in-stock {
            color: var(--success-color, #4CAF50);
        }
        
        .out-of-stock {
            color: var(--accent-color);
        }
        
        /* Animation for floating elements */
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    init();
});