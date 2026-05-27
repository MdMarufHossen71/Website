(() => {
  const path = window.location.pathname;
  const isTools = path.includes('/tools/');
  const isGames = path.includes('/games/');
  if (!isTools && !isGames) return;

  const scope = isTools ? 'tools' : 'games';
  const rootPrefix = path.slice(0, path.indexOf(`/${scope}/`)) || '';
  const rootUrl = `${window.location.origin}${rootPrefix}`;

  const ensureCss = () => {
    const layoutHref = `${rootUrl}/assets/css/tools-games-layout.css`;
    
    // Layout helpers (includes premium capsule navbar styles)
    if (![...document.styleSheets].some((sheet) => sheet.href === layoutHref)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = layoutHref;
      document.head.append(link);
    }
  };

  const replaceTokens = (html) => html.replaceAll('{{ROOT}}', rootPrefix || '');

  const fetchFragment = async (name) => {
    const res = await fetch(`${rootUrl}/assets/includes/${name}`);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    return replaceTokens(await res.text());
  };

  const mount = async () => {
    ensureCss();

    // Clean up any static hardcoded headers/footers in tools subpages
    document.querySelectorAll('header.page-header, footer.page-footer, header.tg-header').forEach((node) => node.remove());

    let headerMount = document.querySelector('[data-tools-games-header]');
    if (!headerMount) {
      headerMount = document.createElement('div');
      headerMount.setAttribute('data-tools-games-header', '');
      document.body.prepend(headerMount);
    }

    let footerMount = document.querySelector('[data-tools-games-footer]');
    if (!footerMount) {
      footerMount = document.createElement('div');
      footerMount.setAttribute('data-tools-games-footer', '');
      document.body.appendChild(footerMount);
    }

    const [headerHtml, footerHtml] = await Promise.all([
      fetchFragment('tools-games-header.html'),
      fetchFragment('tools-games-footer.html')
    ]);

    headerMount.innerHTML = headerHtml;
    footerMount.innerHTML = footerHtml;

    // Navigation and capsule triggers
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');

    // Make target subpage links active
    const activeLink = document.querySelector(`[data-tg-link="${scope}"]`);
    if (activeLink) activeLink.classList.add('active');

    const year = document.querySelector('[data-tg-year]');
    if (year) year.textContent = new Date().getFullYear();

    // 1. Premium Smart Auto-Hide capsule header logic
    let lastScrollTop = 0;
    let scrollStopTimeout = null;
    let ticking = false;

    if (navbar) {
      const handleLayoutScroll = () => {
        const isMobileMenuOpen = navMenu && navMenu.classList.contains('active');
        if (isMobileMenuOpen) {
          navbar.classList.remove('hidden');
          return;
        }

        const currentScrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        // Prevent executing scroll logic if scroll position hasn't changed
        if (currentScrollTop === lastScrollTop) return;

        // Mobile specific behavior: keep header fixed at the top, never hide
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
          navbar.classList.remove('hidden');
          if (currentScrollTop > 30) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
          return;
        }

        // Capsule sizing shift
        if (currentScrollTop > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Clear any active stop timeouts
        if (scrollStopTimeout) {
          clearTimeout(scrollStopTimeout);
        }

        // If scrolling stops, show the navbar again
        scrollStopTimeout = setTimeout(() => {
          navbar.classList.remove('hidden');
        }, 150);

        // Smart Auto-Hide with direction thresholds
        const diff = currentScrollTop - lastScrollTop;
        if (currentScrollTop <= 80) {
          navbar.classList.remove('hidden');
        } else if (diff > 15) {
          navbar.classList.add('hidden'); // Scroll down past threshold -> hide
        } else if (diff < -10) {
          navbar.classList.remove('hidden'); // Scroll up past threshold -> show immediately
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
      };

      const onLayoutScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleLayoutScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onLayoutScroll, { passive: true });
      window.addEventListener('resize', handleLayoutScroll);
    }

    // 2. Mobile navbar hamburger toggling overlays
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', isOpen);
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        
        if (isOpen) {
          document.body.style.overflow = 'hidden';
          navbar?.classList.remove('hidden');
          navbar?.classList.add('visible');
        } else {
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          navToggle.focus();
        }
      });
    }

    // 3. Dropdown click interactions
    if (navDropdownToggle) {
      navDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = navDropdownToggle.closest('.nav-dropdown');
        const isOpen = parent?.classList.toggle('open');
        navDropdownToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
      });

      document.addEventListener('click', () => {
        const parent = navDropdownToggle.closest('.nav-dropdown');
        if (parent) {
          parent.classList.remove('open');
          navDropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 4. Global theme switches sync
    const syncThemeUI = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
    };

    const savedTheme = localStorage.getItem('portfolio-theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    syncThemeUI(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const curr = document.documentElement.getAttribute('data-theme') || 'light';
        const next = curr === 'dark' ? 'light' : 'dark';
        syncThemeUI(next);
      });
    }
  };

  // Sync theme immediately on script load to prevent visual flashing
  const savedTheme = localStorage.getItem('portfolio-theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  mount().catch((error) => console.error(error));
})();
