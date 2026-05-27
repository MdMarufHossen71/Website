// Modern Portfolio JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('a.nav-link');
const navDropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contact-form');

// -----------------------------------------------------------------------
// NAVBAR: handled globally by /assets/js/smart-navbar.js (loaded in HTML)
// -----------------------------------------------------------------------

// Scroll-dependent helpers (NOT navbar — those live in smart-navbar.js)
let _scrollTicking = false;

const updateScrollButtons = (scrollTop) => {
    const scrollButtons = document.querySelector('.scroll-buttons');
    if (scrollButtons) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Only show the scroll buttons (Move to Top) when the user reaches the absolute bottom/end of the page
        if (scrollTop + windowHeight >= documentHeight - 120) {
            scrollButtons.classList.add('visible');
        } else {
            scrollButtons.classList.remove('visible');
        }
    }
};

const handleScrollExtras = () => {
    const scrollY = window.scrollY;

    // Show/hide scroll-to-top buttons
    updateScrollButtons(scrollY);

    // Update active nav link based on scroll position
    updateActiveNavLink();

    // Animate skill bars if in viewport
    if (typeof animateSkillBars === 'function') {
        animateSkillBars();
    }

    // Parallax visual updates
    if (typeof updateParallax === 'function') {
        updateParallax();
    }
};

const onScrollExtras = () => {
    if (!_scrollTicking) {
        window.requestAnimationFrame(() => {
            handleScrollExtras();
            _scrollTicking = false;
        });
        _scrollTicking = true;
    }
};

window.addEventListener('scroll', onScrollExtras, { passive: true });


// Mobile menu toggle
function setMenuState(isOpen) {
    if (!navMenu || !navToggle) return;

    navMenu.classList.toggle('active', isOpen);
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
        document.body.style.overflow = 'hidden';
        navbar?.classList.remove('hidden');
        navbar?.classList.add('visible');
    } else {
        document.body.style.overflow = '';
    }
}


// Navigation dropdown toggle (mobile + keyboard)
navDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = toggle.closest('.nav-dropdown');
        const isOpen = item?.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach((item) => {
        item.classList.remove('open');
        const button = item.querySelector('.nav-dropdown-toggle');
        if (button) button.setAttribute('aria-expanded', 'false');
    });
});

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenuState(!navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuState(false);
            navToggle.focus();
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setMenuState(false);
    });
});

// Cache section positions to prevent layout thrashing during scroll
let sectionPositions = [];

function cacheSectionPositions() {
    sectionPositions = [];
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionPositions.push({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.offsetHeight
        });
    });
}

// Initialize caching after DOM loads and on resize/load events
document.addEventListener('DOMContentLoaded', cacheSectionPositions);
window.addEventListener('resize', cacheSectionPositions);
window.addEventListener('load', cacheSectionPositions);

// Function to update active nav link based on cached scroll positions
function updateActiveNavLink() {
    const scrollPosition = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop) + 150;

    sectionPositions.forEach(sec => {
        if (scrollPosition >= sec.top && scrollPosition < sec.top + sec.height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === `#${sec.id}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    });
}

// Initial calculation
cacheSectionPositions();
updateActiveNavLink();

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
        
        portfolioItems.forEach((item, index) => {
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

window.addEventListener('load', animateSkillBars);

// Create scroll buttons
const createScrollButtons = () => {
    const scrollButtons = document.createElement('div');
    scrollButtons.className = 'scroll-buttons';
    scrollButtons.innerHTML = `
        <button class="scroll-btn scroll-up" title="Scroll to top">
            <i class="fas fa-chevron-up"></i>
        </button>
    `;
    
    document.body.appendChild(scrollButtons);
    
    const scrollUpBtn = scrollButtons.querySelector('.scroll-up');
    
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
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
    
    // Initialize Premium Upgrades
    initThemeSwitcher();
    initCustomCursor();
    initCardTilts();
    initRoiCalculator();
    initPortfolioLightbox();
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
📧 Contact: official@mdmarufhossen71.site
🌐 Website: https://mdmarufhossen71.site
💼 Available for freelance projects!

🎨 Optimized for performance and accessibility

Built with ❤️ using modern web technologies.
`);

// --- THEME SWITCHER SYSTEM ---
const initThemeSwitcher = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Create Sweep Element
    const sweep = document.createElement('div');
    sweep.className = 'theme-transition-sweep';
    document.body.appendChild(sweep);

    const savedTheme = localStorage.getItem('portfolio-theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Trigger Sweep Transition
        sweep.classList.add('theme-transition-active');
        
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        }, 350); // Midpoint of animation

        setTimeout(() => {
            sweep.classList.remove('theme-transition-active');
        }, 750);
    });
};

