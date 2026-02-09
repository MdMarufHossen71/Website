(function () {
  const path = window.location.pathname.toLowerCase();
  const isToolsOrGames = path.includes('/tools/') || path.includes('/games/');

  const fallbackMainHeader = `
    <header class="site-header"><nav class="navbar" id="navbar"><div class="nav-container">
      <a href="/index.html#home" class="nav-logo"><span class="logo-text-wrap"><span class="logo-text">Maruf</span><span class="logo-dot">.</span></span><span class="logo-subtitle">Digital Marketer</span></a>
      <div class="nav-menu" id="nav-menu"><ul class="nav-list">
        <li><a href="/index.html#home" class="nav-link" data-nav="home">Home</a></li>
        <li><a href="/index.html#about" class="nav-link" data-nav="about">About</a></li>
        <li><a href="/index.html#services" class="nav-link" data-nav="services">Services</a></li>
        <li><a href="/index.html#portfolio" class="nav-link" data-nav="portfolio">Portfolio</a></li>
        <li><a href="/index.html#contact" class="nav-link" data-nav="contact">Contact</a></li>
        <li><a href="/blog/" class="nav-link" data-nav="blog">Blog</a></li>
        <li><a href="/tools/" class="nav-link" data-nav="tools-games">Tools &amp; Games</a></li>
      </ul></div>
      <div class="nav-actions"><button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button></div>
    </div></nav></header>`;

  const fallbackMainFooter = `
    <footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; <span id="main-year"></span> Md Maruf Hossen. All rights reserved.</p></div></div></footer>`;

  const fallbackAppsHeader = `
    <header class="page-header site-header"><div class="site-shell topbar">
      <a href="/index.html" class="brand">Maruf<span>.</span></a>
      <nav aria-label="Primary navigation" class="shared-nav">
        <a href="/index.html" data-nav="home">Home</a><a href="/blog/" data-nav="blog">Blog</a><a href="/tools/" data-nav="tools">Tools</a><a href="/games/" data-nav="games">Games</a>
      </nav><button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    </div></header>`;

  const fallbackAppsFooter = `
    <footer class="page-footer shared-footer"><div class="site-shell footer-inner">
      <p>© <span id="shared-year"></span> Md Maruf Hossen. All rights reserved.</p>
      <nav aria-label="Footer navigation" class="footer-nav"><a href="/about-this-website.html">About</a><a href="/faq.html">FAQ</a><a href="/privacy-policy.html">Privacy Policy</a><a href="/terms-and-conditions.html">Terms &amp; Conditions</a></nav>
    </div></footer>`;

  const headerUrl = isToolsOrGames ? '/components/header-tools-games.html' : '/components/header-main.html';
  const footerUrl = isToolsOrGames ? '/components/footer-tools-games.html' : '/components/footer-main.html';
  const fallbackHeader = isToolsOrGames ? fallbackAppsHeader : fallbackMainHeader;
  const fallbackFooter = isToolsOrGames ? fallbackAppsFooter : fallbackMainFooter;

  const styleId = 'shared-include-style';
  if (isToolsOrGames && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `.site-shell{max-width:1100px;margin:auto;padding:0 1rem}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:64px}.page-header{position:sticky;top:0;z-index:1000;background:#0f172a;border-bottom:1px solid #1f2d4a}.brand{font-weight:800;letter-spacing:.3px;color:#fff;text-decoration:none}.brand span{color:#60a5fa}.shared-nav{display:flex;gap:.85rem;flex-wrap:wrap}.shared-nav a,.footer-nav a{color:#cbd5e1;text-decoration:none;font-weight:500}.shared-nav a.active{color:#fff;border-bottom:2px solid #60a5fa}.shared-footer{margin-top:2rem;padding:1.25rem 0;background:#0b1220;border-top:1px solid #1f2d4a;color:#94a3b8}.footer-inner{display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap}.footer-nav{display:flex;gap:.85rem;flex-wrap:wrap}.page-header .nav-toggle{display:none;background:transparent;border:1px solid #334155;color:#fff;padding:.3rem .55rem;border-radius:8px}@media(max-width:700px){.page-header .nav-toggle{display:block}.shared-nav{display:none;width:100%;padding-bottom:.75rem}.page-header.menu-open .shared-nav{display:flex;flex-direction:column}}`;
    document.head.appendChild(style);
  }

  const fetchAndSet = async (id, url, fallback) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.innerHTML.trim()) el.innerHTML = fallback;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed include');
      el.innerHTML = await res.text();
    } catch (_) {
      // Keep fallback markup
    }
  };

  const markActiveNav = () => {
    if (isToolsOrGames) {
      const links = document.querySelectorAll('.shared-nav a[data-nav]');
      links.forEach((link) => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      const key = path.includes('/tools/') ? 'tools' : 'games';
      const active = document.querySelector(`.shared-nav a[data-nav="${key}"]`);
      if (active) {
        active.classList.add('active');
        active.setAttribute('aria-current', 'page');
      }
      return;
    }

    const mainLinks = document.querySelectorAll('.nav-link[data-nav]');
    mainLinks.forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    let key = 'home';
    if (path.includes('/blog/')) key = 'blog';
    if (path.includes('/tools/') || path.includes('/games/')) key = 'tools-games';
    const active = document.querySelector(`.nav-link[data-nav="${key}"]`);
    if (active) {
      active.classList.add('active');
      active.setAttribute('aria-current', 'page');
    }
  };

  const wireMenu = () => {
    if (isToolsOrGames) {
      const header = document.querySelector('.page-header');
      const toggle = header && header.querySelector('.nav-toggle');
      if (!header || !toggle) return;
      toggle.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      return;
    }

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
      });
    }
  };

  Promise.all([
    fetchAndSet('header', headerUrl, fallbackHeader),
    fetchAndSet('footer', footerUrl, fallbackFooter)
  ]).finally(() => {
    markActiveNav();
    wireMenu();
    const sharedYear = document.getElementById('shared-year');
    if (sharedYear) sharedYear.textContent = new Date().getFullYear();
    const mainYear = document.getElementById('main-year');
    if (mainYear) mainYear.textContent = new Date().getFullYear();
  });
})();
