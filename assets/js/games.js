(function () {
  'use strict';

  const gameRoot = document.querySelector('[data-game="reflex-tap"]');
  if (!gameRoot) return;

  const canvas = gameRoot.querySelector('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scoreEl = gameRoot.querySelector('[data-score]');
  const bestEl = gameRoot.querySelector('[data-best]');
  const timeEl = gameRoot.querySelector('[data-time]');
  const statusEl = gameRoot.querySelector('[data-status]');

  const startBtn = gameRoot.querySelector('[data-start]');
  const pauseBtn = gameRoot.querySelector('[data-pause]');
  const restartBtn = gameRoot.querySelector('[data-restart]');

  let running = false;
  let paused = false;
  let initialized = false;
  let rafId = 0;
  let score = 0;
  let best = Number(localStorage.getItem('reflexTapBest') || 0);
  let timeLeft = 30;
  let lastTick = 0;
  let target = { x: 70, y: 70, r: 26 };

  bestEl.textContent = String(best);

  const fitCanvas = () => {
    const size = Math.min(460, Math.max(260, gameRoot.clientWidth - 36));
    canvas.width = size;
    canvas.height = size;
    draw();
  };

  const spawnTarget = () => {
    const margin = 32;
    target.r = 20 + Math.random() * 18;
    target.x = margin + Math.random() * (canvas.width - margin * 2);
    target.y = margin + Math.random() * (canvas.height - margin * 2);
  };

  const draw = () => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 14; i += 1) {
      ctx.fillRect((i * 37) % canvas.width, (i * 57) % canvas.height, 2, 2);
    }

    ctx.beginPath();
    ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
    ctx.fillStyle = '#60a5fa';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(target.x, target.y, Math.max(7, target.r - 8), 0, Math.PI * 2);
    ctx.fillStyle = '#dbeafe';
    ctx.fill();
  };

  const gameLoop = (timestamp) => {
    if (!running || paused) return;
    if (!lastTick) lastTick = timestamp;

    if (timestamp - lastTick >= 1000) {
      timeLeft -= 1;
      timeEl.textContent = `${timeLeft}s`;
      lastTick = timestamp;
      if (timeLeft <= 0) {
        stopGame('Time up! Tap restart for another round.');
        return;
      }
    }

    draw();
    rafId = window.requestAnimationFrame(gameLoop);
  };

  const startLoop = () => {
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(gameLoop);
  };

  const stopGame = (message) => {
    running = false;
    paused = false;
    window.cancelAnimationFrame(rafId);
    pauseBtn.textContent = 'Pause';
    statusEl.textContent = message;
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      localStorage.setItem('reflexTapBest', String(best));
    }
  };

  const beginGame = () => {
    running = true;
    paused = false;
    score = 0;
    timeLeft = 30;
    lastTick = 0;
    scoreEl.textContent = '0';
    timeEl.textContent = '30s';
    statusEl.textContent = 'Go! Hit as many targets as possible.';
    spawnTarget();
    startLoop();
  };

  const hit = (x, y) => {
    if (!running || paused) return;
    const dx = x - target.x;
    const dy = y - target.y;
    if (dx * dx + dy * dy <= target.r * target.r) {
      score += 1;
      scoreEl.textContent = String(score);
      spawnTarget();
      draw();
    }
  };

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * canvas.width,
      y: ((source.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const initGame = () => {
    if (initialized) return;
    initialized = true;
    fitCanvas();
    spawnTarget();
    draw();

    canvas.addEventListener('pointerdown', (event) => {
      const p = getPoint(event);
      hit(p.x, p.y);
    });

    window.addEventListener('resize', fitCanvas, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && running && !paused) {
        paused = true;
        pauseBtn.textContent = 'Resume';
        statusEl.textContent = 'Paused automatically in background.';
        window.cancelAnimationFrame(rafId);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (!running || paused) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        hit(target.x, target.y);
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      initGame();
      observer.disconnect();
    }
  }, { rootMargin: '120px' });
  observer.observe(gameRoot);

  startBtn.addEventListener('click', () => {
    initGame();
    beginGame();
  });

  pauseBtn.addEventListener('click', () => {
    if (!running) return;
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    statusEl.textContent = paused ? 'Game paused.' : 'Back in action!';
    if (!paused) startLoop();
  });

  restartBtn.addEventListener('click', () => {
    initGame();
    beginGame();
  });
})();
