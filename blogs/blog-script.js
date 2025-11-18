// Blog JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Category Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            
            blogCards.forEach((card, index) => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100 + (index * 50));
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Newsletter Subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<div class="loading"></div> <span>Subscribing...</span>';
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Subscribed!</span>';
                submitBtn.style.background = 'var(--accent-color)';
                submitBtn.style.transform = 'scale(1.05)';
                
                // Show success notification
                showNotification('Successfully subscribed to newsletter!', 'success');

                // Reset form
                this.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.transform = '';
                }, 3000);
            }, 2000);
        });
    }

    // Load More Functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="loading"></div> <span>Loading more posts...</span>';
            this.disabled = true;
            this.style.transform = 'scale(0.95)';

            // Simulate loading more posts
            setTimeout(() => {
                // Here you would typically load more posts from an API
                showNotification('More posts coming soon!', 'info');

                this.innerHTML = originalText;
                this.disabled = false;
                this.style.transform = '';
            }, 2000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });
    
    // Enhanced smooth scrolling for cross-page navigation
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.includes('../index.html#')) {
                // Let the browser handle cross-page navigation
                return;
            }
        });
    });

    // Search functionality (for future implementation)
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-post-title a').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = title.includes(searchTerm) || 
                               excerpt.includes(searchTerm) || 
                               tags.some(tag => tag.includes(searchTerm));
                
                if (isMatch || searchTerm === '') {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }

    // Reading progress bar (for blog post pages)
    function createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: var(--gradient-primary);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Initialize reading progress bar if on blog post page
    if (document.querySelector('.blog-post-container')) {
        createReadingProgressBar();
    }

    // Social sharing functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // facebook, twitter, etc.
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title} ${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe blog cards for animation
    blogCards.forEach(card => {
        card.classList.add('fade-in');
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });

    // Initialize AOS
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

    // Mobile menu functionality
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
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

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.querySelector('.navbar').contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScrollTop = 0;
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Background and shadow effects
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                navbar.style.transform = 'translateZ(10px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                navbar.style.transform = 'translateZ(0px)';
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScrollTop > 100) {
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
        });
    }
});

// Notification function (reused from main script)
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
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn3D 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        backdrop-filter: blur(10px);
    `;
    
    // Add enhanced animation keyframes
    if (!document.querySelector('#notification-styles-3d')) {
        const style = document.createElement('style');
        style.id = 'notification-styles-3d';
        style.textContent = `
            @keyframes slideIn3D {
                from {
                    transform: translateX(100%) translateZ(-20px) rotateY(15deg);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) translateZ(0) rotateY(0deg);
                    opacity: 1;
                }
            }
            @keyframes slideOut3D {
                from {
                    transform: translateX(0) translateZ(0) rotateY(0deg);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%) translateZ(-20px) rotateY(-15deg);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateZ(5px) scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut3D 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 600);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut3D 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 600);
        }
    }, 5000);
}

// Blog post reading time calculator
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
}

// Auto-update reading time for blog posts
document.addEventListener('DOMContentLoaded', function() {
    const blogContent = document.querySelector('.blog-post-content');
    const readingTimeElement = document.querySelector('.reading-time');
    
    if (blogContent && readingTimeElement) {
        const readingTime = calculateReadingTime(blogContent.textContent);
        readingTimeElement.textContent = `${readingTime} min read`;
    }
});

// Console message
console.log(`
📝 Modern Blog System Loaded Successfully!
✨ Clean design with smooth animations
🌐 Multi-language support: English & Bengali
📱 Responsive design optimized
🎨 Modern UI with smooth animations
📊 Analytics ready for tracking
🚀 Optimized for performance

Built with ❤️ by Md Maruf Hossen
`);