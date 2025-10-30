class RobustFloatingBubbles {
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
            MAX_BUBBLES: 3,
            BUBBLE_DISPLAY_TIME: 5000,
            TRANSITION_OUT_DURATION: 400,
            TRANSITION_IN_DURATION: 400,
            FLOAT_DURATION: 8000,
            FLOAT_DISTANCE: 12,
            MIN_BUBBLE_DISTANCE: 200,
            BUBBLE_RADIUS: 70,
            MIN_PHOTO_DISTANCE: 220
        };

        this.transitionEffects = ['fade', 'scale', 'slide-up', 'slide-down', 'rotate-scale', 'blur-fade'];

        this.desktopPositions = [
            { top: 8, left: -15, right: null, bottom: null },
            { top: 25, left: -18, right: null, bottom: null },
            { top: 42, left: -14, right: null, bottom: null },
            { top: 60, left: -17, right: null, bottom: null },
            { top: 8, left: null, right: -15, bottom: null },
            { top: 25, left: null, right: -18, bottom: null },
            { top: 70, left: null, right: -14, bottom: null },
            { top: 85, left: null, right: -17, bottom: null },
            { top: null, left: -10, right: null, bottom: 8 },
            { top: null, left: -15, right: null, bottom: 20 }
        ];

        this.mobilePositions = [
            { top: 5, left: -12, right: null, bottom: null },
            { top: 22, left: -14, right: null, bottom: null },
            { top: 40, left: -10, right: null, bottom: null },
            { top: 5, left: null, right: -12, bottom: null },
            { top: 72, left: null, right: -14, bottom: null },
            { top: 88, left: null, right: -10, bottom: null },
            { top: null, left: -8, right: null, bottom: 10 },
            { top: null, left: -12, right: null, bottom: 22 }
        ];

        this.state = {
            activeBubbles: [],
            isAnimating: false,
            isRunning: false,
            currentSkillIndex: 0,
            occupiedPositions: []
        };

        this.isMobile = window.innerWidth <= 768;
        this.container = document.getElementById('floating-elements');

        if (this.container) {
            this.init();
        }
    }

    init() {
        this.setupResponsive();
        this.setupVisibilityControl();
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
            }, 300);
        });
    }

    setupVisibilityControl() {
        let pageIsVisible = !document.hidden;

        document.addEventListener('visibilitychange', () => {
            pageIsVisible = !document.hidden;
            if (pageIsVisible && !this.state.isRunning) {
                this.start();
            } else if (!pageIsVisible && this.state.isRunning) {
                this.stop();
            }
        });

        const heroSection = document.querySelector('.hero');
        if (heroSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.state.isRunning && pageIsVisible) {
                        this.start();
                    } else if (!entry.isIntersecting && this.state.isRunning) {
                        this.stop();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroSection);
        }
    }

    async start() {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.state.activeBubbles = [];
        this.state.occupiedPositions = [];

        for (let i = 0; i < this.config.MAX_BUBBLES; i++) {
            await this.addInitialBubble();
        }

        this.startSequentialLoop();
    }

    stop() {
        this.state.isRunning = false;

        this.state.activeBubbles.forEach(bubbleData => {
            if (bubbleData.element && bubbleData.element.parentNode) {
                bubbleData.element.parentNode.removeChild(bubbleData.element);
            }
        });

        this.state.activeBubbles = [];
        this.state.occupiedPositions = [];
    }

    restart() {
        this.stop();
        setTimeout(() => this.start(), 200);
    }

    async addInitialBubble() {
        if (this.state.activeBubbles.length >= this.config.MAX_BUBBLES) {
            return;
        }

        const skill = this.getNextSkill();
        const position = this.findSafePosition();

        if (!position) {
            return;
        }

        const bubbleElement = this.createBubbleElement(skill, position);

        const bubbleData = {
            element: bubbleElement,
            position: position,
            skill: skill,
            id: Date.now() + Math.random()
        };

        this.state.activeBubbles.push(bubbleData);
        this.state.occupiedPositions.push(position);

        this.container.appendChild(bubbleElement);

        await this.wait(50);
        await this.animateIn(bubbleElement, 'fade');
        this.startFloating(bubbleElement);
    }

    async startSequentialLoop() {
        await this.wait(this.config.BUBBLE_DISPLAY_TIME);

        while (this.state.isRunning) {
            if (this.state.activeBubbles.length !== this.config.MAX_BUBBLES) {
                break;
            }

            for (let i = 0; i < this.config.MAX_BUBBLES; i++) {
                if (!this.state.isRunning) break;

                await this.replaceBubbleAtIndex(i);

                await this.wait(this.config.BUBBLE_DISPLAY_TIME / this.config.MAX_BUBBLES);
            }
        }
    }

    async replaceBubbleAtIndex(index) {
        if (index >= this.state.activeBubbles.length) return;

        this.state.isAnimating = true;

        const oldBubbleData = this.state.activeBubbles[index];
        const outEffect = this.getRandomEffect();

        await this.animateOut(oldBubbleData.element, outEffect);

        if (oldBubbleData.element.parentNode) {
            oldBubbleData.element.parentNode.removeChild(oldBubbleData.element);
        }

        const positionIndex = this.state.occupiedPositions.indexOf(oldBubbleData.position);
        if (positionIndex > -1) {
            this.state.occupiedPositions.splice(positionIndex, 1);
        }

        this.state.activeBubbles.splice(index, 1);

        await this.wait(50);

        const skill = this.getNextSkill();
        const newPosition = this.findSafePosition();

        if (!newPosition) {
            this.state.isAnimating = false;
            return;
        }

        const newBubbleElement = this.createBubbleElement(skill, newPosition);

        const newBubbleData = {
            element: newBubbleElement,
            position: newPosition,
            skill: skill,
            id: Date.now() + Math.random()
        };

        this.state.activeBubbles.splice(index, 0, newBubbleData);
        this.state.occupiedPositions.push(newPosition);

        this.container.appendChild(newBubbleElement);

        await this.wait(50);

        const inEffect = this.getRandomEffect();
        await this.animateIn(newBubbleElement, inEffect);
        this.startFloating(newBubbleElement);

        this.state.isAnimating = false;
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
        bubble.style.backfaceVisibility = 'hidden';
        bubble.style.WebkitBackfaceVisibility = 'hidden';

        if (position.top !== null) bubble.style.top = `${position.top}%`;
        if (position.bottom !== null) bubble.style.bottom = `${position.bottom}%`;
        if (position.left !== null) bubble.style.left = `${position.left}%`;
        if (position.right !== null) bubble.style.right = `${position.right}%`;

        return bubble;
    }

    findSafePosition() {
        const positions = this.isMobile ? this.mobilePositions : this.desktopPositions;
        const photoCenter = { top: 50, left: 50 };

        const availablePositions = positions.filter(pos => {
            if (this.isPositionOccupied(pos)) {
                return false;
            }

            const distanceFromPhoto = this.calculateDistance(pos, photoCenter);
            if (distanceFromPhoto < this.config.MIN_PHOTO_DISTANCE) {
                return false;
            }

            return this.state.occupiedPositions.every(occupiedPos => {
                return this.calculateDistance(pos, occupiedPos) >= this.config.MIN_BUBBLE_DISTANCE;
            });
        });

        if (availablePositions.length === 0) {
            const fallbackPositions = positions.filter(pos => {
                if (this.isPositionOccupied(pos)) {
                    return false;
                }
                const distanceFromPhoto = this.calculateDistance(pos, photoCenter);
                return distanceFromPhoto >= this.config.MIN_PHOTO_DISTANCE;
            });
            return fallbackPositions.length > 0 ? fallbackPositions[Math.floor(Math.random() * fallbackPositions.length)] : null;
        }

        return availablePositions[Math.floor(Math.random() * availablePositions.length)];
    }

    isPositionOccupied(position) {
        return this.state.occupiedPositions.some(occupied =>
            occupied.top === position.top &&
            occupied.bottom === position.bottom &&
            occupied.left === position.left &&
            occupied.right === position.right
        );
    }

    calculateDistance(pos1, pos2) {
        const x1 = this.getXCoordinate(pos1);
        const y1 = this.getYCoordinate(pos1);
        const x2 = this.getXCoordinate(pos2);
        const y2 = this.getYCoordinate(pos2);

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    getXCoordinate(position) {
        if (position.left !== null) return position.left;
        if (position.right !== null) return 100 - position.right;
        return 50;
    }

    getYCoordinate(position) {
        if (position.top !== null) return position.top;
        if (position.bottom !== null) return 100 - position.bottom;
        return 50;
    }

    getNextSkill() {
        const skill = this.skills[this.state.currentSkillIndex];
        this.state.currentSkillIndex = (this.state.currentSkillIndex + 1) % this.skills.length;
        return skill;
    }

    getRandomEffect() {
        return this.transitionEffects[Math.floor(Math.random() * this.transitionEffects.length)];
    }

    async animateIn(element, effect) {
        return new Promise(resolve => {
            element.style.transition = `all ${this.config.TRANSITION_IN_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

            switch(effect) {
                case 'fade':
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                    });
                    break;

                case 'scale':
                    element.style.transform = 'scale(0.2) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'scale(1) translate3d(0, 0, 0)';
                    });
                    break;

                case 'slide-up':
                    element.style.transform = 'translateY(60px) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) translate3d(0, 0, 0)';
                    });
                    break;

                case 'slide-down':
                    element.style.transform = 'translateY(-60px) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) translate3d(0, 0, 0)';
                    });
                    break;

                case 'rotate-scale':
                    element.style.transform = 'rotate(180deg) scale(0.2) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'rotate(0deg) scale(1) translate3d(0, 0, 0)';
                    });
                    break;

                case 'blur-fade':
                    element.style.filter = 'blur(12px)';
                    element.style.transform = 'scale(1.2) translate3d(0, 0, 0)';
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.filter = 'blur(0)';
                        element.style.transform = 'scale(1) translate3d(0, 0, 0)';
                    });
                    break;
            }

            setTimeout(resolve, this.config.TRANSITION_IN_DURATION);
        });
    }

    async animateOut(element, effect) {
        return new Promise(resolve => {
            element.style.animation = 'none';
            element.style.transition = `all ${this.config.TRANSITION_OUT_DURATION}ms cubic-bezier(0.55, 0.085, 0.68, 0.53)`;

            requestAnimationFrame(() => {
                switch(effect) {
                    case 'fade':
                        element.style.opacity = '0';
                        break;

                    case 'scale':
                        element.style.opacity = '0';
                        element.style.transform = 'scale(0.2) translate3d(0, 0, 0)';
                        break;

                    case 'slide-up':
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(-60px) translate3d(0, 0, 0)';
                        break;

                    case 'slide-down':
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(60px) translate3d(0, 0, 0)';
                        break;

                    case 'rotate-scale':
                        element.style.opacity = '0';
                        element.style.transform = 'rotate(-180deg) scale(0.2) translate3d(0, 0, 0)';
                        break;

                    case 'blur-fade':
                        element.style.opacity = '0';
                        element.style.filter = 'blur(12px)';
                        element.style.transform = 'scale(0.8) translate3d(0, 0, 0)';
                        break;
                }
            });

            setTimeout(resolve, this.config.TRANSITION_OUT_DURATION);
        });
    }

    startFloating(element) {
        const duration = this.config.FLOAT_DURATION + Math.random() * 2000;
        const distance = this.config.FLOAT_DISTANCE + Math.random() * 5;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const horizontalDrift = (Math.random() - 0.5) * 6;
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

        try {
            const styleSheet = document.styleSheets[0];
            if (styleSheet) {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            }
        } catch(e) {
            console.warn('Could not insert keyframe rule:', e);
        }

        element.style.animation = `${animationId} ${duration}ms ease-in-out ${delay}s infinite`;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RobustFloatingBubbles();
    });
} else {
    new RobustFloatingBubbles();
}
