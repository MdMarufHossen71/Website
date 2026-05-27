// ==========================================================================
// CORE GAME STUDIO ENGINE: BROWSER GAMES SUITE
// ==========================================================================

class RetroGameStudio {
    constructor() {
        this.activeGame = null;
        this.activeLoop = null;
        this.recentsKey = 'maruf-game-studio-recents';
        this.achieveKey = 'maruf-game-studio-achievements';
        this.statsKey = 'maruf-game-studio-stats';
        
        // Sound status settings
        this.sfxEnabled = true;

        // Dom Elements
        this.sidebar = document.getElementById('games-sidebar');
        this.sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
        this.sidebarCloseBtn = document.getElementById('sidebar-close-btn');
        this.sidebarBackdrop = document.getElementById('sidebar-backdrop');
        this.searchInput = document.getElementById('global-game-search');
        this.searchClearBtn = document.getElementById('search-clear-btn');
        this.sfxToggleBtn = document.getElementById('toggle-sfx');

        // Confetti particles canvas
        this.confettiCanvas = document.getElementById('victory-confetti-canvas');
        this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;
        this.confettiParticles = [];
        this.confettiLoop = null;

        // List of all achievements
        this.achievementsList = [
            { id: 'first_game', title: 'First Venture', desc: 'Play any game in the studio once.', icon: 'fas fa-gamepad', color: 'text-blue-500 bg-blue-500/10' },
            { id: 'snake_master', title: 'Snake Charmer', desc: 'Reach 15 points in Snake classic.', icon: 'fas fa-apple-whole', color: 'text-emerald-500 bg-emerald-500/10' },
            { id: 'space_legend', title: 'Galactic Pilot', desc: 'Destroy 20 asteroids in Space Shooter.', icon: 'fas fa-rocket', color: 'text-rose-500 bg-rose-500/10' },
            { id: 'high_scorer', title: 'Score Champion', desc: 'Score over 50 points in any game.', icon: 'fas fa-trophy', color: 'text-amber-500 bg-amber-500/10' },
            { id: 'tetris_line', title: 'Line Master', desc: 'Clear 3 lines in Tetris block puzzle.', icon: 'fas fa-shapes', color: 'text-purple-500 bg-purple-500/10' },
            { id: 'achievement_hunter', title: 'Collector', desc: 'Unlock 3 distinct achievement badges.', icon: 'fas fa-crown', color: 'text-pink-500 bg-pink-500/10' }
        ];

        this.init();
    }

