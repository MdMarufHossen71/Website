// Modern Portfolio JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contact-form');

// Enhanced Navbar scroll effect with hide/show functionality
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Background and shadow effects
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.15)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.borderBottom = '1px solid var(--border-color)';
    }
    
    // Hide/show navbar based on scroll direction
    if (currentScrollTop > 100) { // Only apply hide/show after scrolling past hero
        if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
            navbar.classList.remove('visible');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
    } else {
        // Always show navbar when near top
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    }
    
    // Clear timeout and set new one to show navbar after scroll stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    }, 150);
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    
    // Show/hide scroll buttons
    const scrollButtons = document.querySelector('.scroll-buttons');
    if (scrollButtons) {
        if (window.scrollY > 300) {
            scrollButtons.classList.add('visible');
        } else {
            scrollButtons.classList.remove('visible');
        }
    }
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
                    item.style.transform = 'scale(1)';
                }, 100 + (index * 50));
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
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

// Create scroll buttons
const createScrollButtons = () => {
    const scrollButtons = document.createElement('div');
    scrollButtons.className = 'scroll-buttons';
    scrollButtons.innerHTML = `
        <button class="scroll-btn scroll-up" title="Scroll to top">
            <i class="fas fa-chevron-up"></i>
        </button>
        <button class="scroll-btn scroll-down" title="Scroll down">
            <i class="fas fa-chevron-down"></i>
        </button>
    `;
    
    document.body.appendChild(scrollButtons);
    
    const scrollUpBtn = scrollButtons.querySelector('.scroll-up');
    const scrollDownBtn = scrollButtons.querySelector('.scroll-down');
    
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollDownBtn.addEventListener('click', () => {
        const currentSection = getCurrentSection();
        const nextSection = getNextSection(currentSection);
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Update scroll button visibility
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show buttons when not on home section
        const homeSection = document.getElementById('home');
        const homeSectionBottom = homeSection ? homeSection.offsetTop + homeSection.offsetHeight : 0;
        
        if (scrolled > homeSectionBottom - 200) {
            scrollButtons.classList.add('visible');
        } else {
            scrollButtons.classList.remove('visible');
        }
        
        // Hide down button when at bottom
        if (scrolled + windowHeight >= documentHeight - 100) {
            scrollDownBtn.style.display = 'none';
        } else {
            scrollDownBtn.style.display = 'flex';
        }
    });
};

// Helper functions for scroll buttons
const getCurrentSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPosition) {
            return sections[i];
        }
    }
    return sections[0];
};

const getNextSection = (currentSection) => {
    const sections = document.querySelectorAll('section[id]');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    return sections[currentIndex + 1] || null;
};

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
    const heroSection = document.querySelector('.hero');

    // Only apply parallax within hero section
    if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const isInHeroSection = heroRect.top < window.innerHeight && heroRect.bottom > 0;

        // 3D parallax for hero image
        const heroImage = document.querySelector('.hero-image-container');
        if (heroImage && window.innerWidth > 768 && isInHeroSection) {
            const scrollPercent = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
            const rotateY = scrollPercent * 10;
            const translateZ = scrollPercent * 15;
            heroImage.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        } else if (heroImage) {
            heroImage.style.transform = 'rotateY(0deg) translateZ(0px)';
        }
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
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .achievement-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Initialize scroll buttons
    createScrollButtons();
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
            disable: false
        });
    }
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
🚀 Welcome to Md Maruf Hossen's Modern Portfolio!
✨ Clean, modern design with smooth animations
📧 Contact: mdmarufhossen@duck.com
🌐 Website: https://mdmarufhossen71.site
💼 Available for freelance projects!

🎨 Optimized for performance and accessibility

Built with ❤️ using modern web technologies.
`);