// --- Glowing Custom Cursor ---
const initCustomCursor = () => {
    if (window.innerWidth <= 991) return; // Disable on tablet/mobile
    
    document.body.classList.add('has-custom-cursor');
    
    const dot = document.createElement('div');
    const outline = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    outline.className = 'custom-cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    let mouse = { x: 0, y: 0 };
    let cursorDotPos = { x: 0, y: 0 };
    let cursorOutlinePos = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const tick = () => {
        // Dot position instantly
        cursorDotPos.x = mouse.x;
        cursorDotPos.y = mouse.y;
        dot.style.left = `${cursorDotPos.x}px`;
        dot.style.top = `${cursorDotPos.y}px`;

        // Outline position with interpolation (inertia)
        const ease = 0.15;
        cursorOutlinePos.x += (mouse.x - cursorOutlinePos.x) * ease;
        cursorOutlinePos.y += (mouse.y - cursorOutlinePos.y) * ease;
        outline.style.left = `${cursorOutlinePos.x}px`;
        outline.style.top = `${cursorOutlinePos.y}px`;

        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Cursor hover bindings
    const interactiveSelector = 'a, button, select, input, textarea, .filter-btn, .service-card, .portfolio-item, .achievement-card';
    const updateHoverState = () => {
        const hoverables = document.querySelectorAll(interactiveSelector);
        hoverables.forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = 'true';
            
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    };
    updateHoverState();
    
    // Re-bind when grid filters/modals change dynamically
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });
};