    init() {
        this.initSidebar();
        this.initSearch();
        this.initAudioControls();
        this.initRouting();
        this.renderAchievementsCabinet();
        this.syncTheme();

        // Populate counts
        const allBadge = document.getElementById('badge-all-count');
        if (allBadge && window.BROWSER_GAMES_LIST) {
            allBadge.textContent = window.BROWSER_GAMES_LIST.length;
        }

        // Mutation theme observer
        const observer = new MutationObserver(() => this.syncTheme());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    // --- SIDEBAR NAV SYSTEM ---
    initSidebar() {
        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener('click', () => this.toggleSidebar(true));
        }
        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener('click', () => this.toggleSidebar(false));
        }
        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener('click', () => this.toggleSidebar(false));
        }

        // Category click filters
        const catBtns = document.querySelectorAll('.cat-nav-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active', 'bg-slate-100', 'dark:bg-slate-800'));
                btn.classList.add('active', 'bg-slate-100', 'dark:bg-slate-800');

                if (this.searchInput) {
                    this.searchInput.value = '';
                    if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
                }

                const cat = btn.getAttribute('data-cat');
                
                // Return to dashboard if active inside play area
                if (window.location.hash !== '#/' && window.location.hash !== '') {
                    window.location.hash = '#/';
                    setTimeout(() => this.filterGames(cat, ''), 100);
                } else {
                    this.filterGames(cat, '');
                }

                this.toggleSidebar(false);
            });
        });
    }

    toggleSidebar(isOpen) {
        if (!this.sidebar || !this.sidebarBackdrop) return;
        if (isOpen) {
            this.sidebar.classList.remove('-translate-x-full');
            this.sidebarBackdrop.classList.remove('hidden');
        } else {
            this.sidebar.classList.add('-translate-x-full');
            this.sidebarBackdrop.classList.add('hidden');
        }
    }

    // --- SEARCH SYSTEM ---
    initSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (this.searchClearBtn) {
                if (query.length > 0) {
                    this.searchClearBtn.classList.remove('hidden');
                } else {
                    this.searchClearBtn.classList.add('hidden');
                }
            }

            if (window.location.hash !== '#/' && window.location.hash !== '') {
                window.location.hash = '#/';
                setTimeout(() => {
                    this.filterGames('all', query);
                }, 100);
            } else {
                const activeCat = document.querySelector('.cat-nav-btn.active');
                const cat = activeCat ? activeCat.getAttribute('data-cat') : 'all';
                this.filterGames(cat, query);
            }
        });

        if (this.searchClearBtn) {
            this.searchClearBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.searchClearBtn.classList.add('hidden');
                const activeCat = document.querySelector('.cat-nav-btn.active');
                const cat = activeCat ? activeCat.getAttribute('data-cat') : 'all';
                this.filterGames(cat, '');
                this.searchInput.focus();
            });
        }

        const resetBtn = document.getElementById('reset-search-notfound-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.searchInput) {
                    this.searchInput.value = '';
                    if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
                }
                this.filterGames('all', '');
            });
        }
    }

    filterGames(category, query) {
        const gridList = document.getElementById('games-grid-list');
        const notFoundCard = document.getElementById('search-not-found-card');
        const sectionTitle = document.getElementById('current-category-title');

        if (!gridList || !window.BROWSER_GAMES_LIST) return;

        gridList.innerHTML = '';
        let list = window.BROWSER_GAMES_LIST;

        if (category === 'featured') {
            list = list.filter(g => g.featured);
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-fire text-amber-500"></i> Featured Browser Games`;
        } else if (category !== 'all') {
            list = list.filter(g => g.category === category);
            const catNameMap = {
                arcade: 'Arcade Classic',
                puzzle: 'Puzzle & Logic',
                strategy: 'Strategy Board',
                casual: 'Casual Fun',
                typing: 'Typing Speed Test'
            };
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-gamepad text-primary-500"></i> ${catNameMap[category] || 'Games'}`;
        } else {
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-gamepad text-primary-500"></i> Game studio roster`;
        }

        if (query) {
            list = list.filter(g => 
                g.name.toLowerCase().includes(query) ||
                g.description.toLowerCase().includes(query) ||
                g.tags.some(tag => tag.toLowerCase().includes(query))
            );
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-search text-primary-500"></i> Search Results for "${query}"`;
        }

        if (list.length === 0) {
            if (notFoundCard) notFoundCard.classList.remove('hidden');
        } else {
            if (notFoundCard) notFoundCard.classList.add('hidden');
            list.forEach(game => {
                gridList.appendChild(this.createGameCard(game));
            });
        }
    }

    createGameCard(game) {
        const card = document.createElement('article');
        card.className = 'glassmorphism rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-primary-500/5 group';

        const diffColors = {
            easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            hard: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
        };

        const badgeClass = diffColors[game.difficulty] || 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        const record = localStorage.getItem(`maruf-games-${game.id}-highscore`) || '0';

        card.innerHTML = `
            <div class="flex flex-col gap-3">
                <div class="flex justify-between items-start">
                    <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase border rounded-full ${badgeClass}">${game.difficulty}</span>
                    <span class="text-[11px] font-semibold text-slate-400 font-display"><i class="fas fa-trophy text-amber-400"></i> Best: ${record}</span>
                </div>
                <h3 class="font-extrabold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors font-display flex items-center gap-2">
                    <i class="${game.icon} text-slate-400 group-hover:text-primary-500 transition-colors"></i>
                    ${game.name}
                </h3>
                <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">${game.description}</p>
            </div>
            <a href="#/${game.id}" class="w-full text-center bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-600 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm font-display tracking-wide uppercase">
                Play Game
            </a>
        `;

        return card;
    }

    // --- SYNTHESIZED 8-BIT AUDIO ENGINE (WEB AUDIO API) ---
    initAudioControls() {
        if (this.sfxToggleBtn) {
            this.sfxToggleBtn.addEventListener('click', () => {
                this.sfxEnabled = !this.sfxEnabled;
                const icon = this.sfxToggleBtn.querySelector('i');
                if (icon) {
                    icon.className = this.sfxEnabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
                }
                this.sfxToggleBtn.className = this.sfxEnabled ? 
                    this.sfxToggleBtn.className.replace('text-slate-400', 'text-slate-600') : 
                    this.sfxToggleBtn.className.replace('text-slate-600', 'text-slate-400');
                
                this.playTone('pop'); // blip verification
            });
        }
    }

    playTone(type) {
        if (!this.sfxEnabled) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            
            // Oscillator and Volume Nodes
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'pop') {
                // Short food blip (Snake food / score ticks)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'laser') {
                // Fast pitch drop (Space shooter fire)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'jump') {
                // Quick rising frequency (Flappy bird flap)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'hit') {
                // Short low frequency crash
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'win') {
                // Pleasant arpeggio chords
                const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
                notes.forEach((freq, idx) => {
                    const oscNode = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    oscNode.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    oscNode.type = 'sine';
                    oscNode.frequency.setValueAtTime(freq, now + idx * 0.1);
                    gainNode.gain.setValueAtTime(0.1, now + idx * 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
                    
                    oscNode.start(now + idx * 0.1);
                    oscNode.stop(now + idx * 0.1 + 0.35);
                });
            }
        } catch (e) {
            console.error('AudioContext synthesis failed: ', e);
        }
    }

    // --- ROUTER SYSTEM ---
    initRouting() {
        const handleRoute = () => {
            // Unload active loops
            if (this.activeLoop) {
                cancelAnimationFrame(this.activeLoop);
                this.activeLoop = null;
            }
            // Clear current play area
            const playArea = document.getElementById('game-play-area');
            if (playArea) playArea.innerHTML = '';

            const hash = window.location.hash;
            if (hash.startsWith('#/') && hash.length > 2) {
                const gameId = hash.slice(2);
                this.loadGame(gameId);
            } else {
                this.loadDashboard();
            }
        };

        window.addEventListener('hashchange', handleRoute);
        window.addEventListener('load', handleRoute);
    }

    loadDashboard() {
        this.activeGame = null;
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('view-tool-workspace').classList.add('hidden');

        const activeCat = document.querySelector('.cat-nav-btn.active');
        const cat = activeCat ? activeCat.getAttribute('data-cat') : 'all';
        const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';

        this.filterGames(cat, query);
        this.renderRecentlyPlayed();
    }

    loadGame(gameId) {
        if (!window.BROWSER_GAMES_LIST) return;

        const game = window.BROWSER_GAMES_LIST.find(g => g.id === gameId);
        if (!game) {
            this.showToast('Game not found in Studio roster', 'error');
            window.location.hash = '#/';
            return;
        }

        this.activeGame = game;

        document.getElementById('view-dashboard').classList.add('hidden');
        const workspace = document.getElementById('view-tool-workspace');
        workspace.classList.remove('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update Workspace Info
        const catNameMap = {
            arcade: 'Arcade Classic',
            puzzle: 'Puzzle & Logic',
            strategy: 'Strategy Board',
            casual: 'Casual Fun',
            typing: 'Typing Speed Test'
        };

        document.getElementById('game-breadcrumbs-cat').textContent = catNameMap[game.category] || 'Arcade';
        document.getElementById('active-game-title').innerHTML = `<i class="${game.icon} text-primary-500"></i> ${game.name}`;
        
        // Update High Score Display
        const highScore = localStorage.getItem(`maruf-games-${game.id}-highscore`) || '0';
        document.getElementById('game-highscore-val').textContent = highScore;
        document.getElementById('game-score-val').textContent = '0';

        // Set Controls description
        document.getElementById('game-controls-desc').textContent = game.controlsGuide || 'No controls details.';

        // Setup Play Space Area
        const playArea = document.getElementById('game-play-area');
        if (playArea && game.render) {
            game.render(playArea);
        }

        // Setup Game target achievements
        const achieveBox = document.getElementById('game-achieve-box');
        if (achieveBox) {
            achieveBox.innerHTML = '';
            const gameAchieves = this.achievementsList.filter(a => a.id.startsWith(game.id) || a.id === 'first_game' || a.id === 'high_scorer');
            const unlockedList = this.getUnlockedAchievements();

            gameAchieves.forEach(ach => {
                const isUnlocked = unlockedList.includes(ach.id);
                achieveBox.innerHTML += `
                    <div class="flex items-center gap-3 p-2 bg-slate-100/30 dark:bg-slate-800/10 border border-slate-200/50 dark:border-darkborder rounded-xl">
                        <div class="w-7 h-7 rounded-lg flex items-center justify-center text-sm ${isUnlocked ? ach.color + ' text-primary-500 shadow-[0_0_8px_rgba(236,72,153,0.15)] animate-pulse' : 'text-slate-400 bg-slate-100 dark:bg-slate-800 opacity-40'}">
                            <i class="${ach.icon}"></i>
                        </div>
                        <div class="flex flex-col">
                            <strong class="text-[11px] font-bold ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}">${ach.title}</strong>
                            <span class="text-[9px] text-slate-400 truncate max-w-[170px]">${ach.desc}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Initialize game controls & loop
        if (game.init) {
            game.init(playArea, this);
        }

        // Hook up restart button
        const restartBtn = document.getElementById('game-restart-btn');
        if (restartBtn) {
            // Remove previous listeners
            const newRestartBtn = restartBtn.cloneNode(true);
            restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
            newRestartBtn.addEventListener('click', () => {
                this.playTone('pop');
                if (this.activeLoop) {
                    cancelAnimationFrame(this.activeLoop);
                    this.activeLoop = null;
                }
                if (game.render) game.render(playArea);
                if (game.init) game.init(playArea, this);
                document.getElementById('game-score-val').textContent = '0';
            });
        }

        // Hook up fullscreen button
        const fsBtn = document.getElementById('game-fullscreen-btn');
        if (fsBtn) {
            const newFsBtn = fsBtn.cloneNode(true);
            fsBtn.parentNode.replaceChild(newFsBtn, fsBtn);
            newFsBtn.addEventListener('click', () => {
                this.playTone('pop');
                if (!document.fullscreenElement) {
                    playArea.requestFullscreen().catch(err => console.error(err));
                } else {
                    document.exitFullscreen();
                }
            });
        }

        // Log game session in recents
        this.logRecentGame(game.id);

        // Achievement: Play any game once
        setTimeout(() => this.unlockAchievement('first_game'), 1500);
    }

    // --- RECENT GAMES SESSION TRACKER ---
    getRecentGames() {
        try {
            return JSON.parse(localStorage.getItem(this.recentsKey)) || [];
        } catch {
            return [];
        }
    }

    logRecentGame(gameId) {
        let recents = this.getRecentGames();
        recents = recents.filter(id => id !== gameId);
        recents.unshift(gameId);
        recents = recents.slice(0, 3);
        localStorage.setItem(this.recentsKey, JSON.stringify(recents));

        // Increment total plays in stats
        try {
            const stats = JSON.parse(localStorage.getItem(this.statsKey)) || { plays: 0 };
            stats.plays++;
            localStorage.setItem(this.statsKey, JSON.stringify(stats));
        } catch {}
    }

    renderRecentlyPlayed() {
        const container = document.getElementById('section-recently-played');
        const grid = document.getElementById('recently-played-grid');

        if (!container || !grid || !window.BROWSER_GAMES_LIST) return;

        const recents = this.getRecentGames();
        const recentGamesList = recents
            .map(id => window.BROWSER_GAMES_LIST.find(g => g.id === id))
            .filter(Boolean);

        if (recentGamesList.length === 0) {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
            grid.innerHTML = '';
            recentGamesList.forEach(game => {
                grid.appendChild(this.createGameCard(game));
            });
        }
    }

    // --- SCORE SUBMIT ENGINE ---
    submitScore(gameId, score) {
        document.getElementById('game-score-val').textContent = score;
        const currentBest = parseInt(localStorage.getItem(`maruf-games-${gameId}-highscore`)) || 0;

        if (score > currentBest) {
            localStorage.setItem(`maruf-games-${gameId}-highscore`, score.toString());
            document.getElementById('game-highscore-val').textContent = score;
            this.showToast('NEW HIGH SCORE! 🏆', 'success');
            this.playTone('win');
            this.triggerConfetti();
        }

        // Dynamic Achievement checks based on score thresholds
        if (score >= 15 && gameId === 'snake') {
            this.unlockAchievement('snake_master');
        }
        if (score >= 50) {
            this.unlockAchievement('high_scorer');
        }
    }

    // --- ACHIEVEMENTS SYSTEM ---
    getUnlockedAchievements() {
        try {
            return JSON.parse(localStorage.getItem(this.achieveKey)) || [];
        } catch {
            return [];
        }
    }

    unlockAchievement(achId) {
        let unlocked = this.getUnlockedAchievements();
        if (unlocked.includes(achId)) return; // already unlocked

        unlocked.push(achId);
        localStorage.setItem(this.achieveKey, JSON.stringify(unlocked));

        const achievement = this.achievementsList.find(a => a.id === achId);
        if (achievement) {
            this.showToast(`UNLOCKED: ${achievement.title} 🏅`, 'success');
            this.playTone('win');
            this.triggerConfetti();
            this.renderAchievementsCabinet();

            // Refresh game badge visual check if currently playing
            const currentRoute = window.location.hash;
            if (this.activeGame && currentRoute.startsWith('#/')) {
                const gameId = currentRoute.slice(2);
                this.loadGame(gameId); // force reload sidebar visuals
            }
        }

        // Collector check (unlock 3 achievements)
        if (unlocked.length >= 3 && !unlocked.includes('achievement_hunter')) {
            setTimeout(() => this.unlockAchievement('achievement_hunter'), 2000);
        }
    }

    renderAchievementsCabinet() {
        const cabinet = document.getElementById('achievements-cabinet');
        const ratio = document.getElementById('achieve-ratio');
        if (!cabinet) return;

        cabinet.innerHTML = '';
        const unlocked = this.getUnlockedAchievements();
        
        if (ratio) ratio.textContent = `${unlocked.length}/6`;

        this.achievementsList.forEach(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            cabinet.innerHTML += `
                <div class="h-10 rounded-xl flex items-center justify-center border text-base relative group/item select-none cursor-help transition-all duration-300 ${isUnlocked ? ach.color + ' text-primary-500 border-primary-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-800/10 border-slate-200 dark:border-darkborder opacity-40'}" title="${ach.title}: ${ach.desc}">
                    <i class="${ach.icon}"></i>
                    
                    <!-- Hover Tooltip text -->
                    <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-800">
                        <strong>${ach.title}</strong>: ${ach.desc}
                    </div>
                </div>
            `;
        });
    }

    // --- CANVAS CONFETTI ENGINE ---
    triggerConfetti() {
        if (!this.confettiCanvas || !this.confettiCtx) return;

        this.confettiCanvas.style.display = 'block';
        
        // Resize canvas to fullscreen
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;

        this.confettiParticles = [];
        const colors = ['#ec4899', '#db2777', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        
        for (let i = 0; i < 150; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.confettiCanvas.width,
                y: Math.random() * this.confettiCanvas.height - this.confettiCanvas.height,
                size: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 5 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }

        if (this.confettiLoop) cancelAnimationFrame(this.confettiLoop);
        this.animateConfetti();

        // Stop loop after 4 seconds
        setTimeout(() => {
            if (this.confettiLoop) {
                cancelAnimationFrame(this.confettiLoop);
                this.confettiLoop = null;
            }
            this.confettiCanvas.style.display = 'none';
        }, 4000);
    }

    animateConfetti() {
        const ctx = this.confettiCtx;
        const canvas = this.confettiCanvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.confettiParticles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();
        });

        // Loop animation
        this.confettiLoop = requestAnimationFrame(() => this.animateConfetti());
    }

    // --- TOAST NOTIFICATIONS ---
    showToast(message, type = 'success') {
        const container = document.getElementById('global-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'flex items-center gap-3 bg-white dark:bg-darkcard border border-slate-200/80 dark:border-darkborder px-4 py-3 rounded-2xl shadow-xl transform translate-y-6 opacity-0 transition-all duration-300 pointer-events-auto max-w-sm';

        const icons = {
            success: '<i class="fas fa-trophy text-amber-500 text-lg"></i>',
            error: '<i class="fas fa-circle-xmark text-rose-500 text-lg"></i>',
            info: '<i class="fas fa-info-circle text-blue-500 text-lg"></i>'
        };

        toast.innerHTML = `
            ${icons[type] || icons.success}
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-6', 'opacity-0');
        }, 50);

        setTimeout(() => {
            toast.classList.add('translate-y-6', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    syncTheme() {
        // Automatically updates styling rules via TailwinddarkMode
    }
}

// Instantiate games suite
window.addEventListener('DOMContentLoaded', () => {
    window.RetroStudioInstance = new RetroGameStudio();
});
