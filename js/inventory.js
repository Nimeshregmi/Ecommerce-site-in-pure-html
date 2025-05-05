// Use the products from Product.js
// Access the products through the ProductService global object
const inventoryProducts = window.ProductService.getAllProducts();

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

// Export search function for navbar to use
window.performSearch = function(searchTerm) {
    if (searchTerm) {
        // Filter products based on search term
        currentProducts = inventoryProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Reset filters and pagination
        currentFilters = {
            categories: [],
            minPrice: 0,
            maxPrice: 1000,
            rating: 0
        };
        currentPage = 1;
        
        // Update UI
        renderProducts(currentProducts, currentPage);
        updatePagination();
        
        // Update filter UI
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        ratingRadios.forEach(radio => {
            radio.checked = false;
        });
        minPriceInput.value = 0;
        maxPriceInput.value = 1000;
        minRangeInput.value = 0;
        maxRangeInput.value = 1000;
        setupRangeSlider();
        
        // Update the search input field with the search term
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
    } else {
        // If search is empty, show all products
        currentProducts = [...inventoryProducts];
        renderProducts(currentProducts, currentPage);
        updatePagination();
    }
};

// Current state
let currentProducts = [...inventoryProducts];
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
function initInventory() {
    loadFromLocalStorage();
    renderProducts(currentProducts, currentPage);
    updatePagination();
    setupEventListeners();
    setupRangeSlider();
}

// Make init function available globally
window.initInventory = initInventory;

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
           <div class="product-card-inner">
               <a href="productdetail.html?id=${product.id}" class="product-link" data-id="${product.id}">
                <div class="product-image-container">
                    ${badgeHtml}
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-overlay">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                    ${!product.availability ? '<div class="sold-out-overlay"><span>Sold Out</span></div>' : ''}
                </div>
                
                </a>
                
                <div class="product-details">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price-container">
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        ${product.badge === 'sale' ? `<p class="product-old-price">$${(product.price * 1.2).toFixed(2)}</p>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn ${!product.availability ? 'disabled' : ''}" data-id="${product.id}" ${!product.availability ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            <span>${product.availability ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                        <button class="wishlist-btn" aria-label="Add to wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
           </div>
        `;
        
        productsContainer.appendChild(productCard);
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
    
    // Apply filters immediately
    applyFilters();
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
    
    // Apply filters immediately
    applyFilters();
}

// Use the generateStarRating function from ProductService
function generateStarRating(rating) {
    return window.ProductService.generateStarRating(rating);
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
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Modal and overlay
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', () => {
        closeModal();
        closeCart();
    });
    
    
    // Mobile filter toggle
    const filterToggleBtn = document.getElementById('filter-toggle');
    const closeFiltersBtn = document.getElementById('close-filters');
    const filtersElement = document.querySelector('.filters');
    
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', function() {
            filtersElement.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', function() {
            filtersElement.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close filters when clicking outside on mobile
    overlay.addEventListener('click', function() {
        if (filtersElement.classList.contains('active')) {
            filtersElement.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && filtersElement.classList.contains('active')) {
            filtersElement.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
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
    // Apply filters immediately without requiring the Apply button
    applyFilters();
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
    // Apply filters immediately
    applyFilters();
}

// Apply all current filters
function applyFilters() {
    let filteredProducts = [...inventoryProducts];
    
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
    currentProducts = [...inventoryProducts];
    currentPage = 1;
    sortSelect.value = 'featured';
    handleSort();
    
    // Update visual slider
    setupRangeSlider();
    
    // Save state
    saveToLocalStorage();
}

// Handle Quick View


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


function closeModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    currentProductId = null;
}

// Cart functionality







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

// Handle search functionality
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
        // Filter products based on search term
        currentProducts = inventoryProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        // Reset filters and pagination
        currentFilters = {
            categories: [],
            minPrice: 0,
            maxPrice: 1000,
            rating: 0
        };
        currentPage = 1;
        
        // Update UI
        renderProducts(currentProducts, currentPage);
        updatePagination();
        
        // Update filter UI
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        ratingRadios.forEach(radio => {
            radio.checked = false;
        });
        minPriceInput.value = 0;
        maxPriceInput.value = 1000;
        minRangeInput.value = 0;
        maxRangeInput.value = 1000;
        setupRangeSlider();
    } else {
        // If search is empty, show all products
        currentProducts = [...inventoryProducts];
        renderProducts(currentProducts, currentPage);
        updatePagination();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    addDynamicStyles();
    initInventory();
    
    // Set up search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // If search parameter exists, populate search input and trigger search
    if (searchParam) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchParam;
            handleSearch(new Event('submit'));
        }
    }
});