// --- 3D INTERACTIVE CARD TILTS ---
const initCardTilts = () => {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .achievement-card, .experience-card');
    
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10; // Max 10 deg tilt
            const rotateY = ((x - centerX) / centerX) * -10; // invert for natural tilt
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            card.style.boxShadow = `0 20px 40px rgba(99, 102, 241, 0.22)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
            card.style.boxShadow = '';
        });
    });
};

// --- STRATEGIC ROI & CAMPAIGN PLANNER CALCULATOR ---
const initRoiCalculator = () => {
    const budgetSlider = document.getElementById('calc-budget');
    const channelSelect = document.getElementById('calc-channel');
    const industrySelect = document.getElementById('calc-industry');
    
    if (!budgetSlider || !channelSelect || !industrySelect) return;
    
    const budgetValue = document.getElementById('budget-value');
    const resultReach = document.getElementById('result-reach');
    const resultTraffic = document.getElementById('result-traffic');
    const resultLeads = document.getElementById('result-leads');
    const resultRoi = document.getElementById('result-roi');
    const blueprintList = document.getElementById('blueprint-list');
    const calcCta = document.getElementById('calc-cta');
    
    const calculateProjections = () => {
        const budget = parseInt(budgetSlider.value);
        const channel = channelSelect.value;
        const industry = industrySelect.value;
        
        // Update budget text indicator
        budgetValue.textContent = `$${budget.toLocaleString()}`;
        
        // 1. Calculations
        let reachMin = 0, reachMax = 0;
        let ctrMin = 0.02, ctrMax = 0.05;
        let crMin = 0.015, crMax = 0.035;
        let roiMultiplier = 3.5;
        
        // Channel factors
        if (channel === 'digital-marketing') {
            reachMin = budget * 85;
            reachMax = budget * 220;
            ctrMin = 0.03; ctrMax = 0.06;
            roiMultiplier = 4.2;
        } else if (channel === 'seo') {
            reachMin = budget * 110;
            reachMax = budget * 280;
            ctrMin = 0.025; ctrMax = 0.055;
            roiMultiplier = 4.8;
        } else if (channel === 'web-design') {
            reachMin = budget * 25;
            reachMax = budget * 60;
            ctrMin = 0.045; ctrMax = 0.085;
            roiMultiplier = 3.8;
        } else if (channel === 'brand-identity') {
            reachMin = budget * 15;
            reachMax = budget * 40;
            ctrMin = 0.05; ctrMax = 0.10;
            roiMultiplier = 3.2;
        }
        
        // Industry conversion adjustments
        if (industry === 'ecommerce') {
            crMin = 0.018; crMax = 0.038;
            roiMultiplier += 0.4;
        } else if (industry === 'local-business') {
            crMin = 0.04; crMax = 0.08;
            roiMultiplier += 0.8; // High local conversion
        } else if (industry === 'tech-startup') {
            crMin = 0.012; crMax = 0.028;
            roiMultiplier -= 0.3; // Longer conversion cycle
        } else if (industry === 'professional-services') {
            crMin = 0.025; crMax = 0.055;
            roiMultiplier += 0.2;
        }
        
        // Final numbers
        const finalReachMin = Math.round(reachMin);
        const finalReachMax = Math.round(reachMax);
        
        const finalTrafficMin = Math.round(finalReachMin * ctrMin);
        const finalTrafficMax = Math.round(finalReachMax * ctrMax);
        
        const finalLeadsMin = Math.max(1, Math.round(finalTrafficMin * crMin));
        const finalLeadsMax = Math.max(1, Math.round(finalTrafficMax * crMax));
        
        // Render Output numbers
        resultReach.textContent = `${finalReachMin.toLocaleString()} - ${finalReachMax.toLocaleString()}`;
        resultTraffic.textContent = `${finalTrafficMin.toLocaleString()} - ${finalTrafficMax.toLocaleString()}`;
        resultLeads.textContent = `${finalLeadsMin.toLocaleString()} - ${finalLeadsMax.toLocaleString()}`;
        resultRoi.textContent = `${roiMultiplier.toFixed(1)}x ROI`;
        
        // 2. Blueprint Roadmaps Generative Engine
        let blueprintItems = [];
        if (budget <= 500) {
            blueprintItems = [
                "Essential Platform Tracking Setup (Google Search Console / Pixel tracking)",
                "4 Conversion-focused High-Quality Graphic Templates (designed in Photoshop)",
                "2 Targeted SEO or Hook Content Templates tailored to your specific audience",
                "Weekly analytics checkup & basic target updates by Maruf"
            ];
        } else if (budget > 500 && budget <= 2000) {
            blueprintItems = [
                "Full Competitor Analysis & Search Intent mapping for optimal targeting",
                "8 Professional Graphic designs & Brand Guidelines (Logo revisions, color palette check)",
                "6 custom SEO Copy writing posts or ad creatives optimized for conversion rate",
                "Dedicated monthly reporting, pixel diagnostics, & A/B testing of hooks"
            ];
        } else {
            blueprintItems = [
                "Omnichannel Retargeting Funnel setup & full technical Schema configuration",
                "15+ custom premium visuals, custom icons, & full brand styling templates",
                "Conversion Rate Optimization (CRO) review of landing pages for maximal lead flow",
                "Ongoing bi-weekly consultations & priority 24/7 campaign modifications"
            ];
        }
        
        blueprintList.innerHTML = blueprintItems.map(item => `<li>${item}</li>`).join('');
    };
    
    // Bind listeners
    budgetSlider.addEventListener('input', calculateProjections);
    channelSelect.addEventListener('change', calculateProjections);
    industrySelect.addEventListener('change', calculateProjections);
    
    // Run initial calculation
    calculateProjections();
    
    // Bind CTA click to contact form pre-fill and smooth scroll
    calcCta.addEventListener('click', () => {
        const budget = budgetSlider.value;
        const channel = channelSelect.options[channelSelect.selectedIndex].text;
        const industry = industrySelect.options[industrySelect.selectedIndex].text;
        const roiVal = resultRoi.textContent;
        
        // Fill Service field
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            const channelVal = channelSelect.value;
            // Map values
            if (channelVal === 'brand-identity') serviceSelect.value = 'brand-identity';
            else if (channelVal === 'web-design') serviceSelect.value = 'web-design';
            else if (channelVal === 'seo') serviceSelect.value = 'web-design';
            else serviceSelect.value = 'consultation';
            
            // Dispatch change event to remove red validation borders
            serviceSelect.dispatchEvent(new Event('change'));
            serviceSelect.style.borderColor = '';
        }
        
        // Fill Message/Details field
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.value = `Hi Maruf,\n\nI just planned my project on your website calculator and would like to claim my custom campaign plan!\n\n- Monthly Budget: $${parseInt(budget).toLocaleString()}\n- Primary Channel: ${channel}\n- Industry: ${industry}\n- Projected ROAS: ${roiVal}\n\nPlease contact me to discuss how we can launch this campaign!`;
            messageTextarea.style.borderColor = '';
        }
        
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Show successful pre-fill notification
            if (typeof showNotification === 'function') {
                showNotification('Your Campaign Plan details have been pre-filled in the Contact Form below!', 'success');
            }
        }
    });
};

// --- PORTFOLIO CASE STUDY LIGHTBOX ---
const initPortfolioLightbox = () => {
    const lightbox = document.getElementById('portfolio-lightbox');
    const overlay = document.getElementById('lightbox-overlay');
    const closeBtn = document.getElementById('lightbox-close');
    const body = document.getElementById('lightbox-body');
    const items = document.querySelectorAll('.portfolio-item');
    
    if (!lightbox || !body || items.length === 0) return;
    
    // Detailed Case Studies Database
    const caseStudies = {
        "Restaurant Social Media Marketing Campaign": {
            tags: ["Social Media Marketing", "Content Strategy", "Canva Pro"],
            image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "A local restaurant in Gazipur wanted to increase weekend foot traffic and build local brand awareness, but lacked a consistent content cadence and targeted advertising strategy.",
            solution: "Designed and implemented a comprehensive social media marketing calendar featuring highly aesthetic behind-the-scenes content, customer video reviews, and weekly menu highlights. Ran hyper-local Facebook and Instagram ad campaigns targeting users within a 10km radius with customized graphic menus.",
            resultsVal: "+300% Engagement",
            resultsLabel: "Social Reach Growth",
            metrics: [
                "50+ new customers tracked directly from social campaigns weekly",
                "Average local ad click-through rate (CTR) optimized to 6.2%",
                "Built persistent social proof template loops reducing design time by 40%"
            ],
            tools: ["Adobe Photoshop", "Canva Pro", "Facebook Ads Manager", "Google Analytics"]
        },
        "Tech Startup Brand Identity Design": {
            tags: ["Custom Logo Design", "Brand Identity", "Graphic Design"],
            image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "A rising tech startup needed a clean, modern, and memorable brand identity to appeal to venture capital investors and early B2B customers, requiring more than a generic logomark.",
            solution: "Conducted intensive grid vector analysis to craft a unique minimalist logomark that represents continuous growth and technical precision. Designed a balanced color hierarchy supporting accessibility contrast, custom B2B icon packs, and delivered a 25-page comprehensive brand guidelines manual.",
            resultsVal: "100% Consistent",
            resultsLabel: "Brand Identity Audit Score",
            metrics: [
                "Fully unique scalable vector logo designed from scratch in Illustrator",
                "Custom geometric iconography set implemented across dashboard UI",
                "Delivered print-ready letterheads, business cards, and digital decks"
            ],
            tools: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Vector Grids"]
        },
        "Professional E-commerce Website Design": {
            tags: ["SEO Web Design", "UI/UX Optimization", "Responsive Design"],
            image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "An e-commerce retailer was receiving decent organic traffic but suffered from a high shopping cart abandonment rate (74%) due to a slow, un-optimized mobile checkout flow.",
            solution: "Redesigned the complete storefront with a conversion-first mobile UI layout. Engineered clean category filters, clear checkout steps, and implemented technical structured data schemas to capture high-intent Google search traffic.",
            resultsVal: "+45% Conversions",
            resultsLabel: "Cart Abandonment Drop",
            metrics: [
                "Boosted mobile site load speed by optimizing web image assets",
                "Created persistent schema structures boosting search rankings",
                "Structured prominent trust signals and review feeds to optimize buying intent"
            ],
            tools: ["Figma", "HTML5 & CSS3", "JavaScript", "Google Search Console"]
        },
        "Professional Corporate Brochure Design": {
            tags: ["Professional Print Design", "Corporate Branding", "Illustrator"],
            image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "A prestigious financial consulting firm in Dhaka needed an authoritative print brochure to hand out at high-level business networking dinners, representing complex advisory figures cleanly.",
            solution: "Crafted a beautiful 16-page landscape corporate profile brochure. Selected a strong geometric layout grid, coupled luxury serif headings with highly legible body typography, and designed premium vector charts to display growth benchmarks.",
            resultsVal: "100% Print-Ready",
            resultsLabel: "CMYK Vector Precision",
            metrics: [
                "Created beautiful minimalist print templates with full bleed margins",
                "Visualized 4 complex financial data models into neat intuitive graphics",
                "Approved and successfully printed over 2,000 corporate copies"
            ],
            tools: ["Adobe Illustrator", "Adobe InDesign", "Photoshop"]
        },
        "Professional Email Marketing Campaign": {
            tags: ["Email Marketing", "Marketing Automation", "Copywriting"],
            image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "An educational coaching service had a large, cold subscriber list (3,000+ contacts) that was completely unmonetized due to lack of a structured campaign sequence.",
            solution: "Wrote and implemented a highly engaging 5-step welcome sequence focusing on storytelling, offering immediate value, and resolving client objections. Set up automated behavioral logic triggers and weekly educational newsletters.",
            resultsVal: "42.5% Open Rate",
            resultsLabel: "Industry Lead Average: 18%",
            metrics: [
                "Maintained record low unsubscribe rates through value-first copy",
                "Conducted subject hook A/B tests yielding +35% click metrics",
                "Generated substantial direct sales revenue from cold contacts in 30 days"
            ],
            tools: ["Mailchimp Automation", "Persuasive Copywriting", "Analytics"]
        },
        "Professional Logo Design Collection": {
            tags: ["Custom Logo Design", "Professional Branding", "Illustrator"],
            image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
            challenge: "Various small business clients faced the challenge of stand-out identity recognition in saturated industries, requiring custom vector logomarks.",
            solution: "Designed multiple distinct custom logos using robust vector geometry grids, tailored typographic pairings, and thorough scalability testing (verified high legibility from 16px favicons to billboard sizes).",
            resultsVal: "15+ Custom Marks",
            resultsLabel: "Registered Trademarks",
            metrics: [
                "Delivered full vector source files (AI, EPS, SVG, PDF) for all clients",
                "Ensured color variations supporting dark/light UI layers perfectly",
                "Achieved 100% client satisfaction ratings across all collections"
            ],
            tools: ["Adobe Illustrator", "Figma Design Tools", "Grid Vector Geometry"]
        }
    };
    
    const openLightbox = (title) => {
        const data = caseStudies[title];
        if (!data) return;
        
        // Render dynamic HTML structure inside modal
        body.innerHTML = `
            <div class="lightbox-hero">
                <h2>${title}</h2>
                <div class="lightbox-tags">
                    ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="lightbox-grid">
                <div class="lightbox-main-details">
                    <h3><i class="fas fa-exclamation-circle" style="color:var(--primary-color);"></i> The Challenge</h3>
                    <p>${data.challenge}</p>
                    
                    <h3><i class="fas fa-check-circle" style="color:var(--accent-color);"></i> The Creative Solution</h3>
                    <p>${data.solution}</p>
                    
                    <h3><i class="fas fa-star" style="color:var(--secondary-color);"></i> Direct Performance Metrics</h3>
                    <ul class="blueprint-list">
                        ${data.metrics.map(metric => `<li>${metric}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="lightbox-sidebar">
                    <div class="lightbox-metric-card">
                        <div class="lightbox-metric-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="lightbox-metric-info">
                            <span class="lightbox-metric-label">${data.resultsLabel}</span>
                            <span class="lightbox-metric-val">${data.resultsVal}</span>
                        </div>
                    </div>
                    
                    <h3><i class="fas fa-tools"></i> Production Tools</h3>
                    <ul class="lightbox-tools-list">
                        ${data.tools.map(tool => `<li><i class="fas fa-check"></i> ${tool}</li>`).join('')}
                    </ul>
                    
                    <button type="button" class="btn btn-primary" id="lightbox-inquire-btn" style="width:100%;margin-top:1.5rem;justify-content:center;">
                        <i class="fas fa-paper-plane"></i>
                        Inquire About a Similar Plan
                    </button>
                </div>
            </div>
        `;
        
        // Show modal
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first close button for keyboard accessibility
        closeBtn.focus();
        
        // Add listener to lightbox Inquiry CTA button
        const inquireBtn = document.getElementById('lightbox-inquire-btn');
        if (inquireBtn) {
            inquireBtn.addEventListener('click', () => {
                closeLightbox();
                
                // Pre-fill service form
                const serviceSelect = document.getElementById('service');
                const messageTextarea = document.getElementById('message');
                
                if (serviceSelect) {
                    // Smart match
                    if (title.includes('Social') || title.includes('Email')) serviceSelect.value = 'consultation';
                    else if (title.includes('Logo') || title.includes('Brand')) serviceSelect.value = 'brand-identity';
                    else if (title.includes('Website') || title.includes('E-commerce')) serviceSelect.value = 'web-design';
                    else serviceSelect.value = 'print-design';
                    
                    serviceSelect.dispatchEvent(new Event('change'));
                }
                
                if (messageTextarea) {
                    messageTextarea.value = `Hi Maruf,\n\nI just reviewed your case study for "${title}" inside your portfolio, and I am extremely interested in launching a similar project with you!\n\nPlease let me know your availability for a brief strategic consultation.`;
                }
                
                // Scroll to contact form
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    if (typeof showNotification === 'function') {
                        showNotification(`Inquiry details for "${title}" have been pre-filled below!`, 'success');
                    }
                }
            });
        }
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Empty body content after closing transitions are complete
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                body.innerHTML = '';
            }
        }, 400);
    };
    
    // Bind click events on portfolio cards
    items.forEach(item => {
        const imageWrapper = item.querySelector('.portfolio-image');
        const titleText = item.querySelector('h3')?.textContent;
        
        if (imageWrapper && titleText) {
            // Make image pointer events cursor:pointer
            imageWrapper.style.cursor = 'pointer';
            
            imageWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(titleText.trim());
            });
        }
    });
    
    // Close triggers
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    
    // Keyboard Escape Key close support
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
};

