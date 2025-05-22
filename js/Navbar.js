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
Initialize theme based on user preference or system setting
**/
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function loadFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    const savedCart = localStorage.getItem('shopEaseCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    const savedRecentlyViewed = localStorage.getItem('shopEaseRecentlyViewed');
    if (savedRecentlyViewed) {
        recentlyViewed = JSON.parse(savedRecentlyViewed);
    }
}

function initNavbar() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);

            const menuIcon = mobileMenuBtn.querySelector('i');
            if (menuIcon) {
                if (isExpanded) {
                    menuIcon.style.transform = 'scale(0)';
                    setTimeout(() => {
                        menuIcon.classList.remove('fa-bars');
                        menuIcon.classList.add('fa-times');
                        menuIcon.style.transform = 'scale(1)';
                    }, 150);

                    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
                } else {
                    menuIcon.style.transform = 'scale(0)';
                    setTimeout(() => {
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                        menuIcon.style.transform = 'scale(1)';
                    }, 150);

                    setTimeout(() => {
                        header.style.boxShadow = '';
                    }, 300);
                }
            }
        });

        document.addEventListener('click', (e) => {
            const isClickInside = navLinks.contains(e.target) || mobileMenuBtn.contains(e.target);

            if (!isClickInside && navLinks.classList.contains('active')) {
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    navLinks.classList.remove('active');
                    navLinks.style.opacity = '';
                    navLinks.style.transform = '';
                    mobileMenuBtn.classList.remove('active');

                    mobileMenuBtn.setAttribute('aria-expanded', 'false');

                    setTimeout(() => {
                        header.style.boxShadow = '';
                    }, 300);

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

        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.opacity = '0';
                    navLinks.style.transform = 'translateY(-10px)';

                    setTimeout(() => {
                        navLinks.classList.remove('active');
                        navLinks.style.opacity = '';
                        navLinks.style.transform = '';
                        mobileMenuBtn.classList.remove('active');

                        mobileMenuBtn.setAttribute('aria-expanded', 'false');

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

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

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

    if (window.location.pathname.includes('inventory.html')) {
        if (typeof window.performSearch === 'function') {
            window.performSearch(searchTerm);
        } else {
            console.warn('Search function not available on this page');
        }
    } else {
        window.location.href = `inventory.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    loadFromLocalStorage();

    if (typeof window.initInventory === 'function') {
        window.initInventory();
    } else if (typeof init === 'function') {
        init();
    }
});
