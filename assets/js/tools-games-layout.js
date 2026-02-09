(() => {
  const path = window.location.pathname;
  const isTools = path.includes('/tools/');
  const isGames = path.includes('/games/');
  if (!isTools && !isGames) return;

  const scope = isTools ? 'tools' : 'games';
  const rootPrefix = path.slice(0, path.indexOf(`/${scope}/`)) || '';
  const rootUrl = `${window.location.origin}${rootPrefix}`;

  const ensureCss = () => {
    const href = `${rootUrl}/assets/css/tools-games-layout.css`;
    if ([...document.styleSheets].some((sheet) => sheet.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
  };

  const replaceTokens = (html) => html.replaceAll('{{ROOT}}', rootPrefix || '');

  const fetchFragment = async (name) => {
    const res = await fetch(`${rootUrl}/assets/includes/${name}`);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    return replaceTokens(await res.text());
  };

  const mount = async () => {
    ensureCss();

    document.querySelectorAll('header.page-header, footer.page-footer').forEach((node) => node.remove());

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

    const activeLink = document.querySelector(`[data-tg-link="${scope}"]`);
    if (activeLink) activeLink.setAttribute('data-active', 'true');

    const year = document.querySelector('[data-tg-year]');
    if (year) year.textContent = new Date().getFullYear();
  };

  mount().catch((error) => console.error(error));
})();
