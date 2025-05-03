// Theme toggle function
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

/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        
        // Update icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Load theme and other settings from localStorage
 */
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

// CSS variables for themes (should be included in your CSS file)
/* 
:root {
    --primary-color: #4a6de5;
    --secondary-color: #f8f9fa;
    --text-color: #212529;
    --background-color: #ffffff;
    --card-background: #ffffff;
    --border-color: #dee2e6;
    --input-background: #f8f9fa;
    --box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    --success-color: #4CAF50;
    --warning-color: #FF9800;
    --error-color: #F44336;
    --accent-color: #ff4081;
    
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    
    --transition-speed: 0.3s;
}

body.dark-theme {
    --primary-color: #5d7bf7;
    --secondary-color: #292b2c;
    --text-color: #f8f9fa;
    --background-color: #121212;
    --card-background: #1e1e1e;
    --border-color: #343a40;
    --input-background: #2a2a2a;
    --box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
*/

// Event listener for theme toggle button (already included in setupEventListeners)
// const themeToggle = document.getElementById('theme-toggle');
// if (themeToggle) {
//     themeToggle.addEventListener('click', toggleTheme);
// }

/**
 * Initialize the navbar functionality
 */
function initNavbar() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Update icon based on current theme
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
            // Toggle overlay if it exists
            const overlay = document.querySelector('.overlay');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    // Highlight active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize navbar
    initNavbar();
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Initialize other components as needed
    // Check if the initInventory function exists (for inventory page)
    if (typeof window.initInventory === 'function') {
        window.initInventory();
    }
    // Check if there might be an init function in the current page context
    else if (typeof init === 'function') {
        init();
    }
});