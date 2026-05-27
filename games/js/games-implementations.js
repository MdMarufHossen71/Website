// ==========================================================================
// ALL 20 BROWSER GAMES IMPLEMENTATIONS
// ==========================================================================

window.BROWSER_GAMES_LIST = [];

// --------------------------------------------------------------------------
// 1. SNAKE GAME
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'snake',
    name: 'Snake Classic',
    description: 'Fresh cyberpunk visual remake of the classic arcade grid runner.',
    icon: 'fas fa-apple-whole',
    difficulty: 'easy',
    category: 'arcade',
    tags: ['snake', 'arcade', 'classic', 'retro', 'speed'],
    featured: true,
    controlsGuide: 'Use Arrow Keys or WASD to navigate the snake. Eat red apples.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="snake-canvas" width="360" height="360" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full aspect-square"></canvas>
                <div class="flex gap-4 select-none lg:hidden mt-2">
                    <button id="sk-up" class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center text-lg active:scale-95"><i class="fas fa-chevron-up"></i></button>
                </div>
                <div class="flex gap-8 select-none lg:hidden">
                    <button id="sk-left" class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center text-lg active:scale-95"><i class="fas fa-chevron-left"></i></button>
                    <button id="sk-right" class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center text-lg active:scale-95"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="flex gap-4 select-none lg:hidden mb-2">
                    <button id="sk-down" class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center text-lg active:scale-95"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#snake-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const grid = 18;
        let snake = [{x: 9 * grid, y: 9 * grid}];
        let dx = grid, dy = 0;
        let apple = {x: 3 * grid, y: 3 * grid};
        let score = 0;
        let frameCount = 0;

        const spawnApple = () => {
            apple.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
            apple.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
        };

        const handleInput = (key) => {
            if ((key === 'ArrowUp' || key === 'w') && dy === 0) { dx = 0; dy = -grid; }
            else if ((key === 'ArrowDown' || key === 's') && dy === 0) { dx = 0; dy = grid; }
            else if ((key === 'ArrowLeft' || key === 'a') && dx === 0) { dx = -grid; dy = 0; }
            else if ((key === 'ArrowRight' || key === 'd') && dx === 0) { dx = grid; dy = 0; }
        };

        app.addGameListener(window, 'keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            handleInput(e.key);
        });
        
        // Mobile UI controls
        const skUp = c.querySelector('#sk-up');
        const skDown = c.querySelector('#sk-down');
        const skLeft = c.querySelector('#sk-left');
        const skRight = c.querySelector('#sk-right');

        if (skUp) app.addGameListener(skUp, 'click', () => handleInput('ArrowUp'));
        if (skDown) app.addGameListener(skDown, 'click', () => handleInput('ArrowDown'));
        if (skLeft) app.addGameListener(skLeft, 'click', () => handleInput('ArrowLeft'));
        if (skRight) app.addGameListener(skRight, 'click', () => handleInput('ArrowRight'));

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);
            
            // Limit snake FPS to make it playable + speed scaling
            let frameLimit = Math.max(2, 6 - Math.floor(score / 5));
            if (++frameCount < frameLimit) return;
            frameCount = 0;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Move Snake Head
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            // Wall Collision
            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
                app.playTone('hit');
                app.submitScore('snake', score);
                cancelAnimationFrame(app.activeLoop);
                app.activeLoop = null;
                ctx.fillStyle = '#f43f5e';
                ctx.font = '20px Orbitron, sans-serif';
                ctx.fillText('GAME OVER', canvas.width / 2 - 60, canvas.height / 2);
                return;
            }

            // Self Collision
            for (let i = 0; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    app.playTone('hit');
                    app.submitScore('snake', score);
                    cancelAnimationFrame(app.activeLoop);
                    app.activeLoop = null;
                    ctx.fillStyle = '#f43f5e';
                    ctx.font = '20px Orbitron, sans-serif';
                    ctx.fillText('GAME OVER', canvas.width / 2 - 60, canvas.height / 2);
                    return;
                }
            }

            snake.unshift(head);

            // Eat Apple
            if (head.x === apple.x && head.y === apple.y) {
                score++;
                app.playTone('pop');
                document.getElementById('game-score-val').textContent = score;
                spawnApple();
            } else {
                snake.pop();
            }

            // Draw Apple
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(apple.x + grid/2, apple.y + grid/2, grid/2 - 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw Snake
            ctx.fillStyle = '#ec4899';
            snake.forEach((cell, idx) => {
                ctx.shadowBlur = idx === 0 ? 10 : 0;
                ctx.shadowColor = '#ec4899';
                ctx.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);
            });
            ctx.shadowBlur = 0;
        };

        spawnApple();
        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 2. TIC TAC TOE
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Challenge a local player or unbeatable artificial intelligence.',
    icon: 'fas fa-xmark',
    difficulty: 'easy',
    category: 'strategy',
    tags: ['tictactoe', 'board', 'multiplayer', 'ai', 'strategy'],
    featured: false,
    controlsGuide: 'Click cells directly to trigger moves. Plays Local or AI.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="flex gap-4">
                    <button id="tt-local" class="bg-primary-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow shadow-primary-500/30">Local 2P</button>
                    <button id="tt-ai" class="bg-slate-800 text-slate-300 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all border border-slate-700">vs Unbeatable AI</button>
                </div>
                <div class="grid grid-cols-3 gap-3 w-72 h-72 aspect-square">
                    ${Array.from({length: 9}).map((_, i) => `<button data-idx="${i}" class="tt-cell bg-slate-900 border border-slate-800 text-3xl font-extrabold text-slate-100 hover:bg-slate-800/50 rounded-2xl flex items-center justify-center transition-all font-display"></button>`).join('')}
                </div>
                <div id="tt-status" class="text-sm font-bold text-slate-400 font-display">Player X's Turn</div>
            </div>
        `;
    },
    init: (c, app) => {
        const cells = c.querySelectorAll('.tt-cell');
        const status = c.querySelector('#tt-status');
        const btnLocal = c.querySelector('#tt-local');
        const btnAi = c.querySelector('#tt-ai');

        let board = Array(9).fill('');
        let activePlayer = 'X';
        let mode = 'local'; // local vs ai
        let isGameOver = false;

        const checkWin = (b) => {
            const winPatterns = [
                [0,1,2],[3,4,5],[6,7,8], // rows
                [0,3,6],[1,4,7],[2,5,8], // cols
                [0,4,8],[2,4,6] // diagonals
            ];
            for (let pat of winPatterns) {
                if (b[pat[0]] && b[pat[0]] === b[pat[1]] && b[pat[0]] === b[pat[2]]) {
                    return { winner: b[pat[0]], line: pat };
                }
            }
            if (b.every(cell => cell !== '')) return { winner: 'T' }; // tie
            return null;
        };

        const makeAiMove = () => {
            // Unbeatable Minimax
            const minimax = (b, depth, isMax) => {
                const res = checkWin(b);
                if (res) {
                    if (res.winner === 'O') return 10 - depth;
                    if (res.winner === 'X') return depth - 10;
                    return 0;
                }

                if (isMax) {
                    let best = -Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (b[i] === '') {
                            b[i] = 'O';
                            best = Math.max(best, minimax(b, depth + 1, false));
                            b[i] = '';
                        }
                    }
                    return best;
                } else {
                    let best = Infinity;
                    for (let i = 0; i < 9; i++) {
                        if (b[i] === '') {
                            b[i] = 'X';
                            best = Math.min(best, minimax(b, depth + 1, true));
                            b[i] = '';
                        }
                    }
                    return best;
                }
            };

            let bestVal = -Infinity;
            let bestMove = -1;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let val = minimax(board, 0, false);
                    board[i] = '';
                    if (val > bestVal) {
                        bestVal = val;
                        bestMove = i;
                    }
                }
            }

            if (bestMove > -1) {
                const aiCell = c.querySelector(`[data-idx="${bestMove}"]`);
                makeMove(bestMove, aiCell);
            }
        };

        const makeMove = (idx, cell) => {
            if (board[idx] !== '' || isGameOver) return;

            board[idx] = activePlayer;
            cell.textContent = activePlayer;
            cell.className += activePlayer === 'X' ? ' text-primary-500' : ' text-emerald-500';
            app.playTone('pop');

            const res = checkWin(board);
            if (res) {
                isGameOver = true;
                if (res.winner === 'T') {
                    status.textContent = "TIE GAME! 🤝";
                    status.className = "text-sm font-bold text-amber-500 font-display";
                    app.playTone('hit');
                } else {
                    status.textContent = `PLAYER ${res.winner} WINS! 🎉`;
                    status.className = `text-sm font-bold ${res.winner === 'X' ? 'text-primary-500' : 'text-emerald-500'} font-display`;
                    
                    // Highlight win
                    res.line.forEach(i => {
                        c.querySelector(`[data-idx="${i}"]`).className += ' bg-slate-800 shadow-[0_0_8px_rgba(236,72,153,0.3)] animate-pulse';
                    });

                    app.submitScore('tictactoe', 10);
                }
                return;
            }

            activePlayer = activePlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${activePlayer}'s Turn`;

            if (mode === 'ai' && activePlayer === 'O') {
                app.addTimeout(makeAiMove, 400);
            }
        };

        cells.forEach(cell => {
            app.addGameListener(cell, 'click', () => {
                if (mode === 'ai' && activePlayer === 'O') return;
                const idx = parseInt(cell.getAttribute('data-idx'));
                makeMove(idx, cell);
            });
        });

        // Mode switchers
        if (btnLocal) {
            app.addGameListener(btnLocal, 'click', () => {
                mode = 'local';
                btnLocal.className = 'bg-primary-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow shadow-primary-500/30';
                btnAi.className = 'bg-slate-800 text-slate-300 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all border border-slate-700';
                resetGame();
            });
        }

        if (btnAi) {
            app.addGameListener(btnAi, 'click', () => {
                mode = 'ai';
                btnAi.className = 'bg-primary-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow shadow-primary-500/30';
                btnLocal.className = 'bg-slate-800 text-slate-300 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all border border-slate-700';
                resetGame();
            });
        }

        const resetGame = () => {
            board = Array(9).fill('');
            activePlayer = 'X';
            isGameOver = false;
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'tt-cell bg-slate-900 border border-slate-800 text-3xl font-extrabold text-slate-100 hover:bg-slate-800/50 rounded-2xl flex items-center justify-center transition-all font-display';
            });
            status.textContent = "Player X's Turn";
            status.className = "text-sm font-bold text-slate-400 font-display";
        };
    }
});

