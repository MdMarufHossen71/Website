// Modern Portfolio JavaScript

// 3D Effects and Interactions
class Portfolio3D {
    constructor() {
        this.init();
        this.setupParallax();
        this.setupMouseTracking();
        this.optimizeForDevice();
    }
    
    init() {
        // Add 3D classes to elements
        this.add3DClasses();
        // Setup intersection observer for 3D animations
        this.setup3DObserver();
    }
    
    add3DClasses() {
        // Add 3D transform classes to cards
        const cards = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .achievement-card, .blog-card');
        cards.forEach(card => {
            card.classList.add('card-3d');
        });
        
        // Add 3D container classes
        const containers = document.querySelectorAll('.services-grid, .portfolio-grid, .testimonials-grid, .blog-grid');
        containers.forEach(container => {
            container.classList.add('transform-3d');
        });
    }
    
    setup3DObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateZ(0)';
                    
                    // Add staggered animation delay
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe 3D elements
        const elements = document.querySelectorAll('.card-3d, .skill-item, .experience-card');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px) translateZ(-20px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }
    
    setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax for floating elements
            const floatingElements = document.querySelectorAll('.floating-card');
            floatingElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = scrolled * speed;
                const rotateY = scrolled * 0.05;
                element.style.transform = `translateY(${yPos}px) rotateY(${rotateY}deg) translateZ(${10 + index * 5}px)`;
            });
            
            // Parallax for hero background
            const heroBackground = document.querySelector('.hero::before');
            if (heroBackground) {
                document.querySelector('.hero').style.setProperty('--bg-transform', `translateZ(${rate * 0.1}px)`);
            }
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate);
    }
    
    setupMouseTracking() {
        const cards = document.querySelectorAll('.card-3d');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return; // Disable on mobile
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    optimizeForDevice() {
        // Reduce 3D effects on low-performance devices
        const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                                navigator.deviceMemory < 4 || 
                                /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowPerformance) {
            document.documentElement.style.setProperty('--transition-3d', 'all 0.3s ease');
            document.documentElement.style.setProperty('--depth-1', '3px');
            document.documentElement.style.setProperty('--depth-2', '6px');
            document.documentElement.style.setProperty('--depth-3', '9px');
            document.documentElement.style.setProperty('--depth-4', '12px');
        }
    }
}

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contact-form');

// Initialize 3D Portfolio
let portfolio3D;
document.addEventListener('DOMContentLoaded', () => {
    portfolio3D = new Portfolio3D();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.99)';
        navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
        navbar.style.transform = 'translateZ(15px)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
        navbar.style.transform = 'translateZ(0px)';
        navbar.style.borderBottom = '1px solid var(--border-color)';
    }
    
    // Enhanced parallax for floating cards
    const floatingElements = document.querySelectorAll('.floating-card');
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        const rotateY = scrolled * 0.01;
        const translateZ = 15 + (index * 5);
        
        if (window.innerWidth > 768) {
            element.style.transform = `translateY(${yPos}px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        }
    });
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 90;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (targetId.includes('#')) {
            // Handle cross-page navigation with hash
            const [page, hash] = targetId.split('#');
            if (window.location.pathname.includes(page) && hash) {
                e.preventDefault();
                const targetSection = document.querySelector('#' + hash);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Enhanced floating card interactions
document.addEventListener('DOMContentLoaded', () => {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 2.5}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                card.style.animationPlayState = 'paused';
                card.style.transform = 'translateZ(40px) scale(1.1) rotateY(10deg)';
                card.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                card.style.animationPlayState = 'running';
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    });
    
    // Optimize floating cards for mobile
    const optimizeForMobile = () => {
        if (window.innerWidth <= 768) {
            floatingCards.forEach(card => {
                card.style.display = 'flex';
                card.style.position = 'absolute';
                card.style.zIndex = '10';
            });
        }
    };
    
    optimizeForMobile();
    window.addEventListener('resize', optimizeForMobile);
});

// Portfolio filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translateZ(0)';
                }, 100 + (index * 50));
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8) translateZ(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Enhanced 3D button interactions
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            button.style.transform = 'translateY(-5px) translateZ(15px) scale(1.05)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mousedown', () => {
        if (window.innerWidth > 768) {
            button.style.transform = 'translateY(-2px) translateZ(8px) scale(1.02)';
        }
    });
    
    button.addEventListener('mouseup', () => {
        if (window.innerWidth > 768) {
            button.style.transform = 'translateY(-5px) translateZ(15px) scale(1.05)';
        }
    });
});

// Typing animation for hero section
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const words = ['Digital Marketer', 'Graphic Designer', 'Brand Strategist',  'Creative Professional', 'Logo Designer', 'Web Designer', 'Print Designer', 'Visual Designer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typing animation after page load
    setTimeout(typeWriter, 1000);
}

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transform = 'translateZ(5px)';
            }, 100);
        }
    });
};

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Create FormData object
        const formData = new FormData(this);
        
        // Submit form to Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success - redirect to thank you page
                window.location.href = 'thank-you.html';
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again or email me directly.', 'error');
            
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Reset form validation on input change
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background 0.2s;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Enhanced 3D parallax effect for hero section
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // 3D parallax for hero image
    const heroImage = document.querySelector('.hero-image-container');
    if (heroImage && window.innerWidth > 768) {
        const rotateY = Math.min(scrolled * 0.03, 15);
        const translateZ = Math.min(scrolled * 0.08, 25);
        heroImage.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    }
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateZ(0)';
            
            // Add 3D entrance animation
            if (entry.target.classList.contains('card-3d')) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) translateZ(5px)';
                }, 300);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .achievement-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) translateZ(-20px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});

// Enhanced 3D interactions for service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'translateZ(20px) rotateY(15deg) scale(1.1)';
            }
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// 3D Portfolio item interactions
const portfolioItems3D = document.querySelectorAll('.portfolio-item');
portfolioItems3D.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            const overlay = item.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.transform = 'translateZ(10px)';
            }
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const overlay = item.querySelector('.portfolio-overlay');
        if (overlay) {
            overlay.style.transform = '';
        }
    });
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            once: true,
            offset: 100,
            delay: 100,
            disable: 'mobile'
        });
    }
});

// Preloader (optional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Back to top button
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 15px 35px rgba(99, 102, 241, 0.3);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        transform-style: preserve-3d;
        backdrop-filter: blur(10px);
    `;
    
    button.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            button.style.transform = 'translateY(-5px) translateZ(15px) scale(1.15) rotateY(10deg)';
            button.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.5)';
        } else {
            button.style.transform = 'translateY(-3px) scale(1.1)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.3)';
    });
    
    button.addEventListener('click', () => {
        // Add click animation
        button.style.transform = 'translateY(-2px) translateZ(8px) scale(1.05)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            block: 'start'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(button);
};

// Initialize back to top button
createBackToTopButton();

// Enhanced 3D optimization for better performance
const optimize3DPerformance = () => {
    const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                            navigator.deviceMemory < 4 || 
                            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowPerformance) {
        // Reduce 3D effects for low-performance devices
        document.documentElement.style.setProperty('--transition-3d', 'all 0.3s ease');
        document.documentElement.style.setProperty('--depth-1', '3px');
        document.documentElement.style.setProperty('--depth-2', '6px');
        document.documentElement.style.setProperty('--depth-3', '9px');
        document.documentElement.style.setProperty('--depth-4', '12px');
        
        // Disable complex animations
        const complexAnimations = document.querySelectorAll('.floating-card');
        complexAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }
};

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', optimize3DPerformance);

