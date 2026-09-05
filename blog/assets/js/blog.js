// Blog search + category filter (no backend, fully client-side).
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('blog-search');
  const tabs = document.querySelectorAll('.category-tab');
  const cards = document.querySelectorAll('.blog-grid .blog-card');
  const telemetry = document.getElementById('search-telemetry');
  if (!input || cards.length === 0) return;

  let activeCategory = 'all';

  const CATEGORY_KEYWORDS = {
    'digital-marketing': ['seo', 'marketing', 'social', 'lead', 'email', 'content calendar', 'b2b', 'election', 'ramadan'],
    'graphic-design': ['design', 'logo', 'color', 'brand', 'typography', 'poster', 'creative'],
    'freelancing': ['freelance', 'client', 'portfolio', 'fiverr', 'testimonial', 'journey', 'career']
  };

  function cardMatchesCategory(card, cat) {
    if (cat === 'all') return true;
    const text = (card.textContent || '').toLowerCase();
    const keywords = CATEGORY_KEYWORDS[cat] || [];
    return keywords.some(k => text.includes(k));
  }

  function applyFilters() {
    const q = (input.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const text = (card.textContent || '').toLowerCase();
      const okSearch = !q || text.includes(q);
      const okCat = cardMatchesCategory(card, activeCategory);
      const show = okSearch && okCat;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (telemetry) {
      if (!q && activeCategory === 'all') telemetry.textContent = `Showing all ${cards.length} articles`;
      else telemetry.textContent = `Showing ${visible} of ${cards.length} articles`;
    }
  }

  let t = null;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(applyFilters, 150);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  applyFilters();
});
