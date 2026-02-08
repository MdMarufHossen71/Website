(function () {
  'use strict';

  const textarea = document.querySelector('[data-text-input]');
  if (!textarea) return;

  const output = {
    chars: document.querySelector('[data-count-chars]'),
    charsNoSpaces: document.querySelector('[data-count-chars-no-space]'),
    words: document.querySelector('[data-count-words]'),
    lines: document.querySelector('[data-count-lines]'),
    readTime: document.querySelector('[data-count-read-time]')
  };

  const updateStats = () => {
    const value = textarea.value;
    const words = (value.trim().match(/\S+/g) || []).length;
    const lines = value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length;
    const chars = value.length;
    const charsNoSpaces = value.replace(/\s/g, '').length;
    const readTime = words === 0 ? 0 : Math.max(1, Math.round(words / 200));

    output.chars.textContent = String(chars);
    output.charsNoSpaces.textContent = String(charsNoSpaces);
    output.words.textContent = String(words);
    output.lines.textContent = String(lines);
    output.readTime.textContent = `${readTime} min`;
  };

  textarea.addEventListener('input', updateStats, { passive: true });
  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    textarea.value = '';
    textarea.focus();
    updateStats();
  });

  updateStats();
})();
