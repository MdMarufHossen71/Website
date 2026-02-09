(function () {
  'use strict';

  const tool = document.querySelector('[data-tool]')?.dataset.tool;

  function initTextCounter() {
    const input = document.querySelector('[data-text-input]');
    if (!input) return;
    const chars = document.querySelector('[data-count-chars]');
    const charsNoSpace = document.querySelector('[data-count-chars-no-space]');
    const words = document.querySelector('[data-count-words]');
    const lines = document.querySelector('[data-count-lines]');
    const readTime = document.querySelector('[data-count-read-time]');
    const resetButton = document.querySelector('[data-reset]');

    const update = () => {
      const text = input.value;
      const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      const linesCount = text ? text.split(/\n/).length : 0;
      const readingMinutes = wordsCount / 200;
      chars.textContent = String(text.length);
      charsNoSpace.textContent = String(text.replace(/\s/g, '').length);
      words.textContent = String(wordsCount);
      lines.textContent = String(linesCount);
      readTime.textContent = `${Math.max(0, Math.ceil(readingMinutes))} min`;
    };

    input.addEventListener('input', update);
    resetButton?.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
    update();
  }

  function initCalculator() {
    const display = document.querySelector('[data-calc-display]');
    const keypad = document.querySelector('[data-keypad]');
    if (!display || !keypad) return;
    let expr = '0';

    const refresh = () => { display.value = expr; };
    const evaluate = () => {
      try {
        const safe = expr.replace(/[^\d+\-*/().]/g, '');
        const value = Function(`"use strict";return (${safe})`)();
        expr = Number.isFinite(value) ? String(value) : '0';
      } catch (_e) { expr = 'Error'; }
      refresh();
    };
    const push = (key) => {
      if (key === 'C') { expr = '0'; refresh(); return; }
      if (key === '=') { evaluate(); return; }
      if (expr === 'Error') expr = '0';
      expr = expr === '0' && /[\d.]/.test(key) ? key : expr + key;
      refresh();
    };

    keypad.addEventListener('click', (e) => {
      const key = e.target.closest('[data-key]')?.dataset.key;
      if (key) push(key);
    });

    window.addEventListener('keydown', (e) => {
      if (!/^[\d.+\-*/()]$/.test(e.key) && !['Enter', 'Backspace', 'Escape'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Enter') push('=');
      else if (e.key === 'Escape') push('C');
      else if (e.key === 'Backspace') { expr = expr.length > 1 ? expr.slice(0, -1) : '0'; refresh(); }
      else push(e.key);
    });
    refresh();
  }

  function initConverter() {
    const type = document.querySelector('[data-convert-type]');
    const from = document.querySelector('[data-convert-from]');
    const to = document.querySelector('[data-convert-to]');
    const input = document.querySelector('[data-convert-input]');
    const output = document.querySelector('[data-convert-output]');
    if (!type || !from || !to || !input || !output) return;

    const defs = {
      length: { m: 1, km: 1000, mi: 1609.344, ft: 0.3048 },
      weight: { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.0283495 },
      speed: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704 }
    };

    const syncUnits = () => {
      const units = Object.keys(defs[type.value]);
      from.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join('');
      to.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join('');
      to.selectedIndex = units.length > 1 ? 1 : 0;
      convert();
    };

    const convert = () => {
      const num = Number(input.value);
      if (!Number.isFinite(num)) { output.textContent = 'Invalid input'; return; }
      const map = defs[type.value];
      const base = num * map[from.value];
      const result = base / map[to.value];
      output.textContent = `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to.value}`;
    };

    type.addEventListener('change', syncUnits);
    [from, to, input].forEach((el) => el.addEventListener('input', convert));
    syncUnits();
  }

  function initColorPicker() {
    const colorInput = document.querySelector('[data-color-input]');
    if (!colorInput) return;
    const preview = document.querySelector('[data-color-preview]');
    const hexField = document.querySelector('[data-color-hex]');
    const rgbField = document.querySelector('[data-color-rgb]');
    const contrastText = document.querySelector('[data-color-contrast]');

    const hexToRgb = (hex) => {
      const val = hex.replace('#', '');
      return [parseInt(val.slice(0, 2), 16), parseInt(val.slice(2, 4), 16), parseInt(val.slice(4, 6), 16)];
    };
    const luminance = ([r, g, b]) => {
      const a = [r, g, b].map((v) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    const contrast = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const render = () => {
      const hex = colorInput.value.toUpperCase();
      const rgb = hexToRgb(hex);
      const rgbString = `rgb(${rgb.join(', ')})`;
      const l = luminance(rgb);
      const black = contrast(l, 0).toFixed(2);
      const white = contrast(l, 1).toFixed(2);
      preview.style.background = hex;
      hexField.value = hex;
      rgbField.value = rgbString;
      contrastText.textContent = `Contrast ratio: black ${black}:1, white ${white}:1. Use ratio 4.5+:1 for normal text.`;
    };

    document.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
      const text = btn.dataset.copy === 'hex' ? hexField.value : rgbField.value;
      try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = btn.dataset.copy === 'hex' ? 'Copy HEX' : 'Copy RGB'; }, 1200); } catch (_e) {}
    }));

    colorInput.addEventListener('input', render);
    render();
  }

  function initImageCompressor() {
    const input = document.querySelector('[data-image-input]');
    if (!input) return;
    const quality = document.querySelector('[data-image-quality]');
    const qualityLabel = document.querySelector('[data-quality-label]');
    const compressBtn = document.querySelector('[data-compress]');
    const result = document.querySelector('[data-image-result]');
    const download = document.querySelector('[data-image-download]');

    quality.addEventListener('input', () => { qualityLabel.textContent = quality.value; });

    compressBtn.addEventListener('click', () => {
      const file = input.files?.[0];
      if (!file) { result.textContent = 'Please choose an image file first.'; return; }
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          const maxW = 1920;
          const scale = Math.min(1, maxW / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) { result.textContent = 'Compression failed.'; return; }
            const oldKb = (file.size / 1024).toFixed(1);
            const newKb = (blob.size / 1024).toFixed(1);
            const reduction = (((file.size - blob.size) / file.size) * 100).toFixed(1);
            result.textContent = `Original ${oldKb} KB → Compressed ${newKb} KB (${reduction}% smaller).`;
            download.href = URL.createObjectURL(blob);
            download.download = `${file.name.replace(/\.[^.]+$/, '')}-compressed.jpg`;
            download.hidden = false;
          }, 'image/jpeg', Number(quality.value) / 100);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (tool === 'text-counter') initTextCounter();
  if (tool === 'calculator') initCalculator();
  if (tool === 'converter') initConverter();
  if (tool === 'color') initColorPicker();
  if (tool === 'compressor') initImageCompressor();
})();