// --------------------------------------------------------------------------
// 3. MEMORY CARD MATCH
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'memory',
    name: 'Memory Matching',
    description: 'Boost visual recall by finding matching emoji pairs under a timer.',
    icon: 'fas fa-brain',
    difficulty: 'easy',
    category: 'puzzle',
    tags: ['memory', 'matching', 'puzzle', 'timer', 'cards'],
    featured: false,
    controlsGuide: 'Click cards to flip them. Find matching pairs.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none font-display">
                <div class="grid grid-cols-4 gap-3 w-full">
                    ${Array.from({length: 12}).map((_, i) => `
                        <div class="mem-card w-full aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95" data-idx="${i}">
                            <i class="fas fa-question text-slate-600"></i>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-between w-full text-xs font-bold text-slate-400">
                    <span id="mem-moves">MOVES: 0</span>
                    <span id="mem-timer">TIME: 0s</span>
                    <span id="mem-matches">MATCHES: 0/6</span>
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const cards = c.querySelectorAll('.mem-card');
        const movesLbl = c.querySelector('#mem-moves');
        const timerLbl = c.querySelector('#mem-timer');
        const matchesLbl = c.querySelector('#mem-matches');

        const emojis = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍"];
        let boardEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        let flipped = [];
        let matches = 0;
        let moves = 0;
        let isLocked = false;
        let startTime = Date.now();

        // Active ticking timer panel
        app.addInterval(() => {
            if (matches === 6) return;
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            if (timerLbl) timerLbl.textContent = `TIME: ${elapsed}s`;
        }, 1000);

        cards.forEach(card => {
            app.addGameListener(card, 'click', () => {
                if (isLocked) return;
                const idx = parseInt(card.getAttribute('data-idx'));
                
                if (card.classList.contains('flipped') || flipped.some(item => item.idx === idx)) return;

                card.innerHTML = boardEmojis[idx];
                card.classList.add('flipped', 'bg-slate-800', 'border-primary-500/40');
                app.playTone('pop');
                
                flipped.push({ idx, card });

                if (flipped.length === 2) {
                    moves++;
                    if (movesLbl) movesLbl.textContent = `MOVES: ${moves}`;
                    isLocked = true;

                    // Match Check
                    if (boardEmojis[flipped[0].idx] === boardEmojis[flipped[1].idx]) {
                        matches++;
                        if (matchesLbl) matchesLbl.textContent = `MATCHES: ${matches}/6`;
                        
                        flipped.forEach(item => {
                            item.card.className = 'mem-card w-full aspect-square bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold';
                        });

                        flipped = [];
                        isLocked = false;

                        if (matches === 6) {
                            app.submitScore('memory', Math.max(10, 100 - moves));
                            app.showToast('You cleared the board! 🎉');
                        }
                    } else {
                        // Flip back
                        app.addTimeout(() => {
                            flipped.forEach(item => {
                                item.card.innerHTML = '<i class="fas fa-question text-slate-600"></i>';
                                item.card.className = 'mem-card w-full aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105';
                            });
                            flipped = [];
                            isLocked = false;
                        }, 800);
                    }
                }
            });
        });
    }
});

// --------------------------------------------------------------------------
// 4. FLAPPY BIRD CLONE
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'flappy',
    name: 'Flappy Bird Clone',
    description: 'Jump through pipelines in this high speed arcade physics run.',
    icon: 'fas fa-dove',
    difficulty: 'medium',
    category: 'arcade',
    tags: ['flappy', 'runner', 'physics', 'arcade', 'speed'],
    featured: true,
    controlsGuide: 'Press Space Bar or Click/Tap the screen to flap and fly.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="flappy-canvas" width="360" height="380" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
                <div class="text-[10px] text-slate-500 font-semibold select-none md:hidden">TAP CANVAS TO JUMP</div>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#flappy-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let bird = { y: canvas.height/2, vel: 0, gravity: 0.28, lift: -5.5 };
        let pipes = [];
        let score = 0;
        let pipeGap = 90;
        let isGameOver = false;
        let frameCount = 0;

        const handleJump = () => {
            if (isGameOver) return;
            bird.vel = bird.lift;
            app.playTone('jump');
        };

        app.addGameListener(window, 'keydown', e => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                handleJump();
            }
        });
        if (canvas) app.addGameListener(canvas, 'pointerdown', handleJump);

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Bird physics
            bird.vel += bird.gravity;
            bird.y += bird.vel;

            // Wall Collisions
            if (bird.y >= canvas.height || bird.y < 0) {
                triggerGameOver();
                return;
            }

            // Draw Bird
            ctx.fillStyle = '#ec4899';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ec4899';
            ctx.beginPath();
            ctx.arc(40, bird.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Spawn Pipes
            if (frameCount % 100 === 0) {
                const topH = Math.random() * (canvas.height - pipeGap - 80) + 40;
                pipes.push({
                    x: canvas.width,
                    topHeight: topH,
                    bottomHeight: canvas.height - topH - pipeGap,
                    passed: false
                });
            }

            // Move & Draw Pipes
            ctx.fillStyle = '#10b981';
            pipes.forEach((p, idx) => {
                p.x -= 2;

                // Draw Top Pipe
                ctx.fillRect(p.x, 0, 30, p.topHeight);
                // Draw Bottom Pipe
                ctx.fillRect(p.x, canvas.height - p.bottomHeight, 30, p.bottomHeight);

                // Collision checking
                if (p.x < 50 && p.x + 30 > 30) {
                    if (bird.y - 10 < p.topHeight || bird.y + 10 > canvas.height - p.bottomHeight) {
                        triggerGameOver();
                    }
                }

                // Increment Score
                if (p.x < 30 && !p.passed) {
                    score++;
                    app.playTone('pop');
                    document.getElementById('game-score-val').textContent = score;
                    p.passed = true;
                }
            });

            // Discard offscreen pipes
            pipes = pipes.filter(p => p.x > -40);

            frameCount++;
        };

        const triggerGameOver = () => {
            isGameOver = true;
            app.playTone('hit');
            app.submitScore('flappy', score);
            cancelAnimationFrame(app.activeLoop);
            app.activeLoop = null;
            
            ctx.fillStyle = '#f43f5e';
            ctx.font = '22px Orbitron, sans-serif';
            ctx.fillText('CRASHED!', canvas.width / 2 - 55, canvas.height / 2);
        };

        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 5. TETRIS
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'tetris',
    name: 'Tetris Arcade',
    description: 'Rotate and drop falling polyomino blocks to clear matrix rows.',
    icon: 'fas fa-shapes',
    difficulty: 'hard',
    category: 'arcade',
    tags: ['tetris', 'blocks', 'classic', 'arcade', 'puzzle'],
    featured: true,
    controlsGuide: 'Left/Right to move. Up arrow to rotate blocks. Down to drop.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="tetris-canvas" width="220" height="400" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#tetris-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const grid = 20;
        const cols = 11;
        const rows = 20;
        let board = Array.from({length: rows}, () => Array(cols).fill(''));

        const SHAPES = {
            'I': [[1,1,1,1]],
            'O': [[1,1],[1,1]],
            'T': [[0,1,0],[1,1,1]],
            'S': [[0,1,1],[1,1,0]],
            'Z': [[1,1,0],[0,1,1]],
            'J': [[1,0,0],[1,1,1]],
            'L': [[0,0,1],[1,1,1]]
        };

        const colors = {
            'I': '#06b6d4', 'O': '#eab308', 'T': '#a855f7',
            'S': '#22c55e', 'Z': '#ef4444', 'J': '#3b82f6',
            'L': '#f97316'
        };

        let current = null;
        let score = 0;
        let linesClearedTotal = 0;
        let frameCount = 0;

        function getRandomPiece() {
            const types = Object.keys(SHAPES);
            const type = types[Math.floor(Math.random() * types.length)];
            return {
                matrix: SHAPES[type],
                type: type,
                x: 4,
                y: 0
            };
        }

        current = getRandomPiece();

        const collide = (piece, bx, by) => {
            const m = piece.matrix;
            for (let r = 0; r < m.length; r++) {
                for (let c = 0; c < m[r].length; c++) {
                    if (m[r][c]) {
                        const nextX = bx + c;
                        const nextY = by + r;
                        if (nextX < 0 || nextX >= cols || nextY >= rows) return true;
                        if (nextY >= 0 && board[nextY][nextX]) return true;
                    }
                }
            }
            return false;
        };

        const merge = () => {
            const m = current.matrix;
            for (let r = 0; r < m.length; r++) {
                for (let c = 0; c < m[r].length; c++) {
                    if (m[r][c]) {
                        board[current.y + r][current.x + c] = current.type;
                    }
                }
            }
        };

        const rotate = (matrix) => {
            const N = matrix.length;
            const M = matrix[0].length;
            let temp = Array.from({length: M}, () => Array(N).fill(0));
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < M; c++) {
                    temp[c][N - 1 - r] = matrix[r][c];
                }
            }
            return temp;
        };

        const clearLines = () => {
            let lines = 0;
            for (let r = rows - 1; r >= 0; r--) {
                if (board[r].every(cell => cell !== '')) {
                    board.splice(r, 1);
                    board.unshift(Array(cols).fill(''));
                    lines++;
                    r++; // check again
                }
            }
            if (lines > 0) {
                score += lines * 10;
                linesClearedTotal += lines;
                app.playTone('pop');
                document.getElementById('game-score-val').textContent = score;

                // check custom achievements
                if (linesClearedTotal >= 3) {
                    app.unlockAchievement('tetris_line');
                }
            }
        };

        const handleInput = (e) => {
            if (e.key === 'ArrowLeft') {
                if (!collide(current, current.x - 1, current.y)) current.x--;
            } else if (e.key === 'ArrowRight') {
                if (!collide(current, current.x + 1, current.y)) current.x++;
            } else if (e.key === 'ArrowDown') {
                if (!collide(current, current.x, current.y + 1)) current.y++;
            } else if (e.key === 'ArrowUp') {
                const temp = current.matrix;
                current.matrix = rotate(current.matrix);
                if (collide(current, current.x, current.y)) {
                    current.matrix = temp; // undo
                } else {
                    app.playTone('pop');
                }
            }
        };

        app.addGameListener(window, 'keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
            }
            handleInput(e);
        });

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            // Dynamic Tetris speed scaling based on score
            let frameLimit = Math.max(4, 28 - Math.floor(score / 15) * 2);
            if (++frameCount < frameLimit) return;
            frameCount = 0;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Board Matrix
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (board[r][c]) {
                        ctx.fillStyle = colors[board[r][c]];
                        ctx.fillRect(c * grid, r * grid, grid - 1, grid - 1);
                    }
                }
            }

            // Draw Active Piece
            if (current) {
                ctx.fillStyle = colors[current.type];
                current.matrix.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell) {
                            ctx.fillRect((current.x + c) * grid, (current.y + r) * grid, grid - 1, grid - 1);
                        }
                    });
                });
            }

            // Physics drop tick
            if (current) {
                if (!collide(current, current.x, current.y + 1)) {
                    current.y++;
                } else {
                    merge();
                    clearLines();
                    current = getRandomPiece();

                    if (collide(current, current.x, current.y)) {
                        // Game Over
                        app.playTone('hit');
                        app.submitScore('tetris', score);
                        cancelAnimationFrame(app.activeLoop);
                        app.activeLoop = null;

                        ctx.fillStyle = '#f43f5e';
                        ctx.font = '18px Orbitron, sans-serif';
                        ctx.fillText('MATRIX FULL!', canvas.width / 2 - 62, canvas.height / 2);
                    }
                }
            }
        };

        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 6. ROCK PAPER SCISSORS
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Challenge the compiler in a visual animated hand duel.',
    icon: 'fas fa-hand-fist',
    difficulty: 'easy',
    category: 'casual',
    tags: ['rps', 'rock', 'paper', 'scissors', 'casual', 'strategy'],
    featured: false,
    controlsGuide: 'Select your move visually using the action buttons.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="flex gap-4 items-center justify-between w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-semibold">
                    <div class="flex flex-col items-center gap-1.5 flex-1">
                        <span class="text-[10px] text-slate-500 uppercase">You</span>
                        <div id="rps-you-hand" class="text-4xl">🤖</div>
                    </div>
                    <span class="text-xs font-bold text-slate-400 font-display">VS</span>
                    <div class="flex flex-col items-center gap-1.5 flex-1">
                        <span class="text-[10px] text-slate-500 uppercase">CPU</span>
                        <div id="rps-cpu-hand" class="text-4xl">🤖</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 w-full">
                    <button data-move="rock" class="rps-btn bg-slate-900 border border-slate-800 hover:border-primary-500 p-4 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95"><span>✊</span> Rock</button>
                    <button data-move="paper" class="rps-btn bg-slate-900 border border-slate-800 hover:border-primary-500 p-4 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95"><span>✋</span> Paper</button>
                    <button data-move="scissors" class="rps-btn bg-slate-900 border border-slate-800 hover:border-primary-500 p-4 rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95"><span>✌️</span> Scissors</button>
                </div>
                <div id="rps-outcome" class="text-sm font-bold text-slate-400 font-display uppercase tracking-wide">Select your move!</div>
            </div>
        `;
    },
    init: (c, app) => {
        const btns = c.querySelectorAll('.rps-btn');
        const youHand = c.querySelector('#rps-you-hand');
        const cpuHand = c.querySelector('#rps-cpu-hand');
        const outcome = c.querySelector('#rps-outcome');

        const hands = { rock: '✊', paper: '✋', scissors: '✌️' };
        let score = 0;

        btns.forEach(btn => {
            app.addGameListener(btn, 'click', () => {
                const move = btn.getAttribute('data-move');
                const moves = ['rock', 'paper', 'scissors'];
                const cpuMove = moves[Math.floor(Math.random() * 3)];

                youHand.textContent = hands[move];
                cpuHand.textContent = hands[cpuMove];
                
                app.playTone('pop');

                if (move === cpuMove) {
                    outcome.textContent = "Draw Match! 🤝";
                    outcome.className = "text-sm font-bold text-slate-400 font-display";
                } else if (
                    (move === 'rock' && cpuMove === 'scissors') ||
                    (move === 'paper' && cpuMove === 'rock') ||
                    (move === 'scissors' && cpuMove === 'paper')
                ) {
                    score += 5;
                    outcome.textContent = "You Win! 🎉";
                    outcome.className = "text-sm font-bold text-emerald-500 font-display";
                    app.submitScore('rps', score);
                } else {
                    score = Math.max(0, score - 5);
                    outcome.textContent = "CPU wins! ☠️";
                    outcome.className = "text-sm font-bold text-rose-500 font-display";
                    app.playTone('hit');
                    document.getElementById('game-score-val').textContent = score;
                }
            });
        });
    }
});

