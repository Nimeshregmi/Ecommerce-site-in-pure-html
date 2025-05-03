/**
 * Component System & Theme Management
 * This file handles loading components and theme switching
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load components
    loadComponent('navbar-container', '/components/common/Navbar.html');
    loadComponent('footer-container', '/components/common/Footer.html');
    
    // Initialize theme
    initTheme();
});

/**
 * Loads HTML component into the specified container
 * @param {string} containerId - ID of the container element
 * @param {string} componentPath - Path to the component HTML file
 */
async function loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to fetch ${componentPath}`);
        
        const html = await response.text();
        container.innerHTML = html;
        
        // Initialize component functionality after loading
        if (containerId === 'navbar-container') {
            initNavbar();
        }
    } catch (error) {
        console.error(`Error loading component: ${error}`);
    }
}

/**
 * Initialize navbar functionality
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

/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const themeToggleIcon = document.querySelector('#theme-toggle i');
    
    if (isDarkTheme) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeToggleIcon.className = 'fas fa-moon';
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeToggleIcon.className = 'fas fa-sun';
    }
}