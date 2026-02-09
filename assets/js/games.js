(function () {
  'use strict';

  const game = document.querySelector('[data-game]')?.dataset.game;

  function initReflexTap() {
    const root = document.querySelector('[data-game="reflex-tap"]');
    if (!root) return;
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const scoreEl = root.querySelector('[data-score]');
    const bestEl = root.querySelector('[data-best]');
    const timeEl = root.querySelector('[data-time]');
    const statusEl = root.querySelector('[data-status]');
    const startBtn = root.querySelector('[data-start]');
    const pauseBtn = root.querySelector('[data-pause]');
    const restartBtn = root.querySelector('[data-restart]');
    let running = false, paused = false, rafId = 0, score = 0, timeLeft = 30, lastTick = 0;
    let best = Number(localStorage.getItem('reflexTapBest') || 0);
    let target = { x: 80, y: 80, r: 24 };
    bestEl.textContent = String(best);

    const fitCanvas = () => { const size = Math.min(460, Math.max(260, root.clientWidth - 36)); canvas.width = size; canvas.height = size; draw(); };
    const spawnTarget = () => { const m = 32; target.r = 20 + Math.random() * 16; target.x = m + Math.random() * (canvas.width - m * 2); target.y = m + Math.random() * (canvas.height - m * 2); };
    const draw = () => { ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.beginPath(); ctx.arc(target.x, target.y, target.r, 0, Math.PI*2); ctx.fillStyle = '#60a5fa'; ctx.fill(); ctx.beginPath(); ctx.arc(target.x,target.y,Math.max(7,target.r-8),0,Math.PI*2); ctx.fillStyle='#dbeafe'; ctx.fill(); };
    const stop = (msg) => { running = false; paused = false; cancelAnimationFrame(rafId); pauseBtn.textContent = 'Pause'; statusEl.textContent = msg; if (score > best) { best = score; bestEl.textContent = String(best); localStorage.setItem('reflexTapBest', String(best)); } };
    const loop = (t) => { if (!running || paused) return; if (!lastTick) lastTick = t; if (t - lastTick >= 1000) { timeLeft -= 1; timeEl.textContent = `${timeLeft}s`; lastTick = t; if (timeLeft <= 0) return stop('Time up!'); } draw(); rafId = requestAnimationFrame(loop); };
    const start = () => { running = true; paused = false; score = 0; timeLeft = 30; lastTick = 0; scoreEl.textContent = '0'; timeEl.textContent = '30s'; statusEl.textContent = 'Go!'; spawnTarget(); rafId = requestAnimationFrame(loop); };
    const hit = (x, y) => { if (!running || paused) return; const dx = x - target.x, dy = y - target.y; if (dx * dx + dy * dy <= target.r * target.r) { score += 1; scoreEl.textContent = String(score); spawnTarget(); draw(); } };
    const point = (e) => { const r = canvas.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * canvas.width, y: ((e.clientY - r.top) / r.height) * canvas.height }; };

    fitCanvas(); spawnTarget(); draw();
    canvas.addEventListener('pointerdown', (e) => { const p = point(e); hit(p.x, p.y); });
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', () => { if (!running) return; paused = !paused; pauseBtn.textContent = paused ? 'Resume' : 'Pause'; if (!paused) rafId = requestAnimationFrame(loop); });
    restartBtn.addEventListener('click', start);
    addEventListener('resize', fitCanvas, { passive: true });
  }

  function initSnake() {
    const root = document.querySelector('[data-game="snake"]');
    if (!root) return;
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = root.querySelector('[data-score]');
    const bestEl = root.querySelector('[data-best]');
    const stateEl = root.querySelector('[data-state]');
    let best = Number(localStorage.getItem('snakeBest') || 0);
    bestEl.textContent = String(best);
    const size = 20;
    let snake, dir, nextDir, food, score, timer;

    const reset = () => {
      snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 }; score = 0;
      food = { x: 12, y: 10 }; scoreEl.textContent = '0'; stateEl.textContent = 'Ready'; draw();
    };
    const randFood = () => {
      do { food = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }; } while (snake.some((s) => s.x === food.x && s.y === food.y));
    };
    const draw = () => {
      const cell = canvas.width / size;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f43f5e'; ctx.fillRect(food.x * cell, food.y * cell, cell - 1, cell - 1);
      ctx.fillStyle = '#60a5fa'; snake.forEach((s, i) => { ctx.fillStyle = i === 0 ? '#93c5fd' : '#60a5fa'; ctx.fillRect(s.x * cell, s.y * cell, cell - 1, cell - 1); });
    };
    const end = () => { clearInterval(timer); timer = null; stateEl.textContent = 'Game Over'; if (score > best) { best = score; bestEl.textContent = String(best); localStorage.setItem('snakeBest', String(best)); } };
    const tick = () => {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= size || head.y >= size || snake.some((s) => s.x === head.x && s.y === head.y)) return end();
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score += 1; scoreEl.textContent = String(score); randFood(); } else snake.pop();
      draw();
    };
    const start = () => { if (timer) return; stateEl.textContent = 'Playing'; timer = setInterval(tick, 120); };
    const setDir = (d) => {
      if (d.x === -dir.x && d.y === -dir.y) return;
      nextDir = d;
    };

    root.querySelector('[data-start]').addEventListener('click', start);
    root.querySelector('[data-reset]').addEventListener('click', () => { clearInterval(timer); timer = null; reset(); });
    root.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => setDir({ up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[b.dataset.dir])));
    addEventListener('keydown', (e) => { const map = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }; if (map[e.key]) { e.preventDefault(); setDir(map[e.key]); start(); } });
    reset();
  }

  function initMemory() {
    const root = document.querySelector('[data-game="memory"]');
    if (!root) return;
    const grid = root.querySelector('[data-memory-grid]');
    const movesEl = root.querySelector('[data-moves]');
    const matchesEl = root.querySelector('[data-matches]');
    const bestEl = root.querySelector('[data-best]');
    let best = Number(localStorage.getItem('memoryBest') || 0);
    bestEl.textContent = best ? String(best) : '--';
    const symbols = ['🍉', '🚀', '🎯', '⚡', '🎵', '🌙', '🔥', '🎮'];
    let first = null, lock = false, moves = 0, matches = 0;

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const setup = () => {
      const deck = shuffle([...symbols, ...symbols]).map((icon, i) => ({ id: i, icon, matched: false }));
      grid.innerHTML = '';
      moves = 0; matches = 0; first = null; lock = false;
      movesEl.textContent = '0'; matchesEl.textContent = '0';
      deck.forEach((card) => {
        const btn = document.createElement('button');
        btn.className = 'memory-card';
        btn.type = 'button';
        btn.dataset.icon = card.icon;
        btn.textContent = '?';
        btn.addEventListener('click', () => flip(btn));
        grid.appendChild(btn);
      });
    };
    const flip = (btn) => {
      if (lock || btn.classList.contains('matched') || btn === first) return;
      btn.classList.add('revealed'); btn.textContent = btn.dataset.icon;
      if (!first) { first = btn; return; }
      moves += 1; movesEl.textContent = String(moves);
      if (first.dataset.icon === btn.dataset.icon) {
        first.classList.add('matched'); btn.classList.add('matched');
        matches += 1; matchesEl.textContent = String(matches);
        first = null;
        if (matches === symbols.length) {
          if (!best || moves < best) { best = moves; localStorage.setItem('memoryBest', String(best)); bestEl.textContent = String(best); }
        }
      } else {
        lock = true;
        setTimeout(() => {
          first.classList.remove('revealed'); btn.classList.remove('revealed');
          first.textContent = '?'; btn.textContent = '?';
          first = null; lock = false;
        }, 700);
      }
    };
    root.querySelector('[data-new-game]').addEventListener('click', setup);
    setup();
  }

  if (game === 'reflex-tap') initReflexTap();
  if (game === 'snake') initSnake();
  if (game === 'memory') initMemory();
})();
