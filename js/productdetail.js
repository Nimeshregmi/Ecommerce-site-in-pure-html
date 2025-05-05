// Use the products from Product.js
// Access the products through the ProductService global object
const productss = window.ProductService.getAllProducts();

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
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const relatedProductsContainer = document.getElementById('related-products-container');
const specificationsList = document.querySelector('#specifications-tab .specs-table');

// State
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;

// Initialize the page
function init() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    console.log('Product ID from URL:', productId);
    console.log('Available products:', productss.length);
    
    // If no ID provided, use the first product as a default
    currentProduct =window.ProductService.getProductById(productId) || productss[0];
    
    console.log('Selected product:', currentProduct);
    
    if (currentProduct) {
        renderProductDetails();
        setupEventListeners();
        loadRelatedProducts();
        
        
    } else {
        // Handle product not found
        productTitle.textContent = 'Product Not Found';
        productDescription.textContent = 'The requested product could not be found.';
    }
}

// Add product to recently viewed


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
    
    // Set product image
    const mainProductImage = document.getElementById('main-product-image');
    if (mainProductImage) {
        mainProductImage.src = currentProduct.image;
        mainProductImage.alt = currentProduct.name;
    }
    
    // Update thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail img');
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.src = currentProduct.image;
            thumbnail.alt = currentProduct.name;
        });
    }
    
    // Set availability
    if (currentProduct.availability) {
        productAvailability.textContent = 'In Stock';
        productAvailability.className = 'in-stock';
    } else {
        productAvailability.textContent = 'Out of Stock';
        productAvailability.className = 'out-of-stock';
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

    // Update sticky product info at mobile view
    const stickyProductName = document.getElementById('sticky-product-name');
    const stickyProductPrice = document.getElementById('sticky-product-price');
    const stickyProductImage = document.getElementById('sticky-product-image');

    if (stickyProductName) stickyProductName.textContent = currentProduct.name;
    if (stickyProductPrice) stickyProductPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
    if (stickyProductImage) {
        stickyProductImage.src = currentProduct.image;
        stickyProductImage.alt = currentProduct.name;
    }
}

// Use the generateStarRating function from ProductService
function generateStarRating(rating) {
    return window.ProductService.generateStarRating(rating);
}

// Setup all event listeners
function setupEventListeners() {
    // Color options
    colorOptions.forEach(option => {
        option.addEventListener('click', handleColorSelection);
    });
    
    // Size options
    sizeOptions.forEach(option => {
        option.addEventListener('click', handleSizeSelection);
    });
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabChange);
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
    }
    
    // Thumbnail gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
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

// Load related products
function loadRelatedProducts() {
    if (!currentProduct) return;
    
    // Find products in the same category (excluding current product)
    const related = productss.filter(p => 
        p.category === currentProduct.category && 
        p.id !== currentProduct.id
    );
    
    // If not enough in same category, add some from other categories
    if (related.length < 4) {
        const additional = productss.filter(p => 
            p.category !== currentProduct.category && 
            p.id !== currentProduct.id
        ).slice(0, 4 - related.length);
        
        related.push(...additional);
    }
    
    // Limit to 4 products
    const limitedRelated = related.slice(0, 4);
    
    // Render related products
    relatedProductsContainer.innerHTML = '';
    
    if (limitedRelated.length === 0) {
        relatedProductsContainer.innerHTML = '<p class="no-products">No related products available.</p>';
        return;
    }
    
    limitedRelated.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<span class="product-badge ${product.badge}">${product.badge}</span>`;
        }
        
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
                        <button  class="add-to-cart-btn ${!product.availability ? 'disabled' : ''}" data-id="${product.id}" ${!product.availability ? 'disabled' : ''}>
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
        
        relatedProductsContainer.appendChild(productCard);
    });
    
    // Add event listeners to related products' "Quick View" buttons
    document.querySelectorAll('#related-products-container .quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(e.currentTarget.dataset.id);
            window.location.href = `productdetail.html?id=${productId}`;
        });
    });
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

// Toggle theme
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const icon = document.querySelector('#theme-toggle i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('shopEaseTheme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('shopEaseTheme', 'light');
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