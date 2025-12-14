// Maria Msingi Bora School - Interactive Script

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-container') && 
                !event.target.closest('.nav-menu') && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    // Alert Banner with Close Button
    const alertBanner = document.querySelector('.alert-banner');
    if (alertBanner) {
        // Check if already closed in session storage
        const bannerClosed = sessionStorage.getItem('msingiBannerClosed');
        
        if (!bannerClosed) {
            // Create close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.setAttribute('aria-label', 'Close announcement');
            closeButton.setAttribute('title', 'Close');
            closeButton.className = 'banner-close';
            
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0 10px;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                line-height: 1;
                transition: opacity 0.3s;
            `;
            
            alertBanner.style.position = 'relative';
            alertBanner.appendChild(closeButton);
            
            closeButton.addEventListener('click', () => {
                alertBanner.style.opacity = '1';
                let opacity = 1;
                const fadeOut = setInterval(() => {
                    if (opacity <= 0) {
                        clearInterval(fadeOut);
                        alertBanner.style.display = 'none';
                        sessionStorage.setItem('msingiBannerClosed', 'true');
                    } else {
                        opacity -= 0.05;
                        alertBanner.style.opacity = opacity;
                    }
                }, 30);
            });
        } else {
            alertBanner.style.display = 'none';
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });

    // Format Date for Display
    function formatInterviewDate() {
        const dateElements = document.querySelectorAll('[data-interview-date]');
        const interviewDate = new Date('2025-11-07');
        
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const formattedDate = interviewDate.toLocaleDateString('en-US', options);
        
        dateElements.forEach(element => {
            element.textContent = formattedDate;
        });
        
        // Also update any elements showing just the date
        document.querySelectorAll('.interview-date').forEach(el => {
            if (el.textContent.includes('7th November 2025')) {
                el.innerHTML = el.innerHTML.replace('7th November 2025', 
                    `<strong>${formattedDate}</strong>`);
            }
        });
    }
    
    formatInterviewDate();

    // Current Year Update
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(element => {
        element.textContent = currentYear;
    });

    // Update copyright year if 2024
    const copyright = document.querySelector('.footer-bottom p:first-child');
    if (copyright && copyright.textContent.includes('2024')) {
        copyright.innerHTML = copyright.innerHTML.replace('2024', currentYear);
    }

    // Countdown Timer for Interview Date (Optional)
    function updateCountdown() {
        const interviewDate = new Date('2025-11-07').getTime();
        const now = new Date().getTime();
        const timeLeft = interviewDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const countdownElement = document.getElementById('countdown-timer');
            
            if (countdownElement) {
                countdownElement.innerHTML = `
                    <div class="countdown-days">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">days remaining</span>
                    </div>
                `;
            }
        }
    }
    
    // Initialize countdown if element exists
    if (document.getElementById('countdown-timer')) {
        updateCountdown();
        // Update countdown daily
        setInterval(updateCountdown, 86400000); // 24 hours
    }

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.info-card, .facility-card, .feature, .contact-method').forEach(element => {
        observer.observe(element);
    });

    // Form handling for future forms
    const contactForms = document.querySelectorAll('form[data-contact]');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Add error message
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 5px;';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    input.classList.remove('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Success simulation
                    alert('Thank you for your interest! We will contact you soon regarding the admissions process.');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    });

    // Email validation for forms
    document.querySelectorAll('input[type="email"]').forEach(emailInput => {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.classList.add('error');
                
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid email address';
                    errorMsg.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 5px;';
                    this.parentNode.insertBefore(errorMsg, this.nextSibling);
                }
            } else if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                this.nextElementSibling.remove();
                this.classList.remove('error');
            }
        });
    });

    // Add CSS for form errors
    const style = document.createElement('style');
    style.textContent = `
        input.error, textarea.error, select.error {
            border-color: var(--danger) !important;
        }
        
        .tooltip {
            background: var(--dark);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
            position: fixed;
            z-index: 10000;
            pointer-events: none;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Countdown styles */
        .countdown-days {
            text-align: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--radius);
            backdrop-filter: blur(10px);
        }
        
        .countdown-number {
            display: block;
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--secondary);
            line-height: 1;
        }
        
        .countdown-label {
            display: block;
            font-size: 0.9rem;
            opacity: 0.9;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow);
        transition: var(--transition);
        z-index: 999;
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    console.log('Maria Msingi Bora School website initialized successfully');
});

// Window load event
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Performance tracking
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                    window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Initialize tooltips for elements with title attribute
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const title = this.getAttribute('title');
            if (title) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                const tooltipWidth = tooltip.offsetWidth;
                
                tooltip.style.left = rect.left + rect.width/2 - tooltipWidth/2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                // Store reference to remove later
                this.dataset.tooltipId = Date.now();
                tooltip.id = 'tooltip-' + this.dataset.tooltipId;
                
                this.removeAttribute('title');
            }
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltipId = 'tooltip-' + this.dataset.tooltipId;
            const tooltip = document.getElementById(tooltipId);
            if (tooltip) {
                tooltip.remove();
            }
            const originalTitle = this.dataset.originalTitle || this.getAttribute('data-original-title');
            if (originalTitle) {
                this.setAttribute('title', originalTitle);
            }
        });
    });
});
