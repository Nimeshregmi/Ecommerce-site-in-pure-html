// Contact Form Handling

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Basic validation
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showFormMessage('success', 'Your message has been sent successfully! We\'ll get back to you soon.');
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // In a real application, you would send the data to your server:
                /*
                fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    contactForm.reset();
                    showFormMessage('success', 'Your message has been sent successfully! We\'ll get back to you soon.');
                })
                .catch(error => {
                    showFormMessage('error', 'There was an error sending your message. Please try again later.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
                */
            }, 1500);
        });
        
        // Add input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    }
});

// Input validation function
function validateInput(input) {
    let isValid = true;
    const errorClass = 'error';
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Skip validation if not required and empty
    if (!input.required && input.value.trim() === '') {
        input.classList.remove(errorClass);
        return true;
    }
    
    // Validate based on input type
    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                showInputError(input, 'Please enter a valid email address');
                isValid = false;
            }
            break;
        
        case 'tel':
            if (input.value.trim() !== '') {
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(input.value.trim())) {
                    showInputError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            break;
            
        default:
            if (input.required && input.value.trim() === '') {
                showInputError(input, 'This field is required');
                isValid = false;
            }
    }
    
    // Update input styling
    if (isValid) {
        input.classList.remove(errorClass);
    } else {
        input.classList.add(errorClass);
    }
    
    return isValid;
}

// Show input error message
function showInputError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

// Validate the entire form
function validateForm(formData) {
    let isValid = true;
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show form message (success or error)
function showFormMessage(type, message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // Add to form
    const form = document.getElementById('contactForm');
    form.insertAdjacentElement('afterend', messageElement);
    
    // Auto-hide message after delay
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}