// Improved floating card visibility and interaction
const enhanceFloatingCards = () => {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        // Ensure cards are visible on all devices
        card.style.display = 'flex';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        
        // Add enhanced 3D effects
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                card.style.zIndex = '20';
                card.style.transform = 'translateZ(50px) scale(1.15) rotateY(15deg)';
                card.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                card.style.zIndex = '10';
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
        
        // Mobile optimization
        if (window.innerWidth <= 768) {
            card.style.animation = 'floatingCardMobile 6s ease-in-out infinite';
            card.style.animationDelay = `${index * 2}s`;
        }
    });
};

// Initialize floating card enhancements
document.addEventListener('DOMContentLoaded', enhanceFloatingCards);
window.addEventListener('resize', enhanceFloatingCards);

// Performance monitoring and optimization
const performanceOptimizer = {
    init() {
        this.monitorFPS();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    },
    
    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Reduce 3D effects if FPS is low
                if (fps < 30) {
                    this.reducedMotionMode();
                }
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    },
    
    reducedMotionMode() {
        document.documentElement.style.setProperty('--transition-3d', 'all 0.2s ease');
        const animations = document.querySelectorAll('[style*="animation"]');
        animations.forEach(el => {
            el.style.animationDuration = '0.1s';
        });
        
        // Disable floating card animations
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.animation = 'none';
        });
    },
    
    optimizeAnimations() {
        // Use Intersection Observer to only animate visible elements
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });
        
        const animatedElements = document.querySelectorAll('[class*="float"], [class*="glow"]');
        animatedElements.forEach(el => animationObserver.observe(el));
    },
    
    setupIntersectionObserver() {
        // Optimize 3D effects based on visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.1 });
        
        const elements3D = document.querySelectorAll('.card-3d, .floating-card, .hero-image-container');
        elements3D.forEach(el => observer.observe(el));
    }
};

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    performanceOptimizer.init();
});

// Performance optimization: Lazy loading for images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Console message for developers
console.log(`
🚀 Welcome to Md Maruf Hossen's 3D Portfolio!
✨ Enhanced with modern 3D effects and animations
📧 Contact: mdmarufhossen@duck.com
🌐 Website: https://mdmarufhossen71.site
💼 Available for freelance projects!
🎨 Optimized for both mobile and desktop

Built with ❤️ using cutting-edge 3D web technologies.
`);

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Portfolio Error:', e.message);
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 Service Worker registered successfully');
            })
            .catch(registrationError => {
                console.log('❌ Service Worker registration failed:', registrationError);
            });
    });
}
