// ==========================================================================
// SMART NAVBAR — auto-hide header + scroll progress, mobile & desktop
// ==========================================================================
// Behavior: hide on scroll-down, reveal on scroll-up / scroll-stop / top.
// Mobile hides too (needs screen space) with gentler thresholds.
// Includes a thin gradient scroll-progress hairline inside the navbar.
// ==========================================================================

(function initSmartNavbar() {
  'use strict';

  // Prevent double-init if loaded by multiple scripts
  if (window.__smartNavbarInitialized) return;
  window.__smartNavbarInitialized = true;

  // --- CONFIG ---
  const DOWN_DESKTOP = 12;   // px down-scroll to hide (desktop)
  const UP_DESKTOP   = 8;    // px up-scroll to show (desktop)
  const DOWN_MOBILE  = 26;   // px down-scroll to hide (mobile, gentler)
  const UP_MOBILE    = 6;    // px up-scroll to show (mobile)
  const TOP_SAFE     = 80;   // always show within this px from top
  const MOBILE_START = 220;  // mobile hides only after scrolling this far
  const STOP_DELAY   = 160;  // ms after last scroll event to re-show
  const COMPACT_AT   = 50;   // px to add the compact "scrolled" class
  const MOBILE_BP    = 992;  // px breakpoint

  // --- STATE ---
  let lastScrollY     = 0;
  let scrollStopTimer = null;
  let ticking         = false;
  let isHidden        = false;
  let progressBar     = null;

  const attach = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const navMenu = document.getElementById('nav-menu');

    // Inject scroll-progress hairline once
    if (!navbar.querySelector('.nav-progress')) {
      progressBar = document.createElement('div');
      progressBar.className = 'nav-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      progressBar.innerHTML = '<span></span>';
      navbar.appendChild(progressBar);
    } else {
      progressBar = navbar.querySelector('.nav-progress');
    }
    const progressFill = progressBar ? progressBar.firstElementChild : null;

    const updateProgress = () => {
      if (!progressFill) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progressFill.style.width = pct.toFixed(1) + '%';
    };

    const handleScroll = () => {
      // Never hide while the mobile menu is open
      if (navMenu && navMenu.classList.contains('active')) {
        show();
        updateProgress();
        return;
      }

      const currentY = window.scrollY;
      if (currentY === lastScrollY) {
        updateProgress();
        return;
      }

      const isMobile = window.innerWidth < MOBILE_BP;
      const downT = isMobile ? DOWN_MOBILE : DOWN_DESKTOP;
      const upT = isMobile ? UP_MOBILE : UP_DESKTOP;

      toggleCompact(currentY > COMPACT_AT);

      // Re-show shortly after scrolling stops (feels alive, never lost)
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(show, STOP_DELAY);

      const delta = currentY - lastScrollY;

      if (currentY <= TOP_SAFE) {
        show();
      } else if (delta > downT) {
        // Don't hide on mobile until the user is really into the page
        if (!isMobile || currentY > MOBILE_START) hide();
      } else if (delta < -upT) {
        show();
      }

      lastScrollY = Math.max(0, currentY);
      updateProgress();
    };

    function show() {
      if (!isHidden) return;
      isHidden = false;
      navbar.classList.remove('hidden');
    }

    function hide() {
      if (isHidden) return;
      isHidden = true;
      navbar.classList.add('hidden');
    }

    function toggleCompact(on) {
      navbar.classList.toggle('scrolled', on);
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial state
    lastScrollY = Math.max(0, window.scrollY);
    handleScroll();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // Manual re-attach for dynamically injected navbars
  window.__smartNavbarAttach = () => {
    window.__smartNavbarInitialized = false;
    ticking = false;
    isHidden = false;
    lastScrollY = 0;
    if (scrollStopTimer) clearTimeout(scrollStopTimer);
    initSmartNavbar();
  };
})();
