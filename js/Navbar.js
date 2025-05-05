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


function initNavbar() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Update icon based on current theme
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Mobile menu toggle with improved animation and accessibility
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle active classes
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Update menu icon to indicate state with smooth transition
            const menuIcon = mobileMenuBtn.querySelector('i');
            if (menuIcon) {
                if (isExpanded) {
                    // Animate icon change
                    menuIcon.style.transform = 'scale(0)';
                    setTimeout(() => {
                        menuIcon.classList.remove('fa-bars');
                        menuIcon.classList.add('fa-times');
                        menuIcon.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Add overlay effect to header
                    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
                } else {
                    // Animate icon change
                    menuIcon.style.transform = 'scale(0)';
                    setTimeout(() => {
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                        menuIcon.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Reset header shadow
                    setTimeout(() => {
                        header.style.boxShadow = '';
                    }, 300);
                }
            }
        });
        
        // Close dropdown when clicking outside with improved animation
        document.addEventListener('click', (e) => {
            const isClickInside = navLinks.contains(e.target) || mobileMenuBtn.contains(e.target);
            
            if (!isClickInside && navLinks.classList.contains('active')) {
                // Close menu with animation
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    navLinks.classList.remove('active');
                    navLinks.style.opacity = '';
                    navLinks.style.transform = '';
                    mobileMenuBtn.classList.remove('active');
                    
                    // Update ARIA attributes for accessibility
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    
                    // Reset header shadow
                    setTimeout(() => {
                        header.style.boxShadow = '';
                    }, 300);
                    
                    // Animate icon change
                    const menuIcon = mobileMenuBtn.querySelector('i');
                    if (menuIcon) {
                        menuIcon.style.transform = 'scale(0)';
                        setTimeout(() => {
                            menuIcon.classList.remove('fa-times');
                            menuIcon.classList.add('fa-bars');
                            menuIcon.style.transform = 'scale(1)';
                        }, 150);
                    }
                }, 200);
            }
        });
        
        // Add click event to nav links to close menu when a link is clicked
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    // Close menu with animation
                    navLinks.style.opacity = '0';
                    navLinks.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        navLinks.classList.remove('active');
                        navLinks.style.opacity = '';
                        navLinks.style.transform = '';
                        mobileMenuBtn.classList.remove('active');
                        
                        // Update ARIA attributes for accessibility
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        
                        // Animate icon change
                        const menuIcon = mobileMenuBtn.querySelector('i');
                        if (menuIcon) {
                            menuIcon.style.transform = 'scale(0)';
                            setTimeout(() => {
                                menuIcon.classList.remove('fa-times');
                                menuIcon.classList.add('fa-bars');
                                menuIcon.style.transform = 'scale(1)';
                            }, 150);
                        }
                    }, 200);
                }
            });
        });
    }
    
    // Search functionality
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Highlight active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-link');
    
    navLinksList.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    
}


/**
 * Handle search form submission without page reload
 * @param {Event} e - The form submit event
 */
function handleSearch(e) {
    e.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) return;
    
    // If we're already on the inventory page, perform search without navigation
    if (window.location.pathname.includes('inventory.html')) {
        if (typeof window.performSearch === 'function') {
            window.performSearch(searchTerm);
        } else {
            console.warn('Search function not available on this page');
        }
    } else {
        // If on other pages, navigate to inventory with search parameter
        window.location.href = `inventory.html?search=${encodeURIComponent(searchTerm)}`;
    }
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