// --------------------------------------------------------------------------
// 7. 2048
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'game2048',
    name: '2048 Puzzle',
    description: 'Merge tiles of matching numbers to build the legendary 2048 block.',
    icon: 'fas fa-square-full',
    difficulty: 'medium',
    category: 'puzzle',
    tags: ['2048', 'numbers', 'puzzle', 'merge', 'grid'],
    featured: true,
    controlsGuide: 'Use Arrow Keys or WASD to slide all tiles in that direction.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full max-w-sm select-none">
                <div class="grid grid-cols-4 gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-72 h-72 aspect-square">
                    ${Array.from({length: 16}).map((_, i) => `<div id="c2048-${i}" class="cell-2048 w-full h-full rounded-xl bg-slate-950 flex items-center justify-center text-sm font-bold font-display transition-all duration-200"></div>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        let grid = Array(16).fill(0);
        let score = 0;

        const spawn = () => {
            const empty = grid.map((val, idx) => val === 0 ? idx : null).filter(val => val !== null);
            if (empty.length === 0) return;
            const idx = empty[Math.floor(Math.random() * empty.length)];
            grid[idx] = Math.random() > 0.1 ? 2 : 4;
        };

        const renderGrid = () => {
            const bgClasses = {
                0: 'bg-slate-950 border border-slate-900',
                2: 'bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-sm',
                4: 'bg-primary-500/20 text-primary-500 border border-primary-500/30 shadow-sm font-extrabold',
                8: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-sm',
                16: 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 shadow-sm font-extrabold',
                32: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm',
                64: 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-sm font-extrabold',
                128: 'bg-purple-500/15 text-purple-500 border border-purple-500/30 shadow-md font-extrabold',
                256: 'bg-purple-500/30 text-purple-500 border border-purple-500/50 shadow-md font-extrabold',
                512: 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-lg font-extrabold',
                1024: 'bg-amber-500/40 text-amber-500 border border-amber-500/60 shadow-lg font-extrabold',
                2048: 'bg-rose-500/30 text-rose-500 border border-rose-500/60 shadow-xl font-extrabold animate-pulse'
            };

            for (let i = 0; i < 16; i++) {
                const cell = c.querySelector(`#c2048-${i}`);
                cell.textContent = grid[i] > 0 ? grid[i] : '';
                cell.className = `cell-2048 w-full h-full rounded-xl flex items-center justify-center text-sm font-bold font-display transition-all duration-200 ${bgClasses[grid[i]] || bgClasses[2048]}`;
            }
        };

        const slide = (row) => {
            const filtered = row.filter(val => val > 0);
            const missing = 4 - filtered.length;
            const zeros = Array(missing).fill(0);
            return filtered.concat(zeros);
        };

        const merge = (row) => {
            for (let i = 0; i < 3; i++) {
                if (row[i] > 0 && row[i] === row[i + 1]) {
                    row[i] *= 2;
                    score += row[i];
                    row[i + 1] = 0;
                    app.playTone('pop');
                    document.getElementById('game-score-val').textContent = score;
                }
            }
            return row;
        };

        const slideLeft = () => {
            let changed = false;
            for (let r = 0; r < 4; r++) {
                const row = grid.slice(r * 4, r * 4 + 4);
                const original = [...row];
                
                let processed = slide(row);
                processed = merge(processed);
                processed = slide(processed);

                for (let c = 0; c < 4; c++) {
                    grid[r * 4 + c] = processed[c];
                    if (original[c] !== processed[c]) changed = true;
                }
            }
            return changed;
        };

        const rotate = () => {
            const next = Array(16).fill(0);
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    next[c * 4 + (3 - r)] = grid[r * 4 + c];
                }
            }
            grid = next;
        };

        const handleInput = (e) => {
            let changed = false;
            const key = e.key;
            
            if (key === 'ArrowLeft' || key === 'a') {
                changed = slideLeft();
            } else if (key === 'ArrowRight' || key === 'd') {
                rotate(); rotate();
                changed = slideLeft();
                rotate(); rotate();
            } else if (key === 'ArrowUp' || key === 'w') {
                rotate(); rotate(); rotate();
                changed = slideLeft();
                rotate();
            } else if (key === 'ArrowDown' || key === 's') {
                rotate();
                changed = slideLeft();
                rotate(); rotate(); rotate();
            }

            if (changed) {
                spawn();
                renderGrid();

                // Check win condition (reaching 2048 tile)
                if (grid.some(val => val === 2048)) {
                    app.playTone('win');
                    app.submitScore('game2048', score);
                    app.showToast('You reached 2048! 🏆');
                }

                // Check lose condition
                const canMove = () => {
                    if (grid.some(val => val === 0)) return true;
                    for (let r = 0; r < 4; r++) {
                        for (let c = 0; c < 3; c++) {
                            if (grid[r * 4 + c] === grid[r * 4 + c + 1]) return true;
                            if (grid[c * 4 + r] === grid[(c + 1) * 4 + r]) return true;
                        }
                    }
                    return false;
                };

                if (!canMove()) {
                    app.playTone('hit');
                    app.submitScore('game2048', score);
                    app.showToast('Board Full! Game Over ☠️', 'error');
                }
            }
        };

        app.addGameListener(window, 'keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
            }
            handleInput(e);
        });

        // Touch gesture controls
        let touchstartX = 0;
        let touchstartY = 0;

        app.addGameListener(c, 'touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, { passive: true });

        app.addGameListener(c, 'touchend', e => {
            const touchendX = e.changedTouches[0].screenX;
            const touchendY = e.changedTouches[0].screenY;
            
            const dx = touchendX - touchstartX;
            const dy = touchendY - touchstartY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            if (Math.max(absX, absY) > 35) { // 35px threshold
                if (absX > absY) {
                    handleInput({ key: dx > 0 ? 'ArrowRight' : 'ArrowLeft' });
                } else {
                    handleInput({ key: dy > 0 ? 'ArrowDown' : 'ArrowUp' });
                }
            }
        }, { passive: true });

        // spawn 2 tiles on start
        spawn(); spawn();
        renderGrid();
    }
});

