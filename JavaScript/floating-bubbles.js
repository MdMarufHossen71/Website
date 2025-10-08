class SequentialFloatingBubbles {
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
            totalBubbles: 3,
            displayDuration: 3000,
            transitionDuration: 500,
            minDistance: 150,
            floatSpeed: 12000,
            floatRange: 20
        };

        this.transitionEffects = ['fade', 'scale', 'slide-up', 'slide-down', 'rotate', 'blur'];

        this.positions = [
            { top: 8, left: -12 },
            { top: 18, left: -15 },
            { top: 28, left: -10 },
            { top: 40, left: -14 },
            { top: 52, left: -11 },
            { top: 8, right: -12 },
            { top: 18, right: -15 },
            { top: 62, right: -10 },
            { top: 72, right: -14 },
            { top: 82, right: -12 },
            { bottom: 8, left: -6 },
            { bottom: 18, left: -12 },
            { bottom: 28, left: -8 }
        ];

        this.mobilePositions = [
            { top: 5, left: -8 },
            { top: 15, left: -10 },
            { top: 25, left: -6 },
            { top: 5, right: -8 },
            { top: 65, right: -10 },
            { top: 75, right: -8 },
            { top: 85, right: -6 },
            { bottom: 10, left: -4 },
            { bottom: 20, left: -6 }
        ];

        this.activeBubbles = [];
        this.usedPositions = [];
        this.currentSkillIndex = 0;
        this.isRunning = false;
        this.isMobile = window.innerWidth <= 768;
        this.container = document.getElementById('floating-elements');

        this.init();
    }

    init() {
        if (!this.container) return;

        this.setupResponsive();
        this.setupVisibility();
        this.start();
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                if (wasMobile !== this.isMobile) {
                    this.restart();
                }
            }, 250);
        });
    }

    setupVisibility() {
        let isVisible = true;

        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
            if (isVisible && !this.isRunning) {
                this.start();
            } else if (!isVisible && this.isRunning) {
                this.stop();
            }
        });

        const heroSection = document.querySelector('.hero');
        if (heroSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isRunning && isVisible) {
                        this.start();
                    } else if (!entry.isIntersecting && this.isRunning) {
                        this.stop();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroSection);
        }
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        for (let i = 0; i < this.config.totalBubbles; i++) {
            await this.createInitialBubble(i);
        }

        this.startSequentialLoop();
    }

    stop() {
        this.isRunning = false;
        this.activeBubbles.forEach(bubble => {
            if (bubble.element.parentNode) {
                bubble.element.parentNode.removeChild(bubble.element);
            }
        });
        this.activeBubbles = [];
        this.usedPositions = [];
    }

    restart() {
        this.stop();
        setTimeout(() => this.start(), 100);
    }

    async createInitialBubble(index) {
        const skill = this.getNextSkill();
        const position = this.getAvailablePosition();

        const bubble = this.createBubbleElement(skill, position);
        this.activeBubbles.push({
            element: bubble,
            position: position,
            skill: skill,
            index: index
        });

        this.container.appendChild(bubble);

        await this.wait(50);
        await this.transitionIn(bubble, 'fade');
        this.applyFloatingAnimation(bubble, position);
    }

    async startSequentialLoop() {
        while (this.isRunning) {
            await this.wait(this.config.displayDuration);

            if (!this.isRunning) break;

            for (let i = 0; i < this.config.totalBubbles; i++) {
                if (!this.isRunning) break;

                const oldBubble = this.activeBubbles[i];
                const outEffect = this.getRandomEffect();

                await this.transitionOut(oldBubble.element, outEffect);

                if (oldBubble.element.parentNode) {
                    oldBubble.element.parentNode.removeChild(oldBubble.element);
                }

                const skill = this.getNextSkill();
                const position = this.getAvailablePosition();

                const newBubble = this.createBubbleElement(skill, position);
                this.activeBubbles[i] = {
                    element: newBubble,
                    position: position,
                    skill: skill,
                    index: i
                };

                this.container.appendChild(newBubble);

                await this.wait(50);

                const inEffect = this.getRandomEffect();
                await this.transitionIn(newBubble, inEffect);
                this.applyFloatingAnimation(newBubble, position);

                await this.wait(this.config.displayDuration / this.config.totalBubbles);
            }
        }
    }

    createBubbleElement(skill, position) {
        const bubble = document.createElement('div');
        bubble.className = 'floating-card';
        bubble.innerHTML = `
            <i class="${skill.icon}"></i>
            <span>${skill.name}</span>
        `;

        bubble.style.position = 'absolute';
        bubble.style.opacity = '0';
        bubble.style.willChange = 'transform, opacity';
        bubble.style.transform = 'translate3d(0, 0, 0)';

        if (position.top !== undefined) bubble.style.top = `${position.top}%`;
        if (position.bottom !== undefined) bubble.style.bottom = `${position.bottom}%`;
        if (position.left !== undefined) bubble.style.left = `${position.left}%`;
        if (position.right !== undefined) bubble.style.right = `${position.right}%`;

        return bubble;
    }

    getNextSkill() {
        const skill = this.skills[this.currentSkillIndex];
        this.currentSkillIndex = (this.currentSkillIndex + 1) % this.skills.length;
        return skill;
    }

    getAvailablePosition() {
        const positions = this.isMobile ? this.mobilePositions : this.positions;

        const availablePositions = positions.filter((pos, idx) => {
            if (this.usedPositions.includes(idx)) return false;

            return this.activeBubbles.every(bubble => {
                return this.checkDistance(pos, bubble.position) >= this.config.minDistance;
            });
        });

        let selectedIndex;
        if (availablePositions.length > 0) {
            const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            selectedIndex = positions.indexOf(randomPos);
        } else {
            this.usedPositions = [];
            selectedIndex = Math.floor(Math.random() * positions.length);
        }

        this.usedPositions.push(selectedIndex);
        if (this.usedPositions.length > this.config.totalBubbles) {
            this.usedPositions.shift();
        }

        return positions[selectedIndex];
    }

    checkDistance(pos1, pos2) {
        const x1 = pos1.left !== undefined ? pos1.left : (pos1.right !== undefined ? 100 - pos1.right : 50);
        const y1 = pos1.top !== undefined ? pos1.top : (pos1.bottom !== undefined ? 100 - pos1.bottom : 50);
        const x2 = pos2.left !== undefined ? pos2.left : (pos2.right !== undefined ? 100 - pos2.right : 50);
        const y2 = pos2.top !== undefined ? pos2.top : (pos2.bottom !== undefined ? 100 - pos2.bottom : 50);

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    getRandomEffect() {
        return this.transitionEffects[Math.floor(Math.random() * this.transitionEffects.length)];
    }

    async transitionIn(element, effect) {
        return new Promise(resolve => {
            element.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

            switch(effect) {
                case 'fade':
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                    });
                    break;
                case 'scale':
                    element.style.transform = 'scale(0.3) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'scale(1) translate3d(0, 0, 0)';
                    });
                    break;
                case 'slide-up':
                    element.style.transform = 'translateY(50px) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) translate3d(0, 0, 0)';
                    });
                    break;
                case 'slide-down':
                    element.style.transform = 'translateY(-50px) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) translate3d(0, 0, 0)';
                    });
                    break;
                case 'rotate':
                    element.style.transform = 'rotate(180deg) scale(0.3) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'rotate(0deg) scale(1) translate3d(0, 0, 0)';
                    });
                    break;
                case 'blur':
                    element.style.filter = 'blur(10px)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.filter = 'blur(0)';
                    });
                    break;
            }

            setTimeout(resolve, this.config.transitionDuration);
        });
    }

    async transitionOut(element, effect) {
        return new Promise(resolve => {
            element.style.animation = 'none';
            element.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53)`;

            requestAnimationFrame(() => {
                switch(effect) {
                    case 'fade':
                        element.style.opacity = '0';
                        break;
                    case 'scale':
                        element.style.opacity = '0';
                        element.style.transform = 'scale(0.3) translate3d(0, 0, 0)';
                        break;
                    case 'slide-up':
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(-50px) translate3d(0, 0, 0)';
                        break;
                    case 'slide-down':
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(50px) translate3d(0, 0, 0)';
                        break;
                    case 'rotate':
                        element.style.opacity = '0';
                        element.style.transform = 'rotate(-180deg) scale(0.3) translate3d(0, 0, 0)';
                        break;
                    case 'blur':
                        element.style.opacity = '0';
                        element.style.filter = 'blur(10px)';
                        break;
                }
            });

            setTimeout(resolve, this.config.transitionDuration);
        });
    }

    applyFloatingAnimation(element, position) {
        const duration = this.config.floatSpeed + Math.random() * 4000;
        const distance = this.config.floatRange + Math.random() * 10;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const horizontalDrift = (Math.random() - 0.5) * 15;
        const delay = Math.random() * 0.5;

        const animationId = `float-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const keyframes = `
            @keyframes ${animationId} {
                0%, 100% {
                    transform: translate3d(0, 0, 0);
                }
                50% {
                    transform: translate3d(${horizontalDrift}px, ${direction * distance}px, 0);
                }
            }
        `;

        const styleSheet = document.styleSheets[0];
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch(e) {}

        element.style.animation = `${animationId} ${duration}ms ease-in-out ${delay}s infinite`;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SequentialFloatingBubbles();
    });
} else {
    new SequentialFloatingBubbles();
}
