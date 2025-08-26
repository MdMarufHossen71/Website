// Modern Portfolio JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contact-form');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
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
                    const offsetTop = targetSection.offsetTop - 80;
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
                }, 100);
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
    const words = ['Graphic Designer', 'Digital Marketer', 'Brand Strategist', 'Creative Professional'];
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
        
        // Create FormData object to handle file uploads
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
    
    // File upload validation
    const fileInput = contactForm.querySelector('input[type="file"]');
    const fileList = document.getElementById('file-list');
    let selectedFiles = [];
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            const maxTotalSize = 30 * 1024 * 1024; // 30MB total
            
            // Add new files to selected files array
            for (let file of files) {
                if (file.size > maxSize) {
                    showNotification(`File "${file.name}" is too large. Maximum file size is 10MB.`, 'error');
                    continue;
                }
                
                // Check if file already exists
                const existingFile = selectedFiles.find(f => f.name === file.name && f.size === file.size);
                if (!existingFile) {
                    selectedFiles.push(file);
                }
            }
            
            // Check total size
            const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
            if (totalSize > maxTotalSize) {
                showNotification('Total file size exceeds 30MB. Please remove some files.', 'error');
                return;
            }
            
            updateFileList();
            updateFileInput();
        });
        
        function updateFileList() {
            fileList.innerHTML = '';
            
            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const fileSize = formatFileSize(file.size);
                const fileIcon = getFileIcon(file.name);
                
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas ${fileIcon} file-icon"></i>
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                    </div>
                    <button type="button" class="file-remove" onclick="removeFile(${index})" title="Remove file">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            });
            
            if (selectedFiles.length > 0) {
                const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
                const totalSizeFormatted = formatFileSize(totalSize);
                showNotification(`${selectedFiles.length} file(s) selected (${totalSizeFormatted} total)`, 'success');
            }
        }
        
        function updateFileInput() {
            // Create a new DataTransfer object to update the file input
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function getFileIcon(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            const iconMap = {
                'pdf': 'fa-file-pdf',
                'doc': 'fa-file-word',
                'docx': 'fa-file-word',
                'txt': 'fa-file-alt',
                'jpg': 'fa-file-image',
                'jpeg': 'fa-file-image',
                'png': 'fa-file-image',
                'gif': 'fa-file-image',
                'zip': 'fa-file-archive',
                'rar': 'fa-file-archive'
            };
            return iconMap[extension] || 'fa-file';
        }
    }
    
    // Global function to remove files (called from HTML)
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        updateFileInput();
        
        if (selectedFiles.length === 0) {
            showNotification('All files removed', 'info');
        }
    };
    
    // Make functions available globally for the file upload
    if (fileInput) {
        const fileList = document.getElementById('file-list');
        let selectedFiles = [];
        
        function updateFileList() {
            fileList.innerHTML = '';
            
            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const fileSize = formatFileSize(file.size);
                const fileIcon = getFileIcon(file.name);
                
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas ${fileIcon} file-icon"></i>
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                    </div>
                    <button type="button" class="file-remove" data-index="${index}" title="Remove file">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            });
            
            // Add event listeners to remove buttons
            fileList.querySelectorAll('.file-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    selectedFiles.splice(index, 1);
                    updateFileList();
                    updateFileInput();
                    
                    if (selectedFiles.length === 0) {
                        showNotification('All files removed', 'info');
                    }
                });
            });
            
            if (selectedFiles.length > 0) {
                const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
                const totalSizeFormatted = formatFileSize(totalSize);
                showNotification(`${selectedFiles.length} file(s) selected (${totalSizeFormatted} total)`, 'success');
            }
        }
        
        function updateFileInput() {
            // Create a new DataTransfer object to update the file input
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function getFileIcon(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            const iconMap = {
                'pdf': 'fa-file-pdf',
                'doc': 'fa-file-word',
                'docx': 'fa-file-word',
                'txt': 'fa-file-alt',
                'jpg': 'fa-file-image',
                'jpeg': 'fa-file-image',
                'png': 'fa-file-image',
                'gif': 'fa-file-image',
                'zip': 'fa-file-archive',
                'rar': 'fa-file-archive'
            };
            return iconMap[extension] || 'fa-file';
        }
        
        fileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            const maxTotalSize = 30 * 1024 * 1024; // 30MB total
            
            // Add new files to selected files array
            for (let file of files) {
                if (file.size > maxSize) {
                    showNotification(`File "${file.name}" is too large. Maximum file size is 10MB.`, 'error');
                    continue;
                }
                
                // Check if file already exists
                const existingFile = selectedFiles.find(f => f.name === file.name && f.size === file.size);
                if (!existingFile) {
                    selectedFiles.push(file);
                }
            }
            
            // Check total size
            const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
            if (totalSize > maxTotalSize) {
                showNotification('Total file size exceeds 30MB. Please remove some files.', 'error');
                // Remove the last added files that exceeded the limit
                while (selectedFiles.reduce((sum, file) => sum + file.size, 0) > maxTotalSize && selectedFiles.length > 0) {
                    selectedFiles.pop();
                }
            }
            
            updateFileList();
            updateFileInput();
        });
    }
    
    // Remove duplicate file handling code
    const originalFileInput = contactForm.querySelector('input[type="file"]');
    if (originalFileInput && !originalFileInput.hasAttribute('data-enhanced')) {
        originalFileInput.setAttribute('data-enhanced', 'true');
        
        originalFileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            const maxTotalSize = 30 * 1024 * 1024; // 30MB total
            let totalSize = 0;
            let validFiles = [];
            
            for (let file of files) {
                if (file.size > maxSize) {
                    showNotification(`File "${file.name}" is too large. Maximum file size is 10MB.`, 'error');
                    continue;
                }
                validFiles.push(file);
                totalSize += file.size;
            }
            
            if (totalSize > maxTotalSize) {
                showNotification('Total file size exceeds 30MB. Please select fewer or smaller files.', 'error');
                this.value = ''; // Clear the input
                return;
            }
            
            if (validFiles.length > 0) {
                const fileNames = validFiles.map(file => file.name).join(', ');
                const totalSizeFormatted = formatFileSize(totalSize);
                showNotification(`${validFiles.length} file(s) selected: ${fileNames} (${totalSizeFormatted} total)`, 'success');
            }
        });
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
    
    // Clean up duplicate code - remove the old file handling
    const duplicateFileInput = contactForm.querySelector('input[type="file"]:not([data-enhanced])');
    if (duplicateFileInput) {
        duplicateFileInput.addEventListener('change', function() {
            const files = this.files;
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            let totalSize = 0;
            
            for (let file of files) {
                totalSize += file.size;
                if (file.size > maxSize) {
                    showNotification(`File "${file.name}" is too large. Maximum file size is 10MB.`, 'error');
                    this.value = ''; // Clear the input
                    return;
                }
            }
            
            if (totalSize > maxSize * 3) { // Max 30MB total
                showNotification('Total file size is too large. Please reduce the number of files or compress them.', 'error');
                this.value = ''; // Clear the input
                return;
            }
            
            if (files.length > 0) {
                const fileNames = Array.from(files).map(file => file.name).join(', ');
                showNotification(`${files.length} file(s) selected: ${fileNames}`, 'success');
            }
        });
    }
    
    // Reset form validation on input change
    const formInputs = contactForm.querySelectorAll('input:not([type="file"]), select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                submitBtn.innerHTML = originalText;
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
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
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
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
        box-shadow: var(--shadow-lg);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.1)';
        button.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = 'var(--shadow-lg)';
    });
    
    button.addEventListener('click', () => {
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
🚀 Welcome to Md Maruf Hossen's Portfolio!
📧 Contact: mdmarufhossen@duck.com
🌐 Website: https://mdmarufhossen71.site
💼 Available for freelance projects!

Built with ❤️ using modern web technologies.
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
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}