// --------------------------------------------------------------------------
// 8. HANGMAN
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'hangman',
    name: 'Hangman Puzzle',
    description: 'Solve programming syntax terms inside a retro gallows canvas drawing.',
    icon: 'fas fa-skull',
    difficulty: 'easy',
    category: 'puzzle',
    tags: ['hangman', 'word', 'guessing', 'puzzle', 'letters'],
    featured: false,
    controlsGuide: 'Select alphabet keys on the visual keyboard panel.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <canvas id="hang-canvas" width="200" height="150" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
                <div id="hang-blanks" class="text-xl font-bold font-mono tracking-widest text-slate-100 uppercase">_ _ _ _</div>
                <div class="grid grid-cols-7 gap-1.5 w-full">
                    ${'abcdefghijklmnopqrstuvwxyz'.split('').map(l => `<button data-letter="${l}" class="hang-letter-btn bg-slate-900 border border-slate-800 hover:border-primary-500 rounded px-1.5 py-2 text-xs font-bold font-mono text-slate-300 transition-colors uppercase active:scale-95">${l}</button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#hang-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const blanksEl = c.querySelector('#hang-blanks');
        const letterBtns = c.querySelectorAll('.hang-letter-btn');

        const words = ["VITE", "REACT", "TAILWIND", "JAVASCRIPT", "GITHUB", "CSS", "HTML", "SUPABASE", "WEBAUDIO", "ROUTER"];
        let targetWord = words[Math.floor(Math.random() * words.length)];
        let guessed = new Set();
        let mistakes = 0;

        const updateBlanks = () => {
            const display = targetWord.split('').map(l => guessed.has(l) ? l : '_').join(' ');
            blanksEl.textContent = display;

            // Win check
            if (!display.includes('_')) {
                app.submitScore('hangman', 20);
                app.showToast('Word Solved! 🏅');
                letterBtns.forEach(btn => btn.disabled = true);
            }
        };

        const drawGallows = (step) => {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#6366f1';

            if (step === 1) {
                // Base
                ctx.beginPath(); ctx.moveTo(20, 140); ctx.lineTo(180, 140); ctx.stroke();
            } else if (step === 2) {
                // Post
                ctx.beginPath(); ctx.moveTo(50, 140); ctx.lineTo(50, 20); ctx.lineTo(120, 20); ctx.lineTo(120, 40); ctx.stroke();
            } else if (step === 3) {
                // Head
                ctx.beginPath(); ctx.arc(120, 52, 12, 0, Math.PI * 2); ctx.stroke();
            } else if (step === 4) {
                // Spine body
                ctx.beginPath(); ctx.moveTo(120, 64); ctx.lineTo(120, 105); ctx.stroke();
            } else if (step === 5) {
                // Arms
                ctx.beginPath(); ctx.moveTo(100, 75); ctx.lineTo(140, 75); ctx.stroke();
            } else if (step === 6) {
                // Legs
                ctx.beginPath(); ctx.moveTo(120, 105); ctx.lineTo(105, 130); ctx.moveTo(120, 105); ctx.lineTo(135, 130); ctx.stroke();
            }
            ctx.shadowBlur = 0;
        };

        const makeGuess = (l, btn) => {
            if (guessed.has(l)) return;
            guessed.add(l);
            btn.disabled = true;
            btn.className = 'hang-letter-btn rounded px-1.5 py-2 text-xs font-bold font-mono text-slate-500 bg-slate-900 border border-slate-900 opacity-30 select-none';

            if (targetWord.includes(l)) {
                app.playTone('pop');
                updateBlanks();
            } else {
                mistakes++;
                app.playTone('hit');
                drawGallows(mistakes);

                if (mistakes >= 6) {
                    blanksEl.textContent = targetWord;
                    blanksEl.className += ' text-rose-500';
                    app.showToast('Gallows completed. Game Over ☠️', 'error');
                    letterBtns.forEach(btn => btn.disabled = true);
                }
            }
        };

        letterBtns.forEach(btn => {
            app.addGameListener(btn, 'click', () => {
                const l = btn.getAttribute('data-letter').toUpperCase();
                makeGuess(l, btn);
            });
        });

        // draw base on start
        ctx.clearRect(0,0, canvas.width, canvas.height);
        drawGallows(1);
        updateBlanks();
    }
});

// --------------------------------------------------------------------------
// 9. TYPING SPEED TEST
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'typing',
    name: 'Cyberpunk Typing Racer',
    description: 'Test and optimize your typing WPM speed and telemetry client-side.',
    icon: 'fas fa-keyboard',
    difficulty: 'medium',
    category: 'typing',
    tags: ['typing', 'keyboard', 'speed', 'wpm', 'accuracy', 'telemetry'],
    featured: true,
    controlsGuide: 'Type the displayed cyberpunk text precisely. Press enter or space to log words.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 w-full max-w-md select-none font-display">
                <div id="tp-prompt-box" class="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 font-mono text-sm leading-relaxed whitespace-pre-wrap select-text"></div>
                <input type="text" id="tp-input" placeholder="Start typing the prompt here..." class="w-full bg-slate-900/50 text-slate-100 border border-slate-800 focus:border-primary-500 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all select-text">
                <div class="flex justify-between w-full text-xs font-bold text-slate-400">
                    <span id="tp-wpm">WPM: 0</span>
                    <span id="tp-accuracy">ACCURACY: 100%</span>
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const promptBox = c.querySelector('#tp-prompt-box');
        const input = c.querySelector('#tp-input');
        const wpmLbl = c.querySelector('#tp-wpm');
        const accLbl = c.querySelector('#tp-accuracy');

        const prompts = [
            "const coder = { skills: ['Vite', 'React', 'Tailwind'] };",
            "document.addEventListener('DOMContentLoaded', () => { app.init(); });",
            "git commit -m 'Release visual developer tools box v3.0'"
        ];

        const targetText = prompts[Math.floor(Math.random() * prompts.length)];
        promptBox.textContent = targetText;

        let startTime = null;

        const updateMetrics = () => {
            const typed = input.value;
            if (!startTime && typed.length > 0) startTime = Date.now();

            // Render text coloring
            let rendered = '';
            let errors = 0;
            
            for (let i = 0; i < targetText.length; i++) {
                if (i < typed.length) {
                    if (typed[i] === targetText[i]) {
                        rendered += `<span class="text-emerald-500">${targetText[i]}</span>`;
                    } else {
                        rendered += `<span class="text-rose-500 bg-rose-500/10 underline">${targetText[i]}</span>`;
                        errors++;
                    }
                } else {
                    rendered += `<span>${targetText[i]}</span>`;
                }
            }

            promptBox.innerHTML = rendered;

            // Accuracy
            const accuracy = typed.length > 0 ? Math.round(((typed.length - errors) / typed.length) * 100) : 100;
            accLbl.textContent = `ACCURACY: ${accuracy}%`;

            // Complete check
            if (typed === targetText) {
                const totalTimeMin = (Date.now() - startTime) / 1000 / 60;
                const wordsCount = targetText.split(/\s+/).length;
                const wpm = Math.round(wordsCount / totalTimeMin);

                wpmLbl.textContent = `WPM: ${wpm}`;
                app.playTone('win');
                app.submitScore('typing', wpm);
                app.showToast(`Cleared at ${wpm} WPM! ⚡`);
                input.disabled = true;
            }
        };

        app.addGameListener(input, 'input', updateMetrics);
    }
});

// --------------------------------------------------------------------------
// 10. COLOR GUESSING GAME
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'color',
    name: 'Color Guessing Game',
    description: 'Solve the exact RGB color code visual prompt from circle choices.',
    icon: 'fas fa-palette',
    difficulty: 'easy',
    category: 'casual',
    tags: ['color', 'rgb', 'guessing', 'casual', 'designer'],
    featured: false,
    controlsGuide: 'Examine the RGB code prompt. Click the matching color circle.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none font-display">
                <div id="col-rgb-prompt" class="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 font-bold font-mono tracking-wide text-center uppercase w-full">RGB(255, 255, 255)</div>
                <div id="col-circles-grid" class="grid grid-cols-3 gap-4 w-full">
                    ${Array.from({length: 6}).map((_, i) => `<button data-idx="${i}" class="col-circle w-full aspect-square rounded-full transition-all border border-slate-800 active:scale-95 shadow-lg hover:scale-105"></button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const prompt = c.querySelector('#col-rgb-prompt');
        const circles = c.querySelectorAll('.col-circle');

        let colorsList = [];
        let correctIdx = 0;
        let score = 0;

        const generateColors = () => {
            colorsList = [];
            for (let i = 0; i < 6; i++) {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                colorsList.push(`rgb(${r}, ${g}, ${b})`);
            }

            correctIdx = Math.floor(Math.random() * 6);
            prompt.textContent = colorsList[correctIdx].toUpperCase();

            circles.forEach((circle, idx) => {
                circle.style.backgroundColor = colorsList[idx];
                circle.disabled = false;
                circle.className = 'col-circle w-full aspect-square rounded-full transition-all border border-slate-200 dark:border-darkborder hover:scale-105 active:scale-95';
            });
        };

        circles.forEach(circle => {
            app.addGameListener(circle, 'click', () => {
                const idx = parseInt(circle.getAttribute('data-idx'));

                if (idx === correctIdx) {
                    score += 10;
                    app.playTone('pop');
                    app.submitScore('color', score);
                    
                    // Dim others
                    circles.forEach((cEl, cIdx) => {
                        if (cIdx !== correctIdx) cEl.className += ' opacity-20';
                    });
                    
                    app.addTimeout(generateColors, 1200);
                } else {
                    score = 0;
                    app.playTone('hit');
                    app.showToast('Incorrect Guess! Score Reset', 'error');
                    circle.className += ' opacity-10 cursor-not-allowed';
                    circle.disabled = true;
                    document.getElementById('game-score-val').textContent = '0';
                }
            });
        });

        generateColors();
    }
});

