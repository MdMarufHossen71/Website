// Floating Bubbles Animation System
// Dynamic skill bubble animation with sequential display

class FloatingBubbleManager {
    constructor() {
        // Full list of skills with their corresponding icons
        this.skills = [
            { name: 'Social Media', icon: 'fab fa-facebook' },
            { name: 'Analytics', icon: 'fas fa-chart-line' },
            { name: 'Design', icon: 'fas fa-palette' },
            { name: 'Digital Marketing', icon: 'fas fa-bullhorn' },
            { name: 'Graphic Design', icon: 'fas fa-paint-brush' },
            { name: 'Web Design', icon: 'fas fa-laptop-code' },
            { name: 'Branding', icon: 'fas fa-copyright' },
            { name: 'Content Strategy', icon: 'fas fa-pen-nib' },
            { name: 'SEO', icon: 'fas fa-search' }
        ];

        // Animation configuration
        this.config = {
            bubblesPerSet: 3,           // Maximum 3 bubbles at once
            displayDuration: 4000,       // How long bubbles stay visible (4s)
            fadeInDuration: 800,         // Fade-in time (0.8s)
            fadeOutDuration: 800,        // Fade-out time (0.8s)
            gapBetweenSets: 600,        // Gap with no bubbles visible (0.6s)
            floatAnimationDelay: 100     // Stagger float animation start
        };

        // Bubble positions for desktop
        this.positions = [
            { top: '15%', left: '-15%', right: 'auto', bottom: 'auto' },
            { top: '65%', left: 'auto', right: '-15%', bottom: 'auto' },
            { top: 'auto', left: '-8%', right: 'auto', bottom: '25%' }
        ];

        // Mobile positions (closer to image)
        this.mobilePositions = [
            { top: '10%', left: '-10%', right: 'auto', bottom: 'auto' },
            { top: '70%', left: 'auto', right: '-10%', bottom: 'auto' },
            { top: 'auto', left: '-5%', right: 'auto', bottom: '15%' }
        ];

        this.container = document.getElementById('floating-elements');
        this.currentIndex = 0;
        this.currentBubbles = [];
        this.isAnimating = false;
        this.isMobile = window.innerWidth <= 768;

        // Performance optimization flags
        this.isInViewport = true;
        this.isPageVisible = true;

        this.init();
    }

    init() {
        if (!this.container) return;

        // Set up visibility change detection for performance
        this.setupVisibilityDetection();

        // Set up resize handler with debounce
        this.setupResizeHandler();

        // Start the animation cycle
        this.startAnimationCycle();
    }

    setupVisibilityDetection() {
        // Detect when page is hidden (tab switched, minimized)
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            if (this.isPageVisible && this.isInViewport) {
                this.resumeAnimation();
            } else {
                this.pauseAnimation();
            }
        });

        // Detect when hero section is in viewport
        const heroSection = document.querySelector('.hero');
        if (heroSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.isInViewport = entry.isIntersecting;
                    if (this.isInViewport && this.isPageVisible) {
                        this.resumeAnimation();
                    } else {
                        this.pauseAnimation();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroSection);
        }
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;

                // If device type changed, update positions
                if (wasMobile !== this.isMobile) {
                    this.updateBubblePositions();
                }
            }, 250);
        });
    }

    updateBubblePositions() {
        this.currentBubbles.forEach((bubble, index) => {
            const positions = this.isMobile ? this.mobilePositions : this.positions;
            const position = positions[index];

            Object.keys(position).forEach(key => {
                bubble.style[key] = position[key];
            });
        });
    }

    startAnimationCycle() {
        if (!this.isPageVisible || !this.isInViewport) return;

        // Show first set immediately
        this.showNextSet();
    }

    async showNextSet() {
        if (this.isAnimating || !this.isPageVisible || !this.isInViewport) return;

        this.isAnimating = true;

        // Get next 3 skills
        const skillsToShow = this.getNextSkills();

        // Create and show bubbles
        await this.createBubbles(skillsToShow);
        await this.fadeInBubbles();
        await this.displayBubbles();
        await this.fadeOutBubbles();
        await this.removeBubbles();

        this.isAnimating = false;

        // Wait for gap, then show next set
        setTimeout(() => {
            if (this.isPageVisible && this.isInViewport) {
                this.showNextSet();
            }
        }, this.config.gapBetweenSets);
    }

    getNextSkills() {
        const skills = [];
        for (let i = 0; i < this.config.bubblesPerSet; i++) {
            skills.push(this.skills[this.currentIndex]);
            this.currentIndex = (this.currentIndex + 1) % this.skills.length;
        }
        return skills;
    }

    async createBubbles(skills) {
        this.currentBubbles = [];
        const positions = this.isMobile ? this.mobilePositions : this.positions;

        skills.forEach((skill, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'floating-card';
            bubble.innerHTML = `
                <i class="${skill.icon}"></i>
                <span>${skill.name}</span>
            `;

            // Set position
            const position = positions[index];
            Object.keys(position).forEach(key => {
                bubble.style[key] = position[key];
            });

            this.container.appendChild(bubble);
            this.currentBubbles.push(bubble);
        });

        // Force reflow to ensure animations work
        this.container.offsetHeight;
    }

    fadeInBubbles() {
        return new Promise(resolve => {
            this.currentBubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    bubble.classList.add('fade-in');
                }, index * this.config.floatAnimationDelay);
            });

            setTimeout(resolve, this.config.fadeInDuration + (this.currentBubbles.length * this.config.floatAnimationDelay));
        });
    }

    displayBubbles() {
        return new Promise(resolve => {
            // Add floating animation
            this.currentBubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    bubble.classList.remove('fade-in');
                    bubble.classList.add('active');
                }, index * 50);
            });

            setTimeout(resolve, this.config.displayDuration);
        });
    }

    fadeOutBubbles() {
        return new Promise(resolve => {
            this.currentBubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    bubble.classList.remove('active');
                    bubble.classList.add('fade-out');
                }, index * this.config.floatAnimationDelay);
            });

            setTimeout(resolve, this.config.fadeOutDuration + (this.currentBubbles.length * this.config.floatAnimationDelay));
        });
    }

    removeBubbles() {
        return new Promise(resolve => {
            this.currentBubbles.forEach(bubble => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            });
            this.currentBubbles = [];
            resolve();
        });
    }

    pauseAnimation() {
        // Pause current animations
        this.currentBubbles.forEach(bubble => {
            bubble.style.animationPlayState = 'paused';
        });
    }

    resumeAnimation() {
        // Resume animations
        this.currentBubbles.forEach(bubble => {
            bubble.style.animationPlayState = 'running';
        });

        // If no animation is running, start a new cycle
        if (!this.isAnimating && this.currentBubbles.length === 0) {
            this.showNextSet();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingBubbleManager();
    });
} else {
    new FloatingBubbleManager();
}
