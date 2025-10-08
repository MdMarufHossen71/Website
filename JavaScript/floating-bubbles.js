class FloatingBubbleManager {
    constructor() {
        this.skills = [
            { name: 'React', icon: 'fab fa-react' },
            { name: 'Node.js', icon: 'fab fa-node-js' },
            { name: 'MongoDB', icon: 'fas fa-database' },
            { name: 'JavaScript', icon: 'fab fa-js' },
            { name: 'Express.js', icon: 'fas fa-server' },
            { name: 'HTML5', icon: 'fab fa-html5' },
            { name: 'CSS3', icon: 'fab fa-css3-alt' },
            { name: 'Git', icon: 'fab fa-git-alt' },
            { name: 'Next.js', icon: 'fas fa-arrow-circle-right' }
        ];

        this.config = {
            bubblesPerSet: 3,
            minDisplayDuration: 3000,
            transitionDuration: 500,
            pauseBetweenSets: 200
        };

        this.transitionTypes = [
            'scale-fade',
            'slide-up',
            'slide-diagonal',
            'rotate-fade',
            'dissolve'
        ];

        this.positions = [
            { top: '15%', left: '-15%', right: 'auto', bottom: 'auto' },
            { top: '65%', left: 'auto', right: '-15%', bottom: 'auto' },
            { top: 'auto', left: '-8%', right: 'auto', bottom: '25%' }
        ];

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
        this.isInViewport = true;
        this.isPageVisible = true;

        this.init();
    }

    init() {
        if (!this.container) return;
        this.setupVisibilityDetection();
        this.setupResizeHandler();
        this.startAnimationCycle();
    }

    setupVisibilityDetection() {
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            if (this.isPageVisible && this.isInViewport && !this.isAnimating) {
                this.startAnimationCycle();
            }
        });

        const heroSection = document.querySelector('.hero');
        if (heroSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.isInViewport = entry.isIntersecting;
                    if (this.isInViewport && this.isPageVisible && !this.isAnimating) {
                        this.startAnimationCycle();
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
        if (this.isAnimating || !this.isPageVisible || !this.isInViewport) return;
        this.showNextSet();
    }

    async showNextSet() {
        if (this.isAnimating || !this.isPageVisible || !this.isInViewport) return;

        this.isAnimating = true;

        const skillsToShow = this.getNextSkills();
        const transitionType = this.getRandomTransition();

        await this.createBubbles(skillsToShow);
        await this.transitionIn(transitionType);
        await this.floatBubbles();
        await this.transitionOut(transitionType);
        await this.removeBubbles();

        this.isAnimating = false;

        await this.wait(this.config.pauseBetweenSets);

        if (this.isPageVisible && this.isInViewport) {
            this.showNextSet();
        }
    }

    getNextSkills() {
        const skills = [];
        const availableSkills = [...this.skills];

        for (let i = 0; i < this.config.bubblesPerSet; i++) {
            const randomIndex = Math.floor(Math.random() * availableSkills.length);
            skills.push(availableSkills[randomIndex]);
            availableSkills.splice(randomIndex, 1);
        }

        return skills;
    }

    getRandomTransition() {
        return this.transitionTypes[Math.floor(Math.random() * this.transitionTypes.length)];
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

            const position = positions[index];
            Object.keys(position).forEach(key => {
                bubble.style[key] = position[key];
            });

            bubble.style.opacity = '0';
            bubble.style.willChange = 'transform, opacity';

            this.container.appendChild(bubble);
            this.currentBubbles.push(bubble);
        });

        this.container.offsetHeight;
    }

    async transitionIn(type) {
        const promises = this.currentBubbles.map((bubble, index) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    bubble.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

                    switch(type) {
                        case 'scale-fade':
                            bubble.style.transform = 'scale(0.5) translateY(20px)';
                            requestAnimationFrame(() => {
                                bubble.style.opacity = '1';
                                bubble.style.transform = 'scale(1) translateY(0)';
                            });
                            break;
                        case 'slide-up':
                            bubble.style.transform = 'translateY(80px)';
                            requestAnimationFrame(() => {
                                bubble.style.opacity = '1';
                                bubble.style.transform = 'translateY(0)';
                            });
                            break;
                        case 'slide-diagonal':
                            bubble.style.transform = 'translate(60px, 60px)';
                            requestAnimationFrame(() => {
                                bubble.style.opacity = '1';
                                bubble.style.transform = 'translate(0, 0)';
                            });
                            break;
                        case 'rotate-fade':
                            bubble.style.transform = 'rotate(180deg) scale(0.3)';
                            requestAnimationFrame(() => {
                                bubble.style.opacity = '1';
                                bubble.style.transform = 'rotate(0deg) scale(1)';
                            });
                            break;
                        case 'dissolve':
                            bubble.style.filter = 'blur(10px)';
                            bubble.style.transform = 'scale(1.3)';
                            requestAnimationFrame(() => {
                                bubble.style.opacity = '1';
                                bubble.style.filter = 'blur(0)';
                                bubble.style.transform = 'scale(1)';
                            });
                            break;
                    }

                    setTimeout(resolve, this.config.transitionDuration);
                }, index * 100);
            });
        });

        await Promise.all(promises);
    }

    async floatBubbles() {
        this.currentBubbles.forEach((bubble, index) => {
            const floatDelay = index * 0.3;
            const floatDuration = 8 + Math.random() * 4;
            const floatDistance = 15 + Math.random() * 10;
            const floatDirection = Math.random() > 0.5 ? 1 : -1;
            const horizontalDrift = (Math.random() - 0.5) * 8;

            bubble.style.animation = `
                gentleFloat-${index} ${floatDuration}s ease-in-out ${floatDelay}s infinite,
                horizontalDrift-${index} ${floatDuration * 1.5}s ease-in-out ${floatDelay}s infinite
            `;

            const styleSheet = document.styleSheets[0];
            const floatKeyframes = `
                @keyframes gentleFloat-${index} {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(${floatDirection * floatDistance}px); }
                }
            `;
            const driftKeyframes = `
                @keyframes horizontalDrift-${index} {
                    0%, 100% { transform: translateX(0px); }
                    50% { transform: translateX(${horizontalDrift}px); }
                }
            `;

            try {
                styleSheet.insertRule(floatKeyframes, styleSheet.cssRules.length);
                styleSheet.insertRule(driftKeyframes, styleSheet.cssRules.length);
            } catch(e) {}
        });

        await this.wait(this.config.minDisplayDuration);
    }

    async transitionOut(type) {
        const promises = this.currentBubbles.map((bubble, index) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    bubble.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53)`;

                    switch(type) {
                        case 'scale-fade':
                            bubble.style.opacity = '0';
                            bubble.style.transform = 'scale(0.3) translateY(-30px)';
                            break;
                        case 'slide-up':
                            bubble.style.opacity = '0';
                            bubble.style.transform = 'translateY(-100px)';
                            break;
                        case 'slide-diagonal':
                            bubble.style.opacity = '0';
                            bubble.style.transform = 'translate(-70px, -70px)';
                            break;
                        case 'rotate-fade':
                            bubble.style.opacity = '0';
                            bubble.style.transform = 'rotate(-180deg) scale(0.2)';
                            break;
                        case 'dissolve':
                            bubble.style.opacity = '0';
                            bubble.style.filter = 'blur(12px)';
                            bubble.style.transform = 'scale(0.7)';
                            break;
                    }

                    setTimeout(resolve, this.config.transitionDuration);
                }, index * 100);
            });
        });

        await Promise.all(promises);
    }

    async removeBubbles() {
        this.currentBubbles.forEach(bubble => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        });
        this.currentBubbles = [];
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingBubbleManager();
    });
} else {
    new FloatingBubbleManager();
}