// --------------------------------------------------------------------------
// 11. PONG
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'pong',
    name: 'Pong Classic',
    description: 'Challenge the computer paddle in classic rebounding ping-pong.',
    icon: 'fas fa-table-tennis-paddle-ball',
    difficulty: 'medium',
    category: 'arcade',
    tags: ['pong', 'arcade', 'classic', 'pingpong', 'retro'],
    featured: false,
    controlsGuide: 'Move mouse/cursor vertically inside the canvas to slide your paddle.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="pong-canvas" width="380" height="280" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#pong-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let player = { y: canvas.height/2 - 25, score: 0 };
        let cpu = { y: canvas.height/2 - 25, score: 0 };
        let ball = { x: canvas.width/2, y: canvas.height/2, dx: 3.5, dy: 2.2 };
        const paddleH = 50;
        const paddleW = 8;

        const handlePaddleMove = (clientY) => {
            const rect = canvas.getBoundingClientRect();
            const relativeY = clientY - rect.top;
            player.y = Math.min(canvas.height - paddleH, Math.max(0, relativeY - paddleH/2));
        };

        app.addGameListener(canvas, 'mousemove', e => {
            handlePaddleMove(e.clientY);
        });

        app.addGameListener(canvas, 'touchmove', e => {
            if (e.touches.length > 0) {
                e.preventDefault();
                handlePaddleMove(e.touches[0].clientY);
            }
        }, { passive: false });

        const resetBall = () => {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
            ball.dy = 2.2 * (Math.random() > 0.5 ? 1 : -1);
        };

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            ctx.clearRect(0,0, canvas.width, canvas.height);

            // Ball Physics boundaries
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y < 0 || ball.y >= canvas.height) {
                ball.dy *= -1;
                app.playTone('hit');
            }

            // CPU AI simple tracking
            const targetY = ball.y - paddleH/2;
            cpu.y += (targetY - cpu.y) * 0.08;
            cpu.y = Math.min(canvas.height - paddleH, Math.max(0, cpu.y));

            // Paddle Collisions
            // Player paddle (Left)
            if (ball.x <= 20 && ball.x > 10) {
                if (ball.y >= player.y && ball.y <= player.y + paddleH) {
                    ball.dx *= -1.05; // speedup slightly
                    ball.x = 21;
                    app.playTone('pop');
                }
            }

            // CPU paddle (Right)
            if (ball.x >= canvas.width - 20 && ball.x < canvas.width - 10) {
                if (ball.y >= cpu.y && ball.y <= cpu.y + paddleH) {
                    ball.dx *= -1.05;
                    ball.x = canvas.width - 21;
                    app.playTone('pop');
                }
            }

            // Score goals
            if (ball.x < 0) {
                cpu.score++;
                resetBall();
            } else if (ball.x > canvas.width) {
                player.score++;
                app.playTone('win');
                document.getElementById('game-score-val').textContent = player.score;
                app.submitScore('pong', player.score);
                resetBall();
            }

            // Draw paddles
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(10, player.y, paddleW, paddleH);
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(canvas.width - 10 - paddleW, cpu.y, paddleW, paddleH);

            // Draw center dash line
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(canvas.width/2, 0);
            ctx.lineTo(canvas.width/2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Ball
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
            ctx.fill();
        };

        resetBall();
        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 12. SPACE SHOOTER
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'space',
    name: 'Space Shooter',
    description: 'Destroy alien asteroid hazards inside a scrolling stellar horizon.',
    icon: 'fas fa-rocket',
    difficulty: 'hard',
    category: 'arcade',
    tags: ['space', 'shooter', 'asteroid', 'physics', 'action', 'bullets'],
    featured: true,
    controlsGuide: 'Left/Right or AD keys to move ship. Press Space Bar to fire lasers.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="space-canvas" width="380" height="340" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#space-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let ship = { x: canvas.width / 2 - 15, y: canvas.height - 40, w: 30, h: 20 };
        let lasers = [];
        let asteroids = [];
        let score = 0;
        let speed = 2.2;
        let frameCount = 0;
        let asteroidDestroyed = 0;

        const handleKeys = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                ship.x = Math.max(0, ship.x - 16);
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                ship.x = Math.min(canvas.width - ship.w, ship.x + 16);
            } else if (e.key === ' ') {
                e.preventDefault();
                lasers.push({ x: ship.x + ship.w/2 - 2, y: ship.y - 6 });
                app.playTone('laser');
            }
        };

        app.addGameListener(window, 'keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
            handleKeys(e);
        });

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            ctx.clearRect(0,0, canvas.width, canvas.height);

            // Draw player ship (triangle)
            ctx.fillStyle = '#ec4899';
            ctx.shadowBlur = 10; ctx.shadowColor = '#ec4899';
            ctx.beginPath();
            ctx.moveTo(ship.x + ship.w/2, ship.y);
            ctx.lineTo(ship.x, ship.y + ship.h);
            ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Spawn asteroids
            if (frameCount % 60 === 0) {
                asteroids.push({
                    x: Math.random() * (canvas.width - 20) + 10,
                    y: -20,
                    size: Math.random() * 12 + 10,
                    speed: Math.random() * 1.5 + speed
                });
            }

            // Move Lasers
            ctx.fillStyle = '#6366f1';
            lasers.forEach(l => {
                l.y -= 4.5;
                ctx.fillRect(l.x, l.y, 4, 8);
            });
            lasers = lasers.filter(l => l.y > 0);

            // Move Asteroids
            ctx.fillStyle = '#a855f7';
            asteroids.forEach(ast => {
                ast.y += ast.speed;
                
                // Draw asteroid circle
                ctx.beginPath();
                ctx.arc(ast.x, ast.y, ast.size, 0, Math.PI * 2);
                ctx.fill();

                // Player collision check
                if (ast.x + ast.size > ship.x && ast.x - ast.size < ship.x + ship.w) {
                    if (ast.y + ast.size > ship.y && ast.y - ast.size < ship.y + ship.h) {
                        // Game Over
                        app.playTone('hit');
                        app.submitScore('space', score);
                        cancelAnimationFrame(app.activeLoop);
                        app.activeLoop = null;

                        ctx.fillStyle = '#f43f5e';
                        ctx.font = '20px Orbitron, sans-serif';
                        ctx.fillText('MISSION FAILED!', canvas.width / 2 - 90, canvas.height / 2);
                    }
                }
            });

            // Bullet vs Asteroid collision check
            lasers.forEach((l, lIdx) => {
                asteroids.forEach((ast, aIdx) => {
                    const dist = Math.hypot(l.x - ast.x, l.y - ast.y);
                    if (dist < ast.size + 4) {
                        // Explode asteroid
                        app.playTone('hit');
                        lasers.splice(lIdx, 1);
                        asteroids.splice(aIdx, 1);
                        score += 5;
                        asteroidDestroyed++;
                        document.getElementById('game-score-val').textContent = score;

                        // Check achievement
                        if (asteroidDestroyed >= 20) {
                            app.unlockAchievement('space_legend');
                        }
                    }
                });
            });

            // Discard offscreen asteroids
            asteroids = asteroids.filter(ast => ast.y < canvas.height + 20);

            frameCount++;
        };

        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 13. BREAKOUT
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'breakout',
    name: 'Breakout brick',
    description: 'Master ball rebounds to demolish brick panels without dropping.',
    icon: 'fas fa-circle-nodes',
    difficulty: 'medium',
    category: 'arcade',
    tags: ['breakout', 'brick', 'rebound', 'arcade', 'retro', 'ball'],
    featured: false,
    controlsGuide: 'Slide mouse horizontally inside play area to move paddle.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="break-canvas" width="380" height="280" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#break-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let paddle = { x: canvas.width / 2 - 35, y: canvas.height - 25, w: 70, h: 8 };
        let ball = { x: canvas.width/2, y: canvas.height/2, dx: 2.2, dy: -2.2, r: 6 };
        
        let bricks = [];
        const rows = 4;
        const cols = 6;
        const w = 52;
        const h = 15;
        const offsetLeft = 24;
        const offsetTop = 20;

        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                bricks.push({ x: col * (w + 10) + offsetLeft, y: r * (h + 10) + offsetTop, active: true });
            }
        }

        let score = 0;

        const handlePaddleMove = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const relX = clientX - rect.left;
            paddle.x = Math.min(canvas.width - paddle.w, Math.max(0, relX - paddle.w/2));
        };

        app.addGameListener(canvas, 'mousemove', e => {
            handlePaddleMove(e.clientX);
        });

        app.addGameListener(canvas, 'touchmove', e => {
            if (e.touches.length > 0) {
                e.preventDefault();
                handlePaddleMove(e.touches[0].clientX);
            }
        }, { passive: false });

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            ctx.clearRect(0,0, canvas.width, canvas.height);

            // Ball Physics
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Wall bounces
            if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
                ball.dx *= -1;
                app.playTone('hit');
            }
            if (ball.y - ball.r < 0) {
                ball.dy *= -1;
                app.playTone('hit');
            }

            // Paddle bounce
            if (ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
                ball.dy = -Math.abs(ball.dy) * 1.05; // bounce up & speed up
                ball.y = paddle.y - ball.r - 1;
                app.playTone('pop');
            }

            // Fall gameover check
            if (ball.y - ball.r > canvas.height) {
                app.playTone('hit');
                app.submitScore('breakout', score);
                cancelAnimationFrame(app.activeLoop);
                app.activeLoop = null;

                ctx.fillStyle = '#f43f5e';
                ctx.font = '20px Orbitron, sans-serif';
                ctx.fillText('OUT OF BALLS!', canvas.width / 2 - 82, canvas.height / 2);
                return;
            }

            // Draw paddle
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

            // Draw Bricks
            ctx.fillStyle = '#6366f1';
            let activeBricks = 0;
            bricks.forEach(b => {
                if (b.active) {
                    activeBricks++;
                    ctx.fillRect(b.x, b.y, w, h);

                    // Ball brick collision
                    if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + w) {
                        if (ball.y + ball.r > b.y && ball.y - ball.r < b.y + h) {
                            b.active = false;
                            ball.dy *= -1;
                            score += 10;
                            document.getElementById('game-score-val').textContent = score;
                            app.playTone('pop');
                        }
                    }
                }
            });

            // Victory check
            if (activeBricks === 0) {
                app.submitScore('breakout', score + 100);
                app.showToast('Brick grid fully demolished! 🎉');
                cancelAnimationFrame(app.activeLoop);
                app.activeLoop = null;
            }

            // Draw Ball
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fill();
        };

        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 14. SIMON SAYS
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'simon',
    name: 'Simon Says Logic',
    description: 'Repeat sequence of flashing pads and synchronized synthetic audio.',
    icon: 'fas fa-table-cells-large',
    difficulty: 'medium',
    category: 'puzzle',
    tags: ['simon', 'says', 'logic', 'sequence', 'puzzle', 'memory'],
    featured: false,
    controlsGuide: 'Watch the flashing pads. Click in identical order.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="grid grid-cols-2 gap-4 w-64 h-64 aspect-square">
                    <button data-pad="0" class="simon-pad bg-emerald-500/20 border-4 border-emerald-500/50 hover:bg-emerald-500/30 w-full h-full rounded-tl-full rounded-br-2xl transition-all active:scale-95 shadow"></button>
                    <button data-pad="1" class="simon-pad bg-rose-500/20 border-4 border-rose-500/50 hover:bg-rose-500/30 w-full h-full rounded-tr-full rounded-bl-2xl transition-all active:scale-95 shadow"></button>
                    <button data-pad="2" class="simon-pad bg-amber-500/20 border-4 border-amber-500/50 hover:bg-amber-500/30 w-full h-full rounded-bl-full rounded-tr-2xl transition-all active:scale-95 shadow"></button>
                    <button data-pad="3" class="simon-pad bg-blue-500/20 border-4 border-blue-500/50 hover:bg-blue-500/30 w-full h-full rounded-br-full rounded-tl-2xl transition-all active:scale-95 shadow"></button>
                </div>
                <div id="sim-status" class="text-sm font-bold text-slate-400 font-display">Watch sequence...</div>
            </div>
        `;
    },
    init: (c, app) => {
        const pads = c.querySelectorAll('.simon-pad');
        const status = c.querySelector('#sim-status');

        const padStyles = [
            { bg: 'bg-emerald-500', glow: 'shadow-[0_0_20px_#10b981]' },
            { bg: 'bg-rose-500', glow: 'shadow-[0_0_20px_#f43f5e]' },
            { bg: 'bg-amber-500', glow: 'shadow-[0_0_20px_#f59e0b]' },
            { bg: 'bg-blue-500', glow: 'shadow-[0_0_20px_#3b82f6]' }
        ];

        let sequence = [];
        let playerSeq = [];
        let score = 0;
        let isPlayerTurn = false;

        const flashPad = (idx) => {
            const pad = pads[idx];
            if (!pad) return;
            const originalClass = pad.className;
            
            // Apply bright flash styles
            pad.className = originalClass.replace(/bg-\w+-500\/\d+/, padStyles[idx].bg) + ' ' + padStyles[idx].glow;
            app.playTone(idx === 0 ? 'pop' : idx === 1 ? 'jump' : idx === 2 ? 'laser' : 'hit');

            app.addTimeout(() => {
                pad.className = originalClass; // reset
            }, 350);
        };

        const playSequence = () => {
            if (!app.activeGame || app.activeGame.id !== 'simon') return;
            isPlayerTurn = false;
            playerSeq = [];
            status.textContent = "Watch sequence...";
            status.className = "text-sm font-bold text-slate-400 font-display";

            let delay = 0;
            sequence.forEach(idx => {
                app.addTimeout(() => flashPad(idx), delay);
                delay += 700;
            });

            app.addTimeout(() => {
                isPlayerTurn = true;
                status.textContent = "Repeat sequence!";
                status.className = "text-sm font-bold text-primary-500 font-display";
            }, delay - 200);
        };

        const nextRound = () => {
            if (!app.activeGame || app.activeGame.id !== 'simon') return;
            sequence.push(Math.floor(Math.random() * 4));
            app.addTimeout(playSequence, 800);
        };

        pads.forEach(pad => {
            app.addGameListener(pad, 'click', () => {
                if (!isPlayerTurn) return;
                const idx = parseInt(pad.getAttribute('data-pad'));
                
                flashPad(idx);
                playerSeq.push(idx);

                // Verify sequence
                const currStep = playerSeq.length - 1;
                if (playerSeq[currStep] !== sequence[currStep]) {
                    // Lose
                    app.playTone('hit');
                    app.showToast('Sequence Broken! Game Over ☠️', 'error');
                    status.textContent = "Broken Sequence!";
                    status.className = "text-sm font-bold text-rose-500 font-display";
                    app.submitScore('simon', score);
                    isPlayerTurn = false;
                    return;
                }

                if (playerSeq.length === sequence.length) {
                    score += 10;
                    document.getElementById('game-score-val').textContent = score;
                    app.playTone('win');
                    nextRound();
                }
            });
        });

        // Trigger first round
        nextRound();
    }
});

// --------------------------------------------------------------------------
// 15. WHACK-A-MOLE
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'mole',
    name: 'Whack-a-Mole',
    description: 'Test your reflexes by clicking moles popping out of grid holes.',
    icon: 'fas fa-hammer',
    difficulty: 'easy',
    category: 'casual',
    tags: ['mole', 'whack', 'reflexes', 'click', 'speed', 'casual'],
    featured: false,
    controlsGuide: 'Click the active glowing moles instantly as they pop up.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="grid grid-cols-3 gap-4 w-72 h-72 aspect-square">
                    ${Array.from({length: 9}).map((_, i) => `<button data-idx="${i}" class="mole-hole bg-slate-900 border border-slate-800 hover:border-slate-700/50 rounded-2xl w-full h-full flex items-center justify-center text-3xl transition-all cursor-pointer select-none active:scale-95">🕳️</button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const holes = c.querySelectorAll('.mole-hole');
        let activeIdx = -1;
        let score = 0;
        let isGameOver = false;

        const popMole = () => {
            if (isGameOver || !app.activeGame || app.activeGame.id !== 'mole') return;
            
            // Reset previous
            if (activeIdx > -1) {
                holes[activeIdx].textContent = '🕳️';
                holes[activeIdx].className = 'mole-hole bg-slate-900 border border-slate-800 rounded-2xl w-full h-full flex items-center justify-center text-3xl transition-all cursor-pointer active:scale-95';
            }

            activeIdx = Math.floor(Math.random() * 9);
            const activeHole = holes[activeIdx];
            activeHole.textContent = '🐹';
            activeHole.className += ' bg-amber-500/10 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]';

            // Auto-hide mole after delay
            app.addTimeout(() => {
                if (activeHole.textContent === '🐹') {
                    activeHole.textContent = '🕳️';
                    activeHole.className = 'mole-hole bg-slate-900 border border-slate-800 rounded-2xl w-full h-full flex items-center justify-center text-3xl transition-all cursor-pointer active:scale-95';
                    popMole(); // pop next
                }
            }, Math.max(700, 1500 - score * 12));
        };

        holes.forEach(hole => {
            app.addGameListener(hole, 'click', () => {
                if (isGameOver) return;
                
                if (hole.textContent === '🐹') {
                    score += 5;
                    document.getElementById('game-score-val').textContent = score;
                    app.playTone('pop');
                    app.submitScore('mole', score);
                    
                    hole.textContent = '💥';
                    app.addTimeout(() => {
                        hole.textContent = '🕳️';
                        hole.className = 'mole-hole bg-slate-900 border border-slate-800 rounded-2xl w-full h-full flex items-center justify-center text-3xl transition-all cursor-pointer active:scale-95';
                    }, 250);
                } else {
                    // Miss Whack
                    score = Math.max(0, score - 2);
                    app.playTone('hit');
                    document.getElementById('game-score-val').textContent = score;
                }
            });
        });

        // Trigger mole pops
        popMole();
    }
});

