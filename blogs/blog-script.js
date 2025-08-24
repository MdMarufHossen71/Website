// Blog JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle Functionality
    const langToggle = document.getElementById('lang-toggle');
    const currentLangSpan = document.getElementById('current-lang');
    let currentLanguage = 'en';

    // Initialize language
    updateLanguage(currentLanguage);

    langToggle.addEventListener('click', function() {
        currentLanguage = currentLanguage === 'en' ? 'bn' : 'en';
        updateLanguage(currentLanguage);
        currentLangSpan.textContent = currentLanguage.toUpperCase();
    });

    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-bn]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }

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
            
            blogCards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
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
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Subscribed!</span>';
                submitBtn.style.background = 'var(--accent-color)';
                
                // Show success notification
                showNotification(
                    currentLanguage === 'en' 
                        ? 'Successfully subscribed to newsletter!' 
                        : 'নিউজলেটারে সফলভাবে সাবস্ক্রাইব হয়েছে!', 
                    'success'
                );

                // Reset form
                this.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 2000);
        });
    }

    // Load More Functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="loading"></div> <span>Loading...</span>';
            this.disabled = true;

            // Simulate loading more posts
            setTimeout(() => {
                // Here you would typically load more posts from an API
                showNotification(
                    currentLanguage === 'en' 
                        ? 'More posts coming soon!' 
                        : 'আরো পোস্ট শীঘ্রই আসছে!', 
                    'info'
                );

                this.innerHTML = originalText;
                this.disabled = false;
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
        observer.observe(card);
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 50,
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
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
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
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
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
📝 Blog System Loaded Successfully!
🌐 Multi-language support: English & Bengali
📱 Responsive design optimized
🎨 Modern UI with smooth animations
📊 Analytics ready for tracking

Built with ❤️ by Md Maruf Hossen
`);