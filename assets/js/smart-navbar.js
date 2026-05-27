// ==========================================================================
// SMART NAVBAR — Global reusable auto-hide header module
// ==========================================================================
// Usage: Include this script on any page. It auto-detects and attaches to
// the element with id="navbar". No configuration needed.
//
// Desktop: hide on scroll-down, show on scroll-up or scroll-stop
// Mobile (<992px): always visible, never hides, gets compact style on scroll
// ==========================================================================

(function initSmartNavbar() {
  'use strict';

  // Prevent double-init if loaded by multiple scripts
  if (window.__smartNavbarInitialized) return;
  window.__smartNavbarInitialized = true;

  // --- CONFIG ---
  const SCROLL_DOWN_THRESHOLD = 12;   // px delta to trigger hide
  const SCROLL_UP_THRESHOLD   = 8;    // px delta to trigger show
  const TOP_SAFE_ZONE          = 80;   // always show when within this px from top
  const SCROLL_STOP_DELAY      = 150;  // ms after last scroll event to re-show
  const SCROLLED_CLASS_OFFSET  = 50;   // px to add the compact "scrolled" class
  const MOBILE_BREAKPOINT      = 992;  // px

  // --- STATE ---
  let lastScrollY      = 0;
  let scrollStopTimer  = null;
  let ticking          = false;
  let isHidden         = false;

  // Wait for DOM to be ready, then attach
  const attach = () => {
    const navbar  = document.getElementById('navbar');
    if (!navbar) return;

    const navMenu = document.getElementById('nav-menu');

    // --- CORE SCROLL HANDLER (called inside rAF) ---
    const handleScroll = () => {
      // Never hide when mobile menu is open
      if (navMenu && navMenu.classList.contains('active')) {
        show();
        return;
      }

      const currentY = window.scrollY;

      // Bail if position hasn't actually changed (prevents duplicate work)
      if (currentY === lastScrollY) return;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      // --- MOBILE: never hide, only toggle compact class ---
      if (isMobile) {
        show();
        toggleCompact(currentY > 30);
        lastScrollY = Math.max(0, currentY);
        return;
      }

      // --- DESKTOP ---
      toggleCompact(currentY > SCROLLED_CLASS_OFFSET);

      // Reset scroll-stop timer
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => show(), SCROLL_STOP_DELAY);

      // Direction + threshold logic
      const delta = currentY - lastScrollY;

      if (currentY <= TOP_SAFE_ZONE) {
        // Near the very top — always visible
        show();
      } else if (delta > SCROLL_DOWN_THRESHOLD) {
        // Scrolling DOWN past threshold → hide
        hide();
      } else if (delta < -SCROLL_UP_THRESHOLD) {
        // Scrolling UP past threshold → show immediately
        show();
      }

      lastScrollY = Math.max(0, currentY);
    };

    // --- HELPERS ---
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
      if (on) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // --- OPTIMIZED SCROLL LISTENER (rAF throttled, passive) ---
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
    window.addEventListener('resize', () => {
      // Re-evaluate on resize (e.g. switching from mobile to desktop)
      handleScroll();
    });

    // Initial evaluation
    handleScroll();
  };

  // Attach immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // Also expose a manual re-attach for dynamically injected navbars
  // (used by tools-games-layout.js which injects the navbar async)
  window.__smartNavbarAttach = () => {
    // Reset state so it re-binds to the newly injected navbar
    window.__smartNavbarInitialized = false;
    ticking = false;
    isHidden = false;
    lastScrollY = 0;
    if (scrollStopTimer) clearTimeout(scrollStopTimer);
    initSmartNavbar();
  };
})();