// --------------------------------------------------------------------------
// 16. MINESWEEPER
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'mines',
    name: 'Minesweeper Classic',
    description: 'Solve board grids by revealing tiles without triggering hidden explosive mines.',
    icon: 'fas fa-bomb',
    difficulty: 'hard',
    category: 'puzzle',
    tags: ['minesweeper', 'mines', 'bomb', 'logic', 'puzzle'],
    featured: false,
    controlsGuide: 'Left-click cells to reveal. Right-click to flag potential mines.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="grid grid-cols-8 gap-1.5 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-72 h-72 aspect-square">
                    ${Array.from({length: 64}).map((_, i) => `<button data-idx="${i}" class="mine-cell bg-slate-950 border border-slate-900 w-full h-full rounded-md text-xs font-bold font-mono text-slate-100 flex items-center justify-center transition-all cursor-pointer"></button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const cells = c.querySelectorAll('.mine-cell');
        
        let board = Array(64).fill(0);
        let mines = new Set();
        let revealed = new Set();
        let flagged = new Set();
        let isGameOver = false;

        // Spawn 10 random mines
        while (mines.size < 10) {
            mines.add(Math.floor(Math.random() * 64));
        }

        // Calculate Proximity numbers
        for (let i = 0; i < 64; i++) {
            if (mines.has(i)) continue;
            
            let count = 0;
            const r = Math.floor(i / 8);
            const col = i % 8;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        if (mines.has(nr * 8 + nc)) count++;
                    }
                }
            }
            board[i] = count;
        }

        const revealCell = (idx) => {
            if (revealed.has(idx) || flagged.has(idx) || isGameOver) return;
            revealed.add(idx);

            const cell = c.querySelector(`[data-idx="${idx}"]`);
            cell.disabled = true;

            if (mines.has(idx)) {
                // Explode mine
                isGameOver = true;
                app.playTone('hit');
                app.showToast('Boom! Game Over 💥', 'error');

                // reveal all mines
                mines.forEach(mIdx => {
                    const mCell = c.querySelector(`[data-idx="${mIdx}"]`);
                    mCell.textContent = '💣';
                    mCell.className = 'mine-cell bg-rose-500/10 border border-rose-500/30 rounded-md text-xs flex items-center justify-center';
                });
                return;
            }

            app.playTone('pop');
            cell.className = 'mine-cell bg-slate-800/80 border border-slate-700/50 rounded-md text-xs font-bold font-mono flex items-center justify-center';

            if (board[idx] > 0) {
                cell.textContent = board[idx];
                const numColors = { 1: 'text-blue-500', 2: 'text-emerald-500', 3: 'text-rose-500', 4: 'text-purple-500' };
                cell.className += ' ' + (numColors[board[idx]] || 'text-slate-400');
            } else {
                // Auto-reveal surrounding zero-density squares
                const r = Math.floor(idx / 8);
                const col = idx % 8;

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = col + dc;
                        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                            revealCell(nr * 8 + nc);
                        }
                    }
                }
            }

            // Win check
            if (revealed.size === 54) {
                app.playTone('win');
                app.submitScore('mines', 100);
                app.showToast('Mine grid fully solved! 🏆');
                isGameOver = true;
            }
        };

        const toggleFlag = (idx, e) => {
            e.preventDefault();
            if (revealed.has(idx) || isGameOver) return;

            const cell = c.querySelector(`[data-idx="${idx}"]`);
            if (flagged.has(idx)) {
                flagged.delete(idx);
                cell.textContent = '';
                cell.className = 'mine-cell bg-slate-950 border border-slate-900 w-full h-full rounded-md text-xs flex items-center justify-center';
            } else {
                flagged.add(idx);
                cell.textContent = '🚩';
                cell.className = 'mine-cell bg-amber-500/10 border border-amber-500/30 rounded-md text-xs flex items-center justify-center animate-pulse';
                app.playTone('pop');
            }
        };

        cells.forEach(cell => {
            app.addGameListener(cell, 'click', () => {
                const idx = parseInt(cell.getAttribute('data-idx'));
                revealCell(idx);
            });

            app.addGameListener(cell, 'contextmenu', (e) => {
                const idx = parseInt(cell.getAttribute('data-idx'));
                toggleFlag(idx, e);
            });
        });
    }
});

// --------------------------------------------------------------------------
// 17. DINO RUNNER CLONE
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'dino',
    name: 'Dino Runner Clone',
    description: 'Classic horizontal canvas obstacle jumper running loop.',
    icon: 'fas fa-dragon',
    difficulty: 'medium',
    category: 'arcade',
    tags: ['dino', 'runner', 'retro', 'jumper', 'physics'],
    featured: false,
    controlsGuide: 'Press Space Bar or Click canvas to leap over approaching obstacles.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full h-full relative">
                <canvas id="dino-canvas" width="380" height="200" class="border border-slate-800 rounded-xl bg-slate-950 max-w-full"></canvas>
            </div>
        `;
    },
    init: (c, app) => {
        const canvas = c.querySelector('#dino-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let dino = { y: canvas.height - 35, vel: 0, gravity: 0.35, lift: -6.5, isJumping: false };
        let obstacles = [];
        let score = 0;
        let speed = 3;
        let isGameOver = false;
        let frameCount = 0;

        const jump = () => {
            if (dino.isJumping || isGameOver) return;
            dino.vel = dino.lift;
            dino.isJumping = true;
            app.playTone('jump');
        };

        app.addGameListener(window, 'keydown', e => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        });
        if (canvas) app.addGameListener(canvas, 'pointerdown', jump);

        const loop = () => {
            app.activeLoop = requestAnimationFrame(loop);

            ctx.clearRect(0,0, canvas.width, canvas.height);

            // Ground line
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.beginPath(); ctx.moveTo(0, canvas.height - 15); ctx.lineTo(canvas.width, canvas.height - 15); ctx.stroke();

            // Dino Physics
            dino.vel += dino.gravity;
            dino.y += dino.vel;

            if (dino.y >= canvas.height - 35) {
                dino.y = canvas.height - 35;
                dino.vel = 0;
                dino.isJumping = false;
            }

            // Draw Dino (glowing neon rectangle)
            ctx.fillStyle = '#ec4899';
            ctx.shadowBlur = 10; ctx.shadowColor = '#ec4899';
            ctx.fillRect(30, dino.y, 20, 20);
            ctx.shadowBlur = 0;

            // Spawn Obstacles
            if (frameCount % 120 === 0) {
                obstacles.push({
                    x: canvas.width,
                    y: canvas.height - 35,
                    w: 12,
                    h: Math.random() * 15 + 15
                });
            }

            // Move & Draw Obstacles
            ctx.fillStyle = '#10b981';
            obstacles.forEach(obs => {
                obs.x -= speed;
                ctx.fillRect(obs.x, obs.y + (20 - obs.h), obs.w, obs.h);

                // Collision Check
                if (obs.x < 50 && obs.x + obs.w > 30) {
                    if (dino.y + 20 > obs.y + (20 - obs.h)) {
                        // Game Over
                        isGameOver = true;
                        app.playTone('hit');
                        app.submitScore('dino', score);
                        cancelAnimationFrame(app.activeLoop);
                        app.activeLoop = null;

                        ctx.fillStyle = '#f43f5e';
                        ctx.font = '20px Orbitron, sans-serif';
                        ctx.fillText('CRASHED!', canvas.width / 2 - 55, canvas.height / 2);
                    }
                }
            });

            // Clean offscreen
            obstacles = obstacles.filter(obs => obs.x > -20);

            // Increment Score
            if (frameCount % 5 === 0) {
                score++;
                document.getElementById('game-score-val').textContent = score;
                if (score % 100 === 0) speed += 0.25; // accelerate slowly
            }

            frameCount++;
        };

        app.activeLoop = requestAnimationFrame(loop);
    }
});

