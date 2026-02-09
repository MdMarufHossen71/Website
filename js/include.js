(function () {
  const fallbackHeader = `
    <header class="page-header site-header"><div class="site-shell topbar">
      <a href="/index.html" class="brand">Maruf<span>.</span></a>
      <nav aria-label="Primary navigation" class="shared-nav">
        <a href="/index.html" data-nav="home">Home</a>
        <a href="/blog/" data-nav="blog">Blog</a>
        <a href="/tools/" data-nav="tools">Tools</a>
        <a href="/games/" data-nav="games">Games</a>
      </nav>
      <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    </div></header>`;

  const fallbackFooter = `
    <footer class="page-footer shared-footer"><div class="site-shell footer-inner">
      <p>© <span id="shared-year"></span> Md Maruf Hossen. All rights reserved.</p>
      <nav aria-label="Footer navigation" class="footer-nav">
        <a href="/about-this-website.html">About</a>
        <a href="/faq.html">FAQ</a>
        <a href="/privacy-policy.html">Privacy Policy</a>
        <a href="/terms-and-conditions.html">Terms &amp; Conditions</a>
      </nav>
    </div></footer>`;

  const styleId = 'shared-include-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `.site-shell{max-width:1100px;margin:auto;padding:0 1rem}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;min-height:64px}.page-header{position:sticky;top:0;z-index:1000;background:#0f172a;border-bottom:1px solid #1f2d4a}.brand{font-weight:800;letter-spacing:.3px;color:#fff;text-decoration:none}.brand span{color:#60a5fa}.shared-nav{display:flex;gap:.85rem;flex-wrap:wrap}.shared-nav a,.footer-nav a{color:#cbd5e1;text-decoration:none;font-weight:500}.shared-nav a.active{color:#fff;border-bottom:2px solid #60a5fa}.shared-footer{margin-top:2rem;padding:1.25rem 0;background:#0b1220;border-top:1px solid #1f2d4a;color:#94a3b8}.footer-inner{display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap}.footer-nav{display:flex;gap:.85rem;flex-wrap:wrap}.nav-toggle{display:none;background:transparent;border:1px solid #334155;color:#fff;padding:.3rem .55rem;border-radius:8px}@media(max-width:700px){.nav-toggle{display:block}.shared-nav{display:none;width:100%;padding-bottom:.75rem}.page-header.menu-open .shared-nav{display:flex;flex-direction:column}}`;
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
      // keep fallback for static crawlability
    }
  };

  const normalizePath = (path) => (path.endsWith('/') ? path : `${path}/`);

  const markActiveNav = () => {
    const path = normalizePath(window.location.pathname.toLowerCase());
    const links = document.querySelectorAll('.shared-nav a[data-nav]');
    links.forEach((link) => link.classList.remove('active'));
    let key = 'home';
    if (path.includes('/tools/')) key = 'tools';
    else if (path.includes('/games/')) key = 'games';
    else if (path.includes('/blog/')) key = 'blog';
    const active = document.querySelector(`.shared-nav a[data-nav="${key}"]`);
    if (active) {
      active.classList.add('active');
      active.setAttribute('aria-current', 'page');
    }
  };

  const wireMenu = () => {
    const header = document.querySelector('.page-header');
    const toggle = header && header.querySelector('.nav-toggle');
    if (!header || !toggle) return;
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  };

  Promise.all([
    fetchAndSet('header', '/components/header.html', fallbackHeader),
    fetchAndSet('footer', '/components/footer.html', fallbackFooter)
  ]).finally(() => {
    markActiveNav();
    wireMenu();
    const year = document.getElementById('shared-year');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
