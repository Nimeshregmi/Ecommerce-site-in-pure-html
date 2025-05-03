/**
 * Smooth scrolling functionality for ShopEase
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for all anchor links
    initSmoothScroll();
    
    // Initialize back to top button
    initBackToTop();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    // Get all anchor links that point to an ID
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate the target position with offset for header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.classList.add('back-to-top');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
        
        // Add styles for the button
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-gradient);
                color: white;
                border: none;
                box-shadow: 0 4px 15px rgba(78, 107, 255, 0.3);
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 99;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(78, 107, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Add scroll indicator to show reading progress
 */
function addScrollIndicator() {
    // Create scroll indicator if it doesn't exist
    if (!document.querySelector('.scroll-indicator')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.classList.add('scroll-indicator');
        document.body.appendChild(scrollIndicator);
        
        // Add styles for the indicator
        const style = document.createElement('style');
        style.textContent = `
            .scroll-indicator {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: var(--primary-gradient);
                z-index: 9999;
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Update indicator width on scroll
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        });
    }
}

// Initialize scroll indicator
addScrollIndicator();