// --------------------------------------------------------------------------
// 18. NUMBER PUZZLE
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'numpuzzle',
    name: '15-Block Slide Puzzle',
    description: 'Slide numbered board tiles to sort them in numeric sequence.',
    icon: 'fas fa-arrow-down-1-9',
    difficulty: 'medium',
    category: 'puzzle',
    tags: ['puzzle', 'number', 'sliding', 'blocks', 'sort'],
    featured: false,
    controlsGuide: 'Click adjacent tiles to slide them into the empty slots.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="grid grid-cols-4 gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-72 h-72 aspect-square">
                    ${Array.from({length: 16}).map((_, i) => `<button id="np-cell-${i}" data-idx="${i}" class="np-cell w-full h-full rounded-xl flex items-center justify-center text-sm font-bold font-display transition-all duration-200 cursor-pointer active:scale-95"></button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const cells = c.querySelectorAll('.np-cell');
        
        let board = Array.from({length: 15}, (_, i) => i + 1);
        board.push(0); // empty slot representation
        
        // Shuffle blocks
        const shuffle = () => {
            for (let i = 0; i < 200; i++) {
                const empty = board.indexOf(0);
                const adjacent = [];
                const r = Math.floor(empty / 4);
                const col = empty % 4;

                if (r > 0) adjacent.push(empty - 4);
                if (r < 3) adjacent.push(empty + 4);
                if (col > 0) adjacent.push(empty - 1);
                if (col < 3) adjacent.push(empty + 1);

                const swapIdx = adjacent[Math.floor(Math.random() * adjacent.length)];
                board[empty] = board[swapIdx];
                board[swapIdx] = 0;
            }
        };

        const renderGrid = () => {
            const bgClass = 'bg-primary-500/10 text-primary-500 border border-primary-500/20';
            const emptyClass = 'bg-slate-950 border border-slate-900 cursor-not-allowed';

            for (let i = 0; i < 16; i++) {
                const cell = c.querySelector(`#np-cell-${i}`);
                cell.textContent = board[i] > 0 ? board[i] : '';
                cell.className = `np-cell w-full h-full rounded-xl flex items-center justify-center text-sm font-bold font-display transition-all duration-200 ${board[i] > 0 ? bgClass : emptyClass}`;
            }
        };

        const slideBlock = (idx) => {
            const empty = board.indexOf(0);
            const r = Math.floor(idx / 4);
            const col = idx % 4;
            const er = Math.floor(empty / 4);
            const ecol = empty % 4;

            // Check proximity
            const dist = Math.abs(r - er) + Math.abs(col - ecol);
            if (dist === 1) {
                // Swap
                board[empty] = board[idx];
                board[idx] = 0;
                app.playTone('pop');
                renderGrid();

                // Check Win
                const isWon = board.slice(0, 15).every((val, i) => val === i + 1);
                if (isWon) {
                    app.playTone('win');
                    app.submitScore('numpuzzle', 100);
                    app.showToast('Sequence solved successfully! 🏆');
                }
            }
        };

        cells.forEach(cell => {
            app.addGameListener(cell, 'click', () => {
                const idx = parseInt(cell.getAttribute('data-idx'));
                slideBlock(idx);
            });
        });

        shuffle();
        renderGrid();
    }
});

