/**
 * Enhanced interactions for ShopEase landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Initialize product card hover effects
    initProductCards();
});

/**
 * Initialize scroll reveal animations for elements with .reveal class
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    // Add reveal class to elements we want to animate on scroll
    document.querySelectorAll('.feature-card, .product-card, .section-title, .newsletter-content').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });
    
    // Function to check if element is in viewport
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on initial load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

/**
 * Initialize parallax effects for background elements
 */
function initParallax() {
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Parallax effect for hero section
        if (heroSection) {
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.1}px`;
        }
    });
}

/**
 * Initialize interactive elements like buttons and hover effects
 */
function initInteractiveElements() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Enhanced floating elements interaction
    const floatingElements = document.querySelectorAll('.floating-element');
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && floatingElements.length > 0) {
        heroSection.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            floatingElements.forEach((element, index) => {
                const depth = 0.05 + (index * 0.05);
                const moveX = (mouseX - 0.5) * 50 * depth;
                const moveY = (mouseY - 0.5) * 50 * depth;
                
                // Apply the transform based on the element's original animation
                if (element.classList.contains('one')) {
                    element.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px)`;
                } else if (element.classList.contains('two')) {
                    element.style.transform = `translate(-25%, -25%) translateX(${moveX}px) translateY(${moveY}px)`;
                } else if (element.classList.contains('three')) {
                    element.style.transform = `translate(-65%, -75%) translateX(${moveX}px) translateY(${moveY}px)`;
                }
            });
        });
    }
}

/**
 * Initialize product card hover effects
 */
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add shimmer effect
            card.classList.add('shimmer');
            
            // Slightly elevate the card
            card.style.transform = 'translateY(-15px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove shimmer effect
            card.classList.remove('shimmer');
            
            // Reset card position
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

/**
 * Add CSS for dynamic effects that need to be added via JavaScript
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .shimmer {
            overflow: hidden;
            position: relative;
        }
    `;
    
    document.head.appendChild(style);
}

// Add dynamic styles
addDynamicStyles();