// --------------------------------------------------------------------------
// 19. CHESS (BASIC)
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'chess',
    name: 'Tactical Chessboard',
    description: 'Focus on chess movement, strategy, and layout alignment locally.',
    icon: 'fas fa-chess',
    difficulty: 'hard',
    category: 'strategy',
    tags: ['chess', 'board', 'strategy', 'local', 'multiplayer'],
    featured: false,
    controlsGuide: 'Click pieces to highlight, then click highlighted squares to move.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none font-display">
                <div id="chess-status" class="text-sm font-bold text-slate-400">White's Turn</div>
                <div class="grid grid-cols-8 gap-0 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-72 h-72 aspect-square">
                    ${Array.from({length: 64}).map((_, i) => {
                        const r = Math.floor(i / 8);
                        const col = i % 8;
                        const isDark = (r + col) % 2 === 1;
                        const cellBg = isDark ? 'bg-slate-950 border-slate-950' : 'bg-slate-800 border-slate-800';
                        return `<button data-idx="${i}" class="chess-cell ${cellBg} border w-full h-full text-base flex items-center justify-center transition-all cursor-pointer font-sans"></button>`;
                    }).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const cells = c.querySelectorAll('.chess-cell');
        const statusLbl = c.querySelector('#chess-status');
        
        let board = Array(64).fill('');
        let selectedIdx = -1;
        let currentTurn = 'white';

        const pieces = {
            // White pieces
            0: '♜', 1: '♞', 2: '♝', 3: '♛', 4: '♚', 5: '♝', 6: '♞', 7: '♜',
            8: '♟', 9: '♟', 10: '♟', 11: '♟', 12: '♟', 13: '♟', 14: '♟', 15: '♟',
            // Black pieces
            48: '♙', 49: '♙', 50: '♙', 51: '♙', 52: '♙', 53: '♙', 54: '♙', 55: '♙',
            56: '♖', 57: '♘', 58: '♗', 59: '♕', 60: '♔', 61: '♗', 62: '♘', 63: '♖'
        };

        // Populate board
        for (let i = 0; i < 64; i++) {
            board[i] = pieces[i] || '';
        }

        const getPieceColor = (char) => {
            if (!char) return null;
            if (['♖', '♘', '♗', '♕', '♔', '♙'].includes(char)) return 'white';
            if (['♜', '♞', '♝', '♛', '♚', '♟'].includes(char)) return 'black';
            return null;
        };

        const isValidMove = (fromIdx, toIdx, piece) => {
            const fromR = Math.floor(fromIdx / 8);
            const fromC = fromIdx % 8;
            const toR = Math.floor(toIdx / 8);
            const toC = toIdx % 8;

            const dr = toR - fromR;
            const dc = toC - fromC;
            const absR = Math.abs(dr);
            const absC = Math.abs(dc);

            // Cannot capture own pieces
            const fromColor = getPieceColor(piece);
            const targetColor = getPieceColor(board[toIdx]);
            if (fromColor === targetColor) return false;

            // Rook checks (straight line movements)
            if (piece === '♜' || piece === '♖') {
                if (fromR !== toR && fromC !== toC) return false;
                const stepR = dr === 0 ? 0 : dr / absR;
                const stepC = dc === 0 ? 0 : dc / absC;
                let currR = fromR + stepR;
                let currC = fromC + stepC;
                while (currR !== toR || currC !== toC) {
                    if (board[currR * 8 + currC] !== '') return false;
                    currR += stepR;
                    currC += stepC;
                }
                return true;
            }

            // Knight checks (L-shape movements)
            if (piece === '♞' || piece === '♘') {
                return (absR === 2 && absC === 1) || (absR === 1 && absC === 2);
            }

            // Pawn checks (forward steps or captures)
            if (piece === '♟') { // Black Pawn (moves down the board)
                if (dc === 0 && dr === 1 && board[toIdx] === '') return true;
                if (dc === 0 && dr === 2 && fromR === 1 && board[fromIdx + 8] === '' && board[toIdx] === '') return true;
                if (absC === 1 && dr === 1 && board[toIdx] !== '' && targetColor === 'white') return true;
                return false;
            }
            if (piece === '♙') { // White Pawn (moves up the board)
                if (dc === 0 && dr === -1 && board[toIdx] === '') return true;
                if (dc === 0 && dr === -2 && fromR === 6 && board[fromIdx - 8] === '' && board[toIdx] === '') return true;
                if (absC === 1 && dr === -1 && board[toIdx] !== '' && targetColor === 'black') return true;
                return false;
            }

            // Bishops
            if (piece === '♝' || piece === '♗') {
                if (absR !== absC) return false;
                const stepR = dr / absR;
                const stepC = dc / absC;
                let currR = fromR + stepR;
                let currC = fromC + stepC;
                while (currR !== toR || currC !== toC) {
                    if (board[currR * 8 + currC] !== '') return false;
                    currR += stepR;
                    currC += stepC;
                }
                return true;
            }

            // Queen
            if (piece === '♛' || piece === '♕') {
                if (fromR !== toR && fromC !== toC && absR !== absC) return false;
                const stepR = dr === 0 ? 0 : dr / absR;
                const stepC = dc === 0 ? 0 : dc / absC;
                let currR = fromR + stepR;
                let currC = fromC + stepC;
                while (currR !== toR || currC !== toC) {
                    if (board[currR * 8 + currC] !== '') return false;
                    currR += stepR;
                    currC += stepC;
                }
                return true;
            }

            // King
            if (piece === '♚' || piece === '♔') {
                return absR <= 1 && absC <= 1;
            }

            return true;
        };

        const renderBoard = () => {
            for (let i = 0; i < 64; i++) {
                const cell = c.querySelector(`[data-idx="${i}"]`);
                cell.textContent = board[i];
                
                const r = Math.floor(i / 8);
                const col = i % 8;
                const isDark = (r + col) % 2 === 1;
                cell.className = `chess-cell border w-full h-full text-lg flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-slate-950 border-slate-950 text-slate-100' : 'bg-slate-800 border-slate-800 text-slate-100'}`;
            }
        };

        const handleCellClick = (idx) => {
            const cell = c.querySelector(`[data-idx="${idx}"]`);

            if (selectedIdx === -1) {
                const piece = board[idx];
                if (piece !== '' && getPieceColor(piece) === currentTurn) {
                    selectedIdx = idx;
                    cell.className += ' bg-primary-500/25 border-primary-500';
                    app.playTone('pop');
                }
            } else {
                if (selectedIdx === idx) {
                    selectedIdx = -1;
                    renderBoard();
                } else {
                    const piece = board[selectedIdx];
                    if (isValidMove(selectedIdx, idx, piece)) {
                        const targetPiece = board[idx];
                        if (targetPiece === '♚' || targetPiece === '♔') {
                            app.playTone('win');
                            app.submitScore('chess', 100);
                            app.showToast(`Checkmate! ${currentTurn.toUpperCase()} WINS! 🏆`);
                        }

                        board[idx] = piece;
                        board[selectedIdx] = '';
                        selectedIdx = -1;
                        app.playTone('pop');
                        
                        currentTurn = currentTurn === 'white' ? 'black' : 'white';
                        if (statusLbl) {
                            statusLbl.textContent = `${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}'s Turn`;
                        }
                        
                        renderBoard();
                    } else {
                        const nextPiece = board[idx];
                        if (nextPiece !== '' && getPieceColor(nextPiece) === currentTurn) {
                            selectedIdx = idx;
                            renderBoard();
                            const newCell = c.querySelector(`[data-idx="${idx}"]`);
                            newCell.className += ' bg-primary-500/25 border-primary-500';
                            app.playTone('pop');
                        } else {
                            selectedIdx = -1;
                            app.playTone('hit');
                            renderBoard();
                        }
                    }
                }
            }
        };

        cells.forEach(cell => {
            app.addGameListener(cell, 'click', () => {
                const idx = parseInt(cell.getAttribute('data-idx'));
                handleCellClick(idx);
            });
        });

        renderBoard();
    }
});

// --------------------------------------------------------------------------
// 20. SUDOKU
// --------------------------------------------------------------------------
window.BROWSER_GAMES_LIST.push({
    id: 'sudoku',
    name: 'Sudoku Grid Solver',
    description: 'Solve logical number matrices featuring dynamic helpers.',
    icon: 'fas fa-table',
    difficulty: 'hard',
    category: 'puzzle',
    tags: ['sudoku', 'matrix', 'numbers', 'puzzle', 'logic'],
    featured: false,
    controlsGuide: 'Click cells, then select digit values (1-9) using options.',
    render: (c) => {
        c.innerHTML = `
            <div class="flex flex-col items-center gap-6 w-full max-w-sm select-none">
                <div class="grid grid-cols-9 gap-0.5 p-2 bg-slate-900 border border-slate-800 rounded-2xl w-72 h-72 aspect-square">
                    ${Array.from({length: 81}).map((_, i) => `<button id="sd-cell-${i}" data-idx="${i}" class="sd-cell w-full h-full bg-slate-950 border border-slate-900 flex items-center justify-center text-xs font-bold font-mono transition-all duration-200 cursor-pointer"></button>`).join('')}
                </div>
                <div class="grid grid-cols-9 gap-1.5 w-full">
                    ${Array.from({length: 9}, (_, i) => i + 1).map(n => `<button data-num="${n}" class="sd-input-btn bg-slate-900 border border-slate-800 hover:border-primary-500 rounded p-2 text-xs font-bold font-mono text-slate-300 transition-colors active:scale-95">${n}</button>`).join('')}
                </div>
            </div>
        `;
    },
    init: (c, app) => {
        const cells = c.querySelectorAll('.sd-cell');
        const numBtns = c.querySelectorAll('.sd-input-btn');
        
        let board = Array(81).fill(0);
        let selectedIdx = -1;

        // Static partial Sudoku board
        const solved = [
            5,3,4,6,7,8,9,1,2,
            6,7,2,1,9,5,3,4,8,
            1,9,8,3,4,2,5,6,7,
            8,5,9,7,6,1,4,2,3,
            4,2,6,8,5,3,7,9,1,
            7,1,3,9,2,4,8,5,6,
            9,6,1,5,3,7,2,8,4,
            2,8,7,4,1,9,6,3,5,
            3,4,5,2,8,6,1,7,9
        ];

        // Mask half the board
        for (let i = 0; i < 81; i++) {
            board[i] = Math.random() > 0.45 ? solved[i] : 0;
        }

        const renderGrid = () => {
            const inputClass = 'bg-primary-500/10 text-primary-500 border border-primary-500/20';
            const defaultClass = 'bg-slate-950 text-slate-300 border border-slate-900';

            for (let i = 0; i < 81; i++) {
                const cell = c.querySelector(`#sd-cell-${i}`);
                cell.textContent = board[i] > 0 ? board[i] : '';
                cell.className = `sd-cell w-full h-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-200 ${board[i] > 0 ? defaultClass : 'bg-slate-900 border border-slate-800'}`;
            }
        };

        cells.forEach(cell => {
            app.addGameListener(cell, 'click', () => {
                const idx = parseInt(cell.getAttribute('data-idx'));
                selectedIdx = idx;
                
                renderGrid();
                cell.className += ' bg-primary-500/20 border border-primary-500/40 animate-pulse';
                app.playTone('pop');
            });
        });

        numBtns.forEach(btn => {
            app.addGameListener(btn, 'click', () => {
                if (selectedIdx === -1) return;
                const num = parseInt(btn.getAttribute('data-num'));

                board[selectedIdx] = num;
                app.playTone('pop');
                renderGrid();

                // Check Win
                const isComplete = board.every((val, i) => val === solved[i]);
                if (isComplete) {
                    app.playTone('win');
                    app.submitScore('sudoku', 100);
                    app.showToast('Sudoku solved successfully! 🏆');
                }
            });
        });

        renderGrid();
    }
});
