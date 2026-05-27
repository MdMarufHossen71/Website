// ==========================================================================
// IMPLEMENTATIONS FOR ALL 30 DEV TOOLS
// ==========================================================================

// Global registry of all tools
window.DEV_TOOLS_LIST = [];

// Helper utility: Create clean layout elements
const UI = {
    // Monospace code editor area
    createTextarea: (id, placeholder = 'Paste or type code here...', value = '') => `
        <textarea id="${id}" placeholder="${placeholder}" class="w-full flex-grow min-h-[220px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-4 font-mono text-xs outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none">${value}</textarea>
    `,
    
    // Quick action buttons panel
    createActionRow: (resetId, copyId = null, extraHtml = '') => `
        <div class="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-darkborder">
            <button id="${resetId}" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"><i class="fas fa-trash-can"></i> Reset</button>
            <div class="flex items-center gap-2">
                ${extraHtml}
                ${copyId ? `<button id="${copyId}" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"><i class="fas fa-copy"></i> Copy Output</button>` : ''}
            </div>
        </div>
    `,

    // Select dropdown helper
    createSelect: (id, label, optionsObj) => `
        <div class="flex flex-col gap-1.5 w-full">
            <label for="${id}" class="text-xs font-bold text-slate-400 uppercase tracking-widest">${label}</label>
            <select id="${id}" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
                ${Object.entries(optionsObj).map(([val, name]) => `<option value="${val}">${name}</option>`).join('')}
            </select>
        </div>
    `,

    // Checkbox helper
    createCheckbox: (id, label, checked = false) => `
        <label for="${id}" class="flex items-center gap-2.5 cursor-pointer select-none text-sm font-semibold text-slate-600 dark:text-slate-300">
            <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} class="w-4.5 h-4.5 rounded border-slate-200 dark:border-darkborder accent-primary-500">
            <span>${label}</span>
        </label>
    `,

    // Slider helper
    createSlider: (id, label, min, max, val, suffix = '') => `
        <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <label for="${id}">${label}</label>
                <span id="${id}-lbl" class="text-primary-500 font-mono">${val}${suffix}</span>
            </div>
            <input type="range" id="${id}" min="${min}" max="${max}" value="${val}" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500">
        </div>
    `
};

// --------------------------------------------------------------------------
// 1. JSON FORMATTER & VALIDATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Beautify, minify, and validate JSON data instantly with dynamic line diagnostics.',
    icon: 'fas fa-code',
    category: 'utilities',
    tags: ['json', 'formatter', 'beautify', 'minify', 'validate', 'syntax'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4 items-center">
                    ${UI.createSelect('json-indent', 'Indentation', { '2': '2 Spaces', '4': '4 Spaces', 'tab': '1 Tab', 'minify': 'Minified' })}
                </div>
                ${UI.createTextarea('json-input')}
                ${UI.createActionRow('json-reset', null, `
                    <button id="json-sample" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Load Sample</button>
                    <button id="json-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Format & Validate</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div id="json-diag" class="hidden rounded-xl p-3 border text-xs font-semibold"></div>
                ${UI.createTextarea('json-output', 'Formatted JSON result...')}
                ${UI.createActionRow('json-reset-output', 'json-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#json-input');
        const output = oc.querySelector('#json-output');
        const indentSelect = ic.querySelector('#json-indent');
        const diag = oc.querySelector('#json-diag');

        const sample = { name: "Maruf Tools", active: true, count: 30, tags: ["dev", "seo", "image"], meta: { rating: 5 } };

        ic.querySelector('#json-sample').addEventListener('click', () => {
            input.value = JSON.stringify(sample, null, 2);
            runFormatter();
        });

        const runFormatter = () => {
            const raw = input.value.trim();
            if (!raw) {
                output.value = '';
                diag.className = 'hidden';
                return;
            }

            try {
                const parsed = JSON.parse(raw);
                const indent = indentSelect.value;
                let formatted = '';

                if (indent === 'minify') {
                    formatted = JSON.stringify(parsed);
                } else if (indent === 'tab') {
                    formatted = JSON.stringify(parsed, null, '\t');
                } else {
                    formatted = JSON.stringify(parsed, null, parseInt(indent));
                }

                output.value = formatted;
                diag.className = 'rounded-xl p-3 border text-xs font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                diag.innerHTML = '<i class="fas fa-check-circle"></i> JSON is valid!';
            } catch (err) {
                output.value = '';
                diag.className = 'rounded-xl p-3 border text-xs font-semibold bg-rose-500/10 text-rose-500 border-rose-500/20';
                diag.innerHTML = `<i class="fas fa-times-circle"></i> Invalid JSON: ${err.message}`;
            }
        };

        ic.querySelector('#json-run').addEventListener('click', runFormatter);
        indentSelect.addEventListener('change', runFormatter);

        // Copy
        oc.querySelector('#json-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('JSON copied to clipboard!');
        });

        // Reset
        const reset = () => { input.value = ''; output.value = ''; diag.className = 'hidden'; };
        ic.querySelector('#json-reset').addEventListener('click', reset);
        oc.querySelector('#json-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 2. JWT DECODER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode payload claims and header signatures of JSON Web Tokens instantly.',
    icon: 'fas fa-fingerprint',
    category: 'utilities',
    tags: ['jwt', 'token', 'decode', 'hash', 'security', 'auth'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">JWT Token</span>
                ${UI.createTextarea('jwt-input', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')}
                ${UI.createActionRow('jwt-reset', null, `
                    <button id="jwt-sample" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Load Sample</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full">
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Header (Algorithm & Type)</span>
                    <pre id="jwt-header-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-[11px] font-mono overflow-x-auto min-h-[60px] text-purple-500"></pre>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payload (Claims & Data)</span>
                    <pre id="jwt-payload-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-[11px] font-mono overflow-x-auto min-h-[140px] text-blue-500"></pre>
                </div>
                <div id="jwt-expiry-banner" class="hidden rounded-xl p-3 border text-xs font-semibold"></div>
                ${UI.createActionRow('jwt-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#jwt-input');
        const headerOut = oc.querySelector('#jwt-header-out');
        const payloadOut = oc.querySelector('#jwt-payload-out');
        const expiryBanner = oc.querySelector('#jwt-expiry-banner');

        const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1kIE1hcnVmIEhvc3NlbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTg5MzQ1NjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        ic.querySelector('#jwt-sample').addEventListener('click', () => {
            input.value = sampleToken;
            decode();
        });

        const decode = () => {
            const raw = input.value.trim();
            if (!raw) {
                headerOut.textContent = '';
                payloadOut.textContent = '';
                expiryBanner.className = 'hidden';
                return;
            }

            const parts = raw.split('.');
            if (parts.length < 2) {
                headerOut.textContent = 'Invalid JWT structure. Tokens must contain at least 2 dots.';
                payloadOut.textContent = '';
                expiryBanner.className = 'hidden';
                return;
            }

            try {
                // Base64Url decode helper
                const base64UrlDecode = (str) => {
                    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                    while (base64.length % 4) base64 += '=';
                    return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                };

                const header = JSON.parse(base64UrlDecode(parts[0]));
                const payload = JSON.parse(base64UrlDecode(parts[1]));

                headerOut.textContent = JSON.stringify(header, null, 2);
                payloadOut.textContent = JSON.stringify(payload, null, 2);

                if (payload.exp) {
                    const expMs = payload.exp * 1000;
                    const date = new Date(expMs);
                    const isExpired = Date.now() > expMs;

                    if (isExpired) {
                        expiryBanner.className = 'rounded-xl p-3 border text-xs font-semibold bg-rose-500/10 text-rose-500 border-rose-500/20';
                        expiryBanner.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Token expired on: ${date.toLocaleString()}`;
                    } else {
                        expiryBanner.className = 'rounded-xl p-3 border text-xs font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                        expiryBanner.innerHTML = `<i class="fas fa-check-circle"></i> Token active! Expires on: ${date.toLocaleString()}`;
                    }
                } else {
                    expiryBanner.className = 'hidden';
                }

            } catch (err) {
                headerOut.textContent = `Error decoding token components: ${err.message}`;
                payloadOut.textContent = '';
                expiryBanner.className = 'hidden';
            }
        };

        input.addEventListener('input', decode);

        const reset = () => { input.value = ''; headerOut.textContent = ''; payloadOut.textContent = ''; expiryBanner.className = 'hidden'; };
        ic.querySelector('#jwt-reset').addEventListener('click', reset);
        oc.querySelector('#jwt-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 3. BASE64 ENCODE/DECODE
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'base64-converter',
    name: 'Base64 Encode/Decode',
    description: 'Encode textual structures to Base64 logs or decode Base64 strings client-side.',
    icon: 'fas fa-arrow-right-arrow-left',
    category: 'converters',
    tags: ['base64', 'encode', 'decode', 'converter', 'ascii'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4">
                    ${UI.createSelect('base64-mode', 'Operation Mode', { 'encode': 'Encode (Text ➔ Base64)', 'decode': 'Decode (Base64 ➔ Text)' })}
                </div>
                ${UI.createTextarea('base64-input')}
                ${UI.createActionRow('base64-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Results</span>
                ${UI.createTextarea('base64-output', 'Base64 output string...')}
                ${UI.createActionRow('base64-reset-output', 'base64-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#base64-input');
        const output = oc.querySelector('#base64-output');
        const mode = ic.querySelector('#base64-mode');

        const process = () => {
            const val = input.value;
            if (!val) {
                output.value = '';
                return;
            }

            try {
                if (mode.value === 'encode') {
                    output.value = btoa(unescape(encodeURIComponent(val)));
                } else {
                    output.value = decodeURIComponent(escape(atob(val)));
                }
            } catch (err) {
                output.value = `Error in conversion: ${err.message}`;
            }
        };

        input.addEventListener('input', process);
        mode.addEventListener('change', process);

        oc.querySelector('#base64-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Copied base64 output!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#base64-reset').addEventListener('click', reset);
        oc.querySelector('#base64-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 4. URL ENCODER/DECODER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    description: 'Percent-encode characters for web queries or easily decode URL addresses.',
    icon: 'fas fa-link',
    category: 'converters',
    tags: ['url', 'encode', 'decode', 'percent', 'query', 'http'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4">
                    ${UI.createSelect('url-mode', 'Operation Mode', { 'encode': 'Encode URL', 'decode': 'Decode URL' })}
                </div>
                ${UI.createTextarea('url-input', 'Type URL queries here...')}
                ${UI.createActionRow('url-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Results</span>
                ${UI.createTextarea('url-output', 'URL converter results...')}
                ${UI.createActionRow('url-reset-output', 'url-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#url-input');
        const output = oc.querySelector('#url-output');
        const mode = ic.querySelector('#url-mode');

        const convert = () => {
            const raw = input.value;
            if (!raw) {
                output.value = '';
                return;
            }

            try {
                if (mode.value === 'encode') {
                    output.value = encodeURIComponent(raw);
                } else {
                    output.value = decodeURIComponent(raw);
                }
            } catch (err) {
                output.value = `Conversion Error: ${err.message}`;
            }
        };

        input.addEventListener('input', convert);
        mode.addEventListener('change', convert);

        oc.querySelector('#url-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('URL Copied!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#url-reset').addEventListener('click', reset);
        oc.querySelector('#url-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 5. REGEX TESTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Write, debug, and validate Regular Expressions in real-time with highlighted matches.',
    icon: 'fas fa-arrow-right-to-line',
    category: 'text',
    tags: ['regex', 'pattern', 'test', 'match', 'validate', 'replace'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Expression Pattern</label>
                        <input type="text" id="regex-pattern" value="[a-zA-Z]+" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
                    </div>
                    <div class="flex flex-col gap-1.5 w-full justify-end pb-1">
                        <div class="flex flex-wrap gap-4">
                            ${UI.createCheckbox('regex-g', 'Global (g)', true)}
                            ${UI.createCheckbox('regex-i', 'Case-insensitive (i)', true)}
                            ${UI.createCheckbox('regex-m', 'Multiline (m)', false)}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-1.5 w-full">
                    <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Test String</label>
                    ${UI.createTextarea('regex-input', 'Type the string to test against the regular expression here...')}
                </div>
                ${UI.createActionRow('regex-reset', null, `
                    <button id="regex-sample" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Load Sample</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Highlight Matches</span>
                    <div id="regex-highlight-view" class="w-full min-h-[160px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-4 font-mono text-xs overflow-y-auto whitespace-pre-wrap"></div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Matched Elements Info</span>
                    <div id="regex-meta-out" class="p-3 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-darkborder rounded-xl text-xs flex flex-col gap-1">
                        No matches found.
                    </div>
                </div>
                ${UI.createActionRow('regex-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const pattern = ic.querySelector('#regex-pattern');
        const input = ic.querySelector('#regex-input');
        const g = ic.querySelector('#regex-g');
        const i = ic.querySelector('#regex-i');
        const m = ic.querySelector('#regex-m');

        const highlightView = oc.querySelector('#regex-highlight-view');
        const metaOut = oc.querySelector('#regex-meta-out');

        const sampleText = 'Welcome to Maruf DevSuite version 30. All tools are 100% locally active on your computer!';

        ic.querySelector('#regex-sample').addEventListener('click', () => {
            pattern.value = '[a-zA-Z]+';
            input.value = sampleText;
            test();
        });

        const test = () => {
            const patVal = pattern.value.trim();
            const textVal = input.value;

            if (!patVal || !textVal) {
                highlightView.innerHTML = '';
                metaOut.innerHTML = 'No matches found.';
                return;
            }

            try {
                let flags = '';
                if (g.checked) flags += 'g';
                if (i.checked) flags += 'i';
                if (m.checked) flags += 'm';

                const regex = new RegExp(patVal, flags);
                
                // Extract Matches
                let matches = [];
                let match;
                
                if (flags.includes('g')) {
                    while ((match = regex.exec(textVal)) !== null) {
                        matches.push({ text: match[0], index: match.index });
                        if (match.index === regex.lastIndex) regex.lastIndex++; // safety infinite loops
                    }
                } else {
                    match = regex.exec(textVal);
                    if (match) matches.push({ text: match[0], index: match.index });
                }

                // Render highlighting output
                if (matches.length > 0) {
                    let highlighted = '';
                    let lastIdx = 0;
                    
                    // Sort indices
                    matches.sort((a,b) => a.index - b.index);

                    matches.forEach(m => {
                        highlighted += escapeHtml(textVal.substring(lastIdx, m.index));
                        highlighted += `<mark class="bg-yellow-300 text-slate-900 px-0.5 rounded">${escapeHtml(m.text)}</mark>`;
                        lastIdx = m.index + m.text.length;
                    });
                    
                    highlighted += escapeHtml(textVal.substring(lastIdx));
                    highlightedView.innerHTML = highlighted;

                    metaOut.innerHTML = `
                        <div class="flex items-center gap-1 text-emerald-500 font-bold"><i class="fas fa-check-circle"></i> Pattern Valid!</div>
                        <div>Total matches found: <strong>${matches.length}</strong></div>
                    `;
                } else {
                    highlightedView.textContent = textVal;
                    metaOut.innerHTML = `
                        <div class="flex items-center gap-1 text-blue-500 font-semibold"><i class="fas fa-info-circle"></i> Expression is valid, but no matches found.</div>
                    `;
                }

            } catch (err) {
                highlightedView.textContent = textVal;
                metaOut.innerHTML = `
                    <div class="flex items-center gap-1 text-rose-500 font-bold"><i class="fas fa-times-circle"></i> Invalid Regex Pattern:</div>
                    <div class="text-[11px] font-mono text-rose-400">${err.message}</div>
                `;
            }
        };

        const escapeHtml = (text) => {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        pattern.addEventListener('input', test);
        input.addEventListener('input', test);
        g.addEventListener('change', test);
        i.addEventListener('change', test);
        m.addEventListener('change', test);

        const reset = () => {
            pattern.value = '[a-zA-Z]+';
            input.value = '';
            highlightView.innerHTML = '';
            metaOut.innerHTML = 'No matches found.';
        };
        ic.querySelector('#regex-reset').addEventListener('click', reset);
        oc.querySelector('#regex-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 6. MARKDOWN PREVIEWER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    description: 'Render GitHub-flavored markdown scripts client-side into formatted HTML.',
    icon: 'fab fa-markdown',
    category: 'text',
    tags: ['markdown', 'preview', 'md', 'html', 'compiler', 'readme'],
    featured: false,
    libraries: ['marked'],
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Markdown Source</span>
                ${UI.createTextarea('md-input', '# Hello World\\n\\nStart typing here...')}
                ${UI.createActionRow('md-reset', null, `
                    <button id="md-sample" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Load Sample</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Live HTML Preview</span>
                <div id="md-output-preview" class="w-full min-h-[220px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-6 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed"></div>
                ${UI.createActionRow('md-reset-output', 'md-copy-html')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#md-input');
        const preview = oc.querySelector('#md-output-preview');

        const sampleMarkdown = `# Markdown Guide 🚀

This is a **GitHub-flavored** Markdown Previewer running purely inside your browser.

## Checklist Features
- [x] Fast Loading
- [x] Client side compilation
- [ ] No server footprint

## Code Highlight Block
\`\`\`javascript
const maruf = {
    role: "Developer",
    experience: "Awesome"
};
\`\`\`

> Stay focused and compile!
`;

        ic.querySelector('#md-sample').addEventListener('click', () => {
            input.value = sampleMarkdown;
            render();
        });

        const render = () => {
            const val = input.value;
            if (!val) {
                preview.innerHTML = '';
                return;
            }

            if (window.marked) {
                preview.innerHTML = window.marked.parse(val);
            } else {
                preview.textContent = 'Marked.js compiler could not be found.';
            }
        };

        input.addEventListener('input', render);

        oc.querySelector('#md-copy-html').addEventListener('click', () => {
            if (!preview.innerHTML) return;
            navigator.clipboard.writeText(preview.innerHTML);
            app.showToast('Formatted HTML Copied!');
        });

        const reset = () => { input.value = ''; preview.innerHTML = ''; };
        ic.querySelector('#md-reset').addEventListener('click', reset);
        oc.querySelector('#md-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 7. HTML TO JSX CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'html-to-jsx',
    name: 'HTML to JSX Converter',
    description: 'Transform static XML/HTML structures into React JSX markup layouts.',
    icon: 'fab fa-react',
    category: 'utilities',
    tags: ['html', 'jsx', 'react', 'converter', 'frontend', 'developer'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Static HTML Input</span>
                ${UI.createTextarea('jsx-input', '<div class="card" onclick="alert()">\\n  <img src="logo.png" class="logo">\\n  <label for="name">Name</label>\\n  <input type="text" id="name">\\n</div>')}
                ${UI.createActionRow('jsx-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">React JSX Output</span>
                ${UI.createTextarea('jsx-output', 'JSX results...')}
                ${UI.createActionRow('jsx-reset-output', 'jsx-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#jsx-input');
        const output = oc.querySelector('#jsx-output');

        const convert = () => {
            const html = input.value;
            if (!html) {
                output.value = '';
                return;
            }

            try {
                let jsx = html;
                
                // Replace class with className
                jsx = jsx.replace(/\sclass=/g, ' className=');
                // Replace for with htmlFor
                jsx = jsx.replace(/\sfor=/g, ' htmlFor=');
                
                // Replace simple self-closing tags: img, input, br, hr, meta, link
                const selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
                selfClosing.forEach(tag => {
                    const regex = new RegExp(`<(${tag}[^>]*)(?<!/)>`, 'gi');
                    jsx = jsx.replace(regex, `<$1 />`);
                });

                // Convert onclick, onchange, etc.
                jsx = jsx.replace(/\sonclick=/g, ' onClick=');
                jsx = jsx.replace(/\sonchange=/g, ' onChange=');
                jsx = jsx.replace(/\sonfocus=/g, ' onFocus=');
                jsx = jsx.replace(/\sonblur=/g, ' onBlur=');

                // Convert inline styles: style="color: red; font-size: 14px"
                jsx = jsx.replace(/\sstyle="([^"]*)"/g, (match, styleStr) => {
                    const rules = styleStr.split(';').filter(r => r.trim());
                    const objFields = rules.map(rule => {
                        const parts = rule.split(':');
                        if (parts.length < 2) return '';
                        
                        // camelCase properties
                        const prop = parts[0].trim().replace(/-([a-z])/g, (m, letter) => letter.toUpperCase());
                        const val = parts.slice(1).join(':').trim();
                        return `  ${prop}: "${val}"`;
                    }).filter(Boolean).join(',\n');
                    
                    return ` style={{${objFields}}}`;
                });

                output.value = jsx;
            } catch (err) {
                output.value = `Conversion Exception: ${err.message}`;
            }
        };

        input.addEventListener('input', convert);

        oc.querySelector('#jsx-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('JSX copied to clipboard!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#jsx-reset').addEventListener('click', reset);
        oc.querySelector('#jsx-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 8. YAML ↔ JSON CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'yaml-json-converter',
    name: 'YAML ↔ JSON Converter',
    description: 'Transform YAML files into structured JSON objects and vice-versa.',
    icon: 'fas fa-exchange',
    category: 'utilities',
    tags: ['yaml', 'json', 'converter', 'beautifier', 'parsers'],
    featured: false,
    libraries: ['jsyaml'],
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4">
                    ${UI.createSelect('yaml-mode', 'Conversion Direction', { 'yaml2json': 'YAML ➔ JSON', 'json2yaml': 'JSON ➔ YAML' })}
                </div>
                ${UI.createTextarea('yaml-input', 'title: Maruf DevSuite\\ncount: 30\\nactive: true')}
                ${UI.createActionRow('yaml-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Results</span>
                ${UI.createTextarea('yaml-output', 'Output compiled text...')}
                ${UI.createActionRow('yaml-reset-output', 'yaml-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#yaml-input');
        const output = oc.querySelector('#yaml-output');
        const mode = ic.querySelector('#yaml-mode');

        const convert = () => {
            const raw = input.value.trim();
            if (!raw) {
                output.value = '';
                return;
            }

            try {
                if (mode.value === 'yaml2json') {
                    if (window.jsyaml) {
                        const parsed = window.jsyaml.load(raw);
                        output.value = JSON.stringify(parsed, null, 2);
                    } else {
                        output.value = 'YAML parser dependency missing.';
                    }
                } else {
                    const parsed = JSON.parse(raw);
                    if (window.jsyaml) {
                        output.value = window.jsyaml.dump(parsed);
                    } else {
                        output.value = 'YAML parser dependency missing.';
                    }
                }
            } catch (err) {
                output.value = `Error in conversion: ${err.message}`;
            }
        };

        input.addEventListener('input', convert);
        mode.addEventListener('change', convert);

        oc.querySelector('#yaml-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Copied output string!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#yaml-reset').addEventListener('click', reset);
        oc.querySelector('#yaml-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 9. CSS MINIFIER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Compress CSS stylesheets by removing spaces, margins, and code comments.',
    icon: 'fas fa-compress',
    category: 'text',
    tags: ['css', 'minifier', 'compress', 'minify', 'styling'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Raw CSS Input</span>
                ${UI.createTextarea('css-input', '.navbar {\\n  display: flex;\\n  color: #fff; /* header link colors */\\n  margin: 10px 0px;\\n}')}
                ${UI.createActionRow('css-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Compressed CSS Output</span>
                ${UI.createTextarea('css-output', 'Minified CSS output...')}
                ${UI.createActionRow('css-reset-output', 'css-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#css-input');
        const output = oc.querySelector('#css-output');

        const minify = () => {
            const css = input.value;
            if (!css) {
                output.value = '';
                return;
            }

            let minified = css;
            // Remove comments
            minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
            // Remove line breaks & white space
            minified = minified.replace(/\s*([{\}:;])\s*/g, '$1');
            minified = minified.replace(/\s+/g, ' ');
            minified = minified.trim();

            output.value = minified;
        };

        input.addEventListener('input', minify);

        oc.querySelector('#css-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Minified CSS Copied!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#css-reset').addEventListener('click', reset);
        oc.querySelector('#css-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 10. JS MINIFIER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'js-minifier',
    name: 'JS Minifier',
    description: 'Compress client-side JavaScript code efficiently by removing whitespace and comments.',
    icon: 'fab fa-js',
    category: 'text',
    tags: ['js', 'javascript', 'minifier', 'compress', 'minify'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Raw JavaScript Input</span>
                ${UI.createTextarea('js-input', '// JS Helper\\nfunction greet(name) {\\n  console.log("Hello, " + name);\\n}')}
                ${UI.createActionRow('js-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Compressed JS Output</span>
                ${UI.createTextarea('js-output', 'Minified JS output...')}
                ${UI.createActionRow('js-reset-output', 'js-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#js-input');
        const output = oc.querySelector('#js-output');

        const minify = () => {
            const js = input.value;
            if (!js) {
                output.value = '';
                return;
            }

            let minified = js;
            
            // Remove single line comments
            minified = minified.replace(/\/\/.*$/gm, '');
            // Remove multiline comments
            minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
            // Remove multiple spaces/tabs
            minified = minified.replace(/\s+/g, ' ');
            // Remove spaces around common operators
            minified = minified.replace(/\s*([=\+\-\*\/\{\}\(\);,])\s*/g, '$1');
            minified = minified.trim();

            output.value = minified;
        };

        input.addEventListener('input', minify);

        oc.querySelector('#js-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Minified JS Copied!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#js-reset').addEventListener('click', reset);
        oc.querySelector('#js-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 11. COLOR PALETTE GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    description: 'Generate beautiful, cohesive color schemes and export copyable HEX color arrays.',
    icon: 'fas fa-palette',
    category: 'styling',
    tags: ['color', 'palette', 'designer', 'scheme', 'design', 'hex'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Color Selector</label>
                        <div class="flex items-center gap-4">
                            <input type="color" id="palette-color-input" value="#6366f1" class="w-14 h-14 cursor-pointer border border-slate-200 dark:border-darkborder rounded-xl bg-transparent">
                            <input type="text" id="palette-hex-text" value="#6366f1" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-primary-500/20 transition-all uppercase w-32">
                        </div>
                    </div>
                    ${UI.createSelect('palette-rule', 'Color Scheme Logic', {
                        'analogous': 'Analogous (Warm Side-by-side)',
                        'monochromatic': 'Monochromatic (Clean Tones)',
                        'triadic': 'Triadic (Vibrant Contrast)',
                        'complementary': 'Complementary (Opposites)'
                    })}
                </div>
                ${UI.createActionRow('palette-reset', null, `
                    <button id="palette-random" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"><i class="fas fa-arrows-rotate"></i> Random Scheme</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual Scheme Preview</span>
                    <div id="palette-colors-view" class="grid grid-cols-5 h-[140px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-darkborder"></div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Export Code Array</span>
                    <pre id="palette-array-code" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-[11px] font-mono text-emerald-500 overflow-x-auto"></pre>
                </div>
                ${UI.createActionRow('palette-reset-output', 'palette-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const picker = ic.querySelector('#palette-color-input');
        const text = ic.querySelector('#palette-hex-text');
        const rule = ic.querySelector('#palette-rule');
        const view = oc.querySelector('#palette-colors-view');
        const code = oc.querySelector('#palette-array-code');

        // Hex to HSL
        const hexToHsl = (hex) => {
            let r = parseInt(hex.substring(1, 3), 16) / 255;
            let g = parseInt(hex.substring(3, 5), 16) / 255;
            let b = parseInt(hex.substring(5, 7), 16) / 255;

            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h * 360, s: s * 100, l: l * 100 };
        };

        // HSL to Hex
        const hslToHex = (h, s, l) => {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        };

        const renderPalette = () => {
            let hex = text.value.trim();
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (hex.length !== 7) return;

            const hsl = hexToHsl(hex);
            let colors = [hex];

            const currentRule = rule.value;
            if (currentRule === 'monochromatic') {
                colors = [
                    hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)),
                    hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)),
                    hex,
                    hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)),
                    hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30))
                ];
            } else if (currentRule === 'analogous') {
                colors = [
                    hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
                    hslToHex((hsl.h + 345) % 360, hsl.s, hsl.l),
                    hex,
                    hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
                    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
                ];
            } else if (currentRule === 'triadic') {
                colors = [
                    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                    hslToHex((hsl.h + 120) % 360, Math.max(20, hsl.s - 20), Math.min(90, hsl.l + 15)),
                    hex,
                    hslToHex((hsl.h + 240) % 360, Math.max(20, hsl.s - 20), Math.min(90, hsl.l + 15)),
                    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
                ];
            } else if (currentRule === 'complementary') {
                colors = [
                    hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 20)),
                    hslToHex(hsl.h, Math.max(20, hsl.s - 15), Math.min(85, hsl.l + 15)),
                    hex,
                    hslToHex((hsl.h + 180) % 360, Math.max(20, hsl.s - 15), Math.min(85, hsl.l + 15)),
                    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
                ];
            }

            // Render view cards
            view.innerHTML = colors.map(c => `
                <div class="h-full flex flex-col justify-end p-3 cursor-pointer group/item relative active:scale-95 transition-all" style="background-color: ${c};" onclick="navigator.clipboard.writeText('${c}'); window.DevSuiteAppInstance.showToast('Copied ${c.toUpperCase()}!')">
                    <span class="text-[10px] font-bold font-mono text-white drop-shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity absolute top-3 right-3 bg-black/40 px-1.5 py-0.5 rounded"><i class="fas fa-copy"></i></span>
                    <span class="text-[10px] font-bold font-mono text-white drop-shadow-md bg-black/35 px-1 rounded truncate uppercase">${c}</span>
                </div>
            `).join('');

            code.textContent = JSON.stringify(colors, null, 2);
        };

        // Sync Hex and picker
        picker.addEventListener('input', (e) => {
            text.value = e.target.value.toUpperCase();
            renderPalette();
        });

        text.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 7 && val.startsWith('#')) {
                picker.value = val;
                renderPalette();
            }
        });

        rule.addEventListener('change', renderPalette);

        // Random Generator
        ic.querySelector('#palette-random').addEventListener('click', () => {
            const randHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            picker.value = randHex;
            text.value = randHex.toUpperCase();
            renderPalette();
            app.showToast('Random scheme generated!');
        });

        oc.querySelector('#palette-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(code.textContent);
            app.showToast('Palette Array Copied!');
        });

        const reset = () => {
            picker.value = '#6366f1';
            text.value = '#6366F1';
            rule.value = 'analogous';
            renderPalette();
        };

        ic.querySelector('#palette-reset').addEventListener('click', reset);
        oc.querySelector('#palette-reset-output').addEventListener('click', reset);

        // Render first palette
        renderPalette();
    }
});

// --------------------------------------------------------------------------
// 12. CSS GRADIENT GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Design beautiful, dynamic linear or radial gradients visually and copy CSS results.',
    icon: 'fas fa-circle-half-stroke',
    category: 'styling',
    tags: ['gradient', 'css', 'design', 'colors', 'background', 'styling'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSelect('grad-type', 'Gradient Type', { 'linear': 'Linear (Straight Line)', 'radial': 'Radial (Circular Glow)' })}
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5 w-full">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Color Stop 1</label>
                            <input type="color" id="grad-color-1" value="#6366f1" class="w-full h-11 border border-slate-200 dark:border-darkborder rounded-xl cursor-pointer bg-transparent">
                        </div>
                        <div class="flex flex-col gap-1.5 w-full">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Color Stop 2</label>
                            <input type="color" id="grad-color-2" value="#10b981" class="w-full h-11 border border-slate-200 dark:border-darkborder rounded-xl cursor-pointer bg-transparent">
                        </div>
                    </div>
                    
                    <div id="grad-angle-row">
                        ${UI.createSlider('grad-angle', 'Linear Angle', 0, 360, 135, '°')}
                    </div>
                </div>
                ${UI.createActionRow('grad-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual Canvas Preview</span>
                    <div id="grad-preview-box" class="w-full h-[120px] rounded-2xl shadow-lg border border-slate-200 dark:border-darkborder"></div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Copy CSS Property</span>
                    <pre id="grad-css-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-[11px] font-mono text-emerald-500 overflow-x-auto whitespace-pre-wrap"></pre>
                </div>
                ${UI.createActionRow('grad-reset-output', 'grad-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const type = ic.querySelector('#grad-type');
        const c1 = ic.querySelector('#grad-color-1');
        const c2 = ic.querySelector('#grad-color-2');
        const angle = ic.querySelector('#grad-angle');
        const angleLbl = ic.querySelector('#grad-angle-lbl');
        const angleRow = ic.querySelector('#grad-angle-row');
        
        const preview = oc.querySelector('#grad-preview-box');
        const cssOut = oc.querySelector('#grad-css-out');

        const updateGradient = () => {
            const isLinear = type.value === 'linear';
            if (isLinear) {
                angleRow.classList.remove('hidden');
                angleLbl.textContent = angle.value + '°';
            } else {
                angleRow.classList.add('hidden');
            }

            let gradCss = '';
            if (isLinear) {
                gradCss = `linear-gradient(${angle.value}deg, ${c1.value} 0%, ${c2.value} 100%)`;
            } else {
                gradCss = `radial-gradient(circle, ${c1.value} 0%, ${c2.value} 100%)`;
            }

            preview.style.background = gradCss;
            cssOut.textContent = `background: ${gradCss};`;
        };

        type.addEventListener('change', updateGradient);
        c1.addEventListener('input', updateGradient);
        c2.addEventListener('input', updateGradient);
        angle.addEventListener('input', updateGradient);

        oc.querySelector('#grad-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(cssOut.textContent);
            app.showToast('Gradient CSS Copied!');
        });

        const reset = () => {
            type.value = 'linear';
            c1.value = '#6366f1';
            c2.value = '#10b981';
            angle.value = 135;
            updateGradient();
        };

        ic.querySelector('#grad-reset').addEventListener('click', reset);
        oc.querySelector('#grad-reset-output').addEventListener('click', reset);

        // Initial setup
        updateGradient();
    }
});

// --------------------------------------------------------------------------
// 13. BOX SHADOW GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'box-shadow-generator',
    name: 'Box Shadow Generator',
    description: 'Design CSS box shadows with custom offsets, blur, and spread properties.',
    icon: 'fas fa-square',
    category: 'styling',
    tags: ['shadow', 'box-shadow', 'css', 'design', 'styling', 'neomorphism'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSlider('shadow-x', 'Horizontal Offset', -50, 50, 10, 'px')}
                    ${UI.createSlider('shadow-y', 'Vertical Offset', -50, 50, 10, 'px')}
                    ${UI.createSlider('shadow-blur', 'Blur Radius', 0, 100, 20, 'px')}
                    ${UI.createSlider('shadow-spread', 'Spread Radius', -30, 50, 0, 'px')}
                    
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Shadow Color & Opacity</label>
                        <div class="flex gap-4 items-center">
                            <input type="color" id="shadow-color" value="#000000" class="w-11 h-11 border border-slate-200 dark:border-darkborder rounded-xl cursor-pointer bg-transparent">
                            <div class="flex-grow">
                                ${UI.createSlider('shadow-opacity', 'Opacity', 0, 100, 20, '%')}
                            </div>
                        </div>
                    </div>
                    
                    ${UI.createCheckbox('shadow-inset', 'Inset (Inner Shadow)', false)}
                </div>
                ${UI.createActionRow('shadow-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3 flex-1 min-h-[140px] items-center justify-center bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-darkborder rounded-2xl p-6">
                    <!-- Object box to render preview shadow -->
                    <div id="shadow-box-preview" class="w-24 h-24 bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-2xl flex items-center justify-center font-bold text-xs">Object</div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Copy CSS Property</span>
                    <pre id="shadow-css-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-[11px] font-mono text-emerald-500 overflow-x-auto whitespace-pre-wrap"></pre>
                </div>
                ${UI.createActionRow('shadow-reset-output', 'shadow-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const x = ic.querySelector('#shadow-x');
        const y = ic.querySelector('#shadow-y');
        const blur = ic.querySelector('#shadow-blur');
        const spread = ic.querySelector('#shadow-spread');
        const col = ic.querySelector('#shadow-color');
        const opacity = ic.querySelector('#shadow-opacity');
        const inset = ic.querySelector('#shadow-inset');

        const box = oc.querySelector('#shadow-box-preview');
        const cssOut = oc.querySelector('#shadow-css-out');

        const updateShadow = () => {
            // Update labels
            ic.querySelector('#shadow-x-lbl').textContent = x.value + 'px';
            ic.querySelector('#shadow-y-lbl').textContent = y.value + 'px';
            ic.querySelector('#shadow-blur-lbl').textContent = blur.value + 'px';
            ic.querySelector('#shadow-spread-lbl').textContent = spread.value + 'px';
            ic.querySelector('#shadow-opacity-lbl').textContent = opacity.value + '%';

            // Calculate color hex with opacity
            let r = 0, g = 0, b = 0;
            const hex = col.value.substring(1);
            if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
            const shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity.value / 100})`;
            const shadowVal = `${inset.checked ? 'inset ' : ''}${x.value}px ${y.value}px ${blur.value}px ${spread.value}px ${shadowColor}`;

            box.style.boxShadow = shadowVal;
            cssOut.textContent = `box-shadow: ${shadowVal};\n-webkit-box-shadow: ${shadowVal};`;
        };

        [x, y, blur, spread, col, opacity].forEach(slider => slider.addEventListener('input', updateShadow));
        inset.addEventListener('change', updateShadow);

        oc.querySelector('#shadow-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(cssOut.textContent);
            app.showToast('Shadow CSS Copied!');
        });

        const reset = () => {
            x.value = 10;
            y.value = 10;
            blur.value = 20;
            spread.value = 0;
            col.value = '#000000';
            opacity.value = 20;
            inset.checked = false;
            updateShadow();
        };

        ic.querySelector('#shadow-reset').addEventListener('click', reset);
        oc.querySelector('#shadow-reset-output').addEventListener('click', reset);

        // Initial setup
        updateShadow();
    }
});

// --------------------------------------------------------------------------
// 14. QR CODE GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate high-quality QR codes and download as copyable PNG files.',
    icon: 'fas fa-qrcode',
    category: 'images',
    tags: ['qr', 'qrcode', 'generator', 'encode', 'image', 'brand'],
    featured: true,
    libraries: ['qrcode'],
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">QR Code Text/URL</label>
                        <input type="text" id="qr-text" value="https://mdmarufhossen71.site" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5 w-full">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Dark Fill Color</label>
                            <input type="color" id="qr-color-dark" value="#000000" class="w-full h-11 border border-slate-200 dark:border-darkborder rounded-xl cursor-pointer bg-transparent">
                        </div>
                        <div class="flex flex-col gap-1.5 w-full">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Background Color</label>
                            <input type="color" id="qr-color-light" value="#ffffff" class="w-full h-11 border border-slate-200 dark:border-darkborder rounded-xl cursor-pointer bg-transparent">
                        </div>
                    </div>
                </div>
                ${UI.createActionRow('qr-reset', null, `
                    <button id="qr-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate QR</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3 flex-grow items-center justify-center p-6 bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-darkborder rounded-2xl min-h-[220px]">
                    <div id="qr-canvas-holder" class="bg-white p-4 rounded-xl border border-slate-100 shadow-lg"></div>
                </div>
                ${UI.createActionRow('qr-reset-output', null, `
                    <button id="qr-download" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"><i class="fas fa-download"></i> Download PNG</button>
                `)}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const text = ic.querySelector('#qr-text');
        const dark = ic.querySelector('#qr-color-dark');
        const light = ic.querySelector('#qr-color-light');
        const holder = oc.querySelector('#qr-canvas-holder');
        
        let qrcodeObj = null;

        const generateQR = () => {
            const raw = text.value.trim();
            if (!raw) return;

            holder.innerHTML = '';
            
            if (window.QRCode) {
                qrcodeObj = new window.QRCode(holder, {
                    text: raw,
                    width: 180,
                    height: 180,
                    colorDark: dark.value,
                    colorLight: light.value,
                    correctLevel: window.QRCode.CorrectLevel.H
                });
            } else {
                holder.textContent = 'QR engine missing.';
            }
        };

        ic.querySelector('#qr-run').addEventListener('click', generateQR);

        // Download PNG
        oc.querySelector('#qr-download').addEventListener('click', () => {
            const img = holder.querySelector('img');
            if (img && img.src) {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = 'devsuite-qrcode.png';
                link.click();
                app.showToast('Downloaded QR Code PNG!');
            } else {
                app.showToast('No active QR code to download', 'error');
            }
        });

        const reset = () => {
            text.value = 'https://mdmarufhossen71.site';
            dark.value = '#000000';
            light.value = '#ffffff';
            generateQR();
        };

        ic.querySelector('#qr-reset').addEventListener('click', reset);
        oc.querySelector('#qr-reset-output').addEventListener('click', reset);

        // Render first
        generateQR();
    }
});

// --------------------------------------------------------------------------
// 15. UUID GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate standard Universally Unique Identifiers (UUID v4) instantly in batch sequences.',
    icon: 'fas fa-microchip',
    category: 'generators',
    tags: ['uuid', 'guid', 'generator', 'id', 'keys', 'database'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSlider('uuid-count', 'Batch Generation Size', 1, 50, 5)}
                </div>
                ${UI.createActionRow('uuid-reset', null, `
                    <button id="uuid-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate UUIDs</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated UUID List</span>
                ${UI.createTextarea('uuid-output', 'Generated IDs...')}
                ${UI.createActionRow('uuid-reset-output', 'uuid-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const count = ic.querySelector('#uuid-count');
        const output = oc.querySelector('#uuid-output');

        const generateUuid = () => {
            // Standard cryptographic UUID v4 generator in vanilla JS
            const genV4 = () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            const size = parseInt(count.value);
            let uuids = [];
            for (let i = 0; i < size; i++) {
                uuids.push(genV4());
            }

            output.value = uuids.join('\n');
        };

        ic.querySelector('#uuid-run').addEventListener('click', generateUuid);
        count.addEventListener('input', () => {
            ic.querySelector('#uuid-count-lbl').textContent = count.value;
        });

        oc.querySelector('#uuid-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Copied UUID batch list!');
        });

        const reset = () => { count.value = 5; ic.querySelector('#uuid-count-lbl').textContent = '5'; output.value = ''; };
        ic.querySelector('#uuid-reset').addEventListener('click', reset);
        oc.querySelector('#uuid-reset-output').addEventListener('click', reset);

        // run once on mount
        generateUuid();
    }
});

// --------------------------------------------------------------------------
// 16. PASSWORD GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate high-entropy cryptographically secure random passwords.',
    icon: 'fas fa-shield-halved',
    category: 'generators',
    tags: ['password', 'generator', 'security', 'keys', 'encryption'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSlider('pw-length', 'Password Length', 8, 64, 16)}
                    
                    <div class="flex flex-col gap-3">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Include Parameters</span>
                        <div class="grid grid-cols-2 gap-3">
                            ${UI.createCheckbox('pw-upper', 'Uppercase Letters', true)}
                            ${UI.createCheckbox('pw-lower', 'Lowercase Letters', true)}
                            ${UI.createCheckbox('pw-numbers', 'Numbers (0-9)', true)}
                            ${UI.createCheckbox('pw-symbols', 'Symbols (!@#$)', true)}
                        </div>
                    </div>
                </div>
                ${UI.createActionRow('pw-reset', null, `
                    <button id="pw-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate Password</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated Password</span>
                    <input type="text" id="pw-output" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-3 font-mono text-sm text-primary-500 outline-none select-all">
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Entropy Strength Rating</span>
                    <div id="pw-strength-bar" class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div id="pw-strength-fill" class="h-full bg-emerald-500 w-0 transition-all duration-300"></div>
                    </div>
                    <span id="pw-strength-text" class="text-xs font-bold uppercase text-slate-400">Weak</span>
                </div>
                ${UI.createActionRow('pw-reset-output', 'pw-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const length = ic.querySelector('#pw-length');
        const upper = ic.querySelector('#pw-upper');
        const lower = ic.querySelector('#pw-lower');
        const numbers = ic.querySelector('#pw-numbers');
        const symbols = ic.querySelector('#pw-symbols');

        const output = oc.querySelector('#pw-output');
        const fill = oc.querySelector('#pw-strength-fill');
        const text = oc.querySelector('#pw-strength-text');

        const generatePassword = () => {
            const len = parseInt(length.value);
            
            const charsetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const charsetLower = 'abcdefghijklmnopqrstuvwxyz';
            const charsetNumbers = '0123456789';
            const charsetSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

            let pool = '';
            if (upper.checked) pool += charsetUpper;
            if (lower.checked) pool += charsetLower;
            if (numbers.checked) pool += charsetNumbers;
            if (symbols.checked) pool += charsetSymbols;

            if (!pool) {
                output.value = 'Please select at least one check parameter';
                fill.className = 'h-full bg-slate-300';
                fill.style.width = '0%';
                text.textContent = 'None';
                return;
            }

            let result = '';
            // Crypto random fallback
            const array = new Uint32Array(len);
            window.crypto.getRandomValues(array);
            
            for (let i = 0; i < len; i++) {
                result += pool[array[i] % pool.length];
            }

            output.value = result;
            
            // Calc strength
            let score = 0;
            if (len >= 8) score += 20;
            if (len >= 12) score += 20;
            if (len >= 16) score += 10;
            
            let charTypes = 0;
            if (upper.checked) charTypes++;
            if (lower.checked) charTypes++;
            if (numbers.checked) charTypes++;
            if (symbols.checked) charTypes++;

            score += charTypes * 12.5;

            fill.style.width = score + '%';
            if (score < 40) {
                fill.className = 'h-full bg-rose-500';
                text.textContent = 'Weak Password ⚠️';
            } else if (score < 70) {
                fill.className = 'h-full bg-amber-500';
                text.textContent = 'Medium Strength 👍';
            } else {
                fill.className = 'h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
                text.textContent = 'Cryptographically Strong 💪';
            }
        };

        ic.querySelector('#pw-run').addEventListener('click', generatePassword);
        length.addEventListener('input', () => {
            ic.querySelector('#pw-length-lbl').textContent = length.value;
        });

        oc.querySelector('#pw-copy').addEventListener('click', () => {
            if (!output.value || output.value.startsWith('Please')) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Password copied safely!');
        });

        const reset = () => {
            length.value = 16;
            ic.querySelector('#pw-length-lbl').textContent = '16';
            upper.checked = true;
            lower.checked = true;
            numbers.checked = true;
            symbols.checked = true;
            generatePassword();
        };

        ic.querySelector('#pw-reset').addEventListener('click', reset);
        oc.querySelector('#pw-reset-output').addEventListener('click', reset);

        // Run once on load
        generatePassword();
    }
});

// --------------------------------------------------------------------------
// 17. HASH GENERATOR (MD5/SHA256)
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Calculate real-time cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for text strings.',
    icon: 'fas fa-key',
    category: 'generators',
    tags: ['hash', 'md5', 'sha256', 'cryptography', 'digest', 'salt'],
    featured: false,
    libraries: ['cryptojs'],
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Input Text</span>
                ${UI.createTextarea('hash-input', 'Maruf DevSuite')}
                ${UI.createActionRow('hash-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full">
                <div class="flex flex-col gap-1.5 w-full">
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>MD5</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('hash-md5-out').value); window.DevSuiteAppInstance.showToast('Copied MD5!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <input type="text" id="hash-md5-out" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 font-mono text-xs text-slate-500">
                </div>
                <div class="flex flex-col gap-1.5 w-full">
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>SHA-1</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('hash-sha1-out').value); window.DevSuiteAppInstance.showToast('Copied SHA-1!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <input type="text" id="hash-sha1-out" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 font-mono text-xs text-slate-500">
                </div>
                <div class="flex flex-col gap-1.5 w-full">
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>SHA-256</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('hash-sha256-out').value); window.DevSuiteAppInstance.showToast('Copied SHA-256!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <input type="text" id="hash-sha256-out" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 font-mono text-xs text-slate-500">
                </div>
                <div class="flex flex-col gap-1.5 w-full">
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>SHA-512</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('hash-sha512-out').value); window.DevSuiteAppInstance.showToast('Copied SHA-512!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <input type="text" id="hash-sha512-out" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 font-mono text-xs text-slate-500">
                </div>
                ${UI.createActionRow('hash-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#hash-input');
        
        const md5 = oc.querySelector('#hash-md5-out');
        const sha1 = oc.querySelector('#hash-sha1-out');
        const sha256 = oc.querySelector('#hash-sha256-out');
        const sha512 = oc.querySelector('#hash-sha512-out');

        const calculateHashes = () => {
            const val = input.value;
            if (!val) {
                [md5, sha1, sha256, sha512].forEach(inp => inp.value = '');
                return;
            }

            if (window.CryptoJS) {
                md5.value = window.CryptoJS.MD5(val).toString();
                sha1.value = window.CryptoJS.SHA1(val).toString();
                sha256.value = window.CryptoJS.SHA256(val).toString();
                sha512.value = window.CryptoJS.SHA512(val).toString();
            } else {
                [md5, sha1, sha256, sha512].forEach(inp => inp.value = 'Crypto library missing.');
            }
        };

        input.addEventListener('input', calculateHashes);

        const reset = () => { input.value = ''; calculateHashes(); };
        ic.querySelector('#hash-reset').addEventListener('click', reset);
        oc.querySelector('#hash-reset-output').addEventListener('click', reset);

        // Calc once on mount
        calculateHashes();
    }
});

// --------------------------------------------------------------------------
// 18. UNIX TIMESTAMP CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert Unix epoch timestamps to readable date-times and vice-versa.',
    icon: 'fas fa-clock',
    category: 'converters',
    tags: ['unix', 'timestamp', 'date', 'epoch', 'converter', 'timezone'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Unix Epoch Timestamp (sec)</label>
                        <div class="flex gap-2">
                            <input type="text" id="unix-ts" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono">
                            <button id="unix-now-btn" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-4 rounded-xl transition-all shadow-md">Now</button>
                        </div>
                    </div>
                    <div class="border-t border-slate-100 dark:border-darkborder pt-3 flex flex-col gap-3">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Calendar Date ➔ Timestamp</span>
                        <div class="flex flex-col gap-1.5 w-full">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pick Date & Time</label>
                            <input type="datetime-local" id="unix-cal-input" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono">
                        </div>
                    </div>
                </div>
                ${UI.createActionRow('unix-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>GMT / UTC Date</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('unix-utc-out').textContent); window.DevSuiteAppInstance.showToast('Copied UTC!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <pre id="unix-utc-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-mono text-slate-600 min-h-[40px] flex items-center"></pre>
                    
                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Local timezone Date</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('unix-local-out').textContent); window.DevSuiteAppInstance.showToast('Copied local time!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <pre id="unix-local-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-mono text-slate-600 min-h-[40px] flex items-center"></pre>

                    <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Calculated Timestamp Output</span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('unix-val-out').textContent); window.DevSuiteAppInstance.showToast('Copied Timestamp!')" class="text-primary-500"><i class="fas fa-copy"></i></button>
                    </div>
                    <pre id="unix-val-out" class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-xs font-mono text-emerald-500 min-h-[40px] flex items-center"></pre>
                </div>
                ${UI.createActionRow('unix-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const ts = ic.querySelector('#unix-ts');
        const cal = ic.querySelector('#unix-cal-input');
        const nowBtn = ic.querySelector('#unix-now-btn');

        const utc = oc.querySelector('#unix-utc-out');
        const local = oc.querySelector('#unix-local-out');
        const valOut = oc.querySelector('#unix-val-out');

        const updateFromTs = () => {
            const val = parseInt(ts.value);
            if (isNaN(val)) {
                utc.textContent = '';
                local.textContent = '';
                return;
            }

            const date = new Date(val * 1000);
            utc.textContent = date.toUTCString();
            local.textContent = date.toLocaleString();
            valOut.textContent = val;
        };

        const updateFromCal = () => {
            const val = cal.value;
            if (!val) return;

            const date = new Date(val);
            const epoch = Math.round(date.getTime() / 1000);
            ts.value = epoch;
            
            utc.textContent = date.toUTCString();
            local.textContent = date.toLocaleString();
            valOut.textContent = epoch;
        };

        const setNow = () => {
            const epoch = Math.round(Date.now() / 1000);
            ts.value = epoch;
            updateFromTs();
        };

        ts.addEventListener('input', updateFromTs);
        cal.addEventListener('input', updateFromCal);
        nowBtn.addEventListener('click', setNow);

        const reset = () => { ts.value = ''; cal.value = ''; utc.textContent = ''; local.textContent = ''; valOut.textContent = ''; };
        ic.querySelector('#unix-reset').addEventListener('click', reset);
        oc.querySelector('#unix-reset-output').addEventListener('click', reset);

        // initial state
        setNow();
    }
});

// --------------------------------------------------------------------------
// 19. DIFF CHECKER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two code blocks or text inputs to highlight line and character variations.',
    icon: 'fas fa-code-compare',
    category: 'utilities',
    tags: ['diff', 'checker', 'compare', 'merge', 'git', 'changes'],
    featured: true,
    libraries: ['jsdiff'],
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-grow">
                    <div class="flex flex-col gap-1.5 w-full flex-grow">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Original Text (A)</label>
                        <textarea id="diff-text-a" placeholder="Paste original text here..." class="w-full flex-grow min-h-[160px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"></textarea>
                    </div>
                    <div class="flex flex-col gap-1.5 w-full flex-grow">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Modified Text (B)</label>
                        <textarea id="diff-text-b" placeholder="Paste modified text here..." class="w-full flex-grow min-h-[160px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"></textarea>
                    </div>
                </div>
                ${UI.createActionRow('diff-reset', null, `
                    <button id="diff-sample" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Load Sample</button>
                    <button id="diff-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Check Difference</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual Difference Output</span>
                <div id="diff-output-preview" class="w-full min-h-[220px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-4 font-mono text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    Differences will be rendered here...
                </div>
                ${UI.createActionRow('diff-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const textA = ic.querySelector('#diff-text-a');
        const textB = ic.querySelector('#diff-text-b');
        const preview = oc.querySelector('#diff-output-preview');

        const originalSample = '// Greet function\nfunction hello() {\n  console.log("Hello World");\n}';
        const modifiedSample = '// Expanded Greet function\nfunction hello(name = "World") {\n  console.log("Welcome " + name);\n}';

        ic.querySelector('#diff-sample').addEventListener('click', () => {
            textA.value = originalSample;
            textB.value = modifiedSample;
            checkDiff();
        });

        const checkDiff = () => {
            const a = textA.value;
            const b = textB.value;

            if (!a && !b) {
                preview.textContent = 'Differences will be rendered here...';
                return;
            }

            if (window.Diff) {
                const diff = window.Diff.diffLines(a, b);
                let rendered = '';
                
                diff.forEach(part => {
                    // green for additions, red for deletions, grey for common
                    const colorClass = part.added ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                                       part.removed ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 line-through' :
                                       'text-slate-400 dark:text-slate-600';
                    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                    
                    const lines = part.value.split('\n');
                    if (lines[lines.length - 1] === '') lines.pop(); // strip trailing newline splits

                    lines.forEach(line => {
                        rendered += `<div class="${colorClass} px-2 py-0.5 rounded-md">${prefix}${escapeHtml(line)}</div>`;
                    });
                });

                preview.innerHTML = rendered || 'No differences detected.';
            } else {
                preview.textContent = 'Diff parser dependency missing.';
            }
        };

        const escapeHtml = (text) => {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        ic.querySelector('#diff-run').addEventListener('click', checkDiff);

        const reset = () => { textA.value = ''; textB.value = ''; preview.textContent = 'Differences will be rendered here...'; };
        ic.querySelector('#diff-reset').addEventListener('click', reset);
        oc.querySelector('#diff-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 20. WORD COUNTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Calculate instant textual metrics (words, lines, characters, read times) for any string.',
    icon: 'fas fa-arrow-up-9-1',
    category: 'text',
    tags: ['word', 'counter', 'character', 'line', 'reading', 'readability'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Input String Text</span>
                ${UI.createTextarea('words-input', 'Maruf DevSuite has 30 tools. Everything runs locally in-browser.')}
                ${UI.createActionRow('words-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Words</span>
                        <div id="cnt-words" class="text-xl font-extrabold text-primary-500">0</div>
                    </div>
                    <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Characters</span>
                        <div id="cnt-chars" class="text-xl font-extrabold text-primary-500">0</div>
                    </div>
                    <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Lines</span>
                        <div id="cnt-lines" class="text-xl font-extrabold text-primary-500">0</div>
                    </div>
                    <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl text-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Est. Read Time</span>
                        <div id="cnt-readtime" class="text-sm font-extrabold text-primary-500 h-7 flex items-center justify-center">0s</div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Character Density Density Frequency</span>
                    <div id="cnt-density" class="p-3 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-darkborder rounded-xl text-xs flex flex-wrap gap-2">
                        No characters parsed.
                    </div>
                </div>
                ${UI.createActionRow('words-reset-output')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#words-input');
        
        const words = oc.querySelector('#cnt-words');
        const chars = oc.querySelector('#cnt-chars');
        const lines = oc.querySelector('#cnt-lines');
        const readtime = oc.querySelector('#cnt-readtime');
        const density = oc.querySelector('#cnt-density');

        const calculateStats = () => {
            const val = input.value;
            if (!val) {
                words.textContent = '0';
                chars.textContent = '0';
                lines.textContent = '0';
                readtime.textContent = '0s';
                density.innerHTML = 'No characters parsed.';
                return;
            }

            // Word count
            const wordsList = val.trim().split(/\s+/).filter(w => w.length > 0);
            words.textContent = wordsList.length;

            // Chars
            chars.textContent = val.length;

            // Lines
            lines.textContent = val.split('\n').length;

            // Read time (avg 200 wpm)
            const seconds = Math.round((wordsList.length / 200) * 60);
            readtime.textContent = seconds < 60 ? `${seconds}s` : `${Math.round(seconds/60)}m ${seconds%60}s`;

            // Density frequency (letters)
            let frequencies = {};
            const cleanLetters = val.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (let i = 0; i < cleanLetters.length; i++) {
                const char = cleanLetters[i];
                frequencies[char] = (frequencies[char] || 0) + 1;
            }

            const sorted = Object.entries(frequencies).sort((a,b) => b[1] - a[1]).slice(0, 10);
            if (sorted.length > 0) {
                density.innerHTML = sorted.map(([char, freq]) => `
                    <span class="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-[11px] font-mono font-semibold">${char.toUpperCase()}: ${freq}</span>
                `).join('');
            } else {
                density.innerHTML = 'No alphanumeric letters parsed.';
            }
        };

        input.addEventListener('input', calculateStats);

        const reset = () => { input.value = ''; calculateStats(); };
        ic.querySelector('#words-reset').addEventListener('click', reset);
        oc.querySelector('#words-reset-output').addEventListener('click', reset);

        // calc once on mount
        calculateStats();
    }
});

// --------------------------------------------------------------------------
// 21. CASE CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Transform letter case quickly (Title Case, camelCase, snake_case, etc.).',
    icon: 'fas fa-arrow-down-a-z',
    category: 'converters',
    tags: ['case', 'converter', 'upper', 'lower', 'camelcase', 'snakecase'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4">
                    ${UI.createSelect('case-mode', 'Letter Case Style', {
                        'upper': 'UPPERCASE',
                        'lower': 'lowercase',
                        'title': 'Title Case',
                        'sentence': 'Sentence case',
                        'camel': 'camelCase',
                        'snake': 'snake_case',
                        'kebab': 'kebab-case',
                        'alternating': 'aLtErNaTiNg CaSe'
                    })}
                </div>
                ${UI.createTextarea('case-input', 'Maruf DevSuite is awesome')}
                ${UI.createActionRow('case-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Conversion Result</span>
                ${UI.createTextarea('case-output', 'Case converted output...')}
                ${UI.createActionRow('case-reset-output', 'case-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#case-input');
        const output = oc.querySelector('#case-output');
        const mode = ic.querySelector('#case-mode');

        const convert = () => {
            const val = input.value;
            if (!val) {
                output.value = '';
                return;
            }

            const currentMode = mode.value;
            let result = '';

            const words = val.trim().split(/\s+/).filter(w => w.length > 0);

            if (currentMode === 'upper') {
                result = val.toUpperCase();
            } else if (currentMode === 'lower') {
                result = val.toLowerCase();
            } else if (currentMode === 'title') {
                result = val.toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase());
            } else if (currentMode === 'sentence') {
                result = val.toLowerCase().replace(/(^\s*|[.!?]\s+)[a-z]/g, m => m.toUpperCase());
            } else if (currentMode === 'camel') {
                result = words.map((w, idx) => {
                    const clean = w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    return idx === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
                }).join('');
            } else if (currentMode === 'snake') {
                result = words.map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).join('_');
            } else if (currentMode === 'kebab') {
                result = words.map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).join('-');
            } else if (currentMode === 'alternating') {
                result = val.split('').map((c, idx) => idx % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
            }

            output.value = result;
        };

        input.addEventListener('input', convert);
        mode.addEventListener('change', convert);

        oc.querySelector('#case-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Copied casing output!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#case-reset').addEventListener('click', reset);
        oc.querySelector('#case-reset-output').addEventListener('click', reset);

        // initial execution
        convert();
    }
});

// --------------------------------------------------------------------------
// 22. CSV TO JSON CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'csv-json-converter',
    name: 'CSV to JSON Converter',
    description: 'Transform CSV tabular files into clean, structured JSON arrays and vice-versa.',
    icon: 'fas fa-file-csv',
    category: 'utilities',
    tags: ['csv', 'json', 'converter', 'tabular', 'spreadsheet', 'parse'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-wrap gap-4">
                    ${UI.createSelect('csv-mode', 'Conversion Direction', { 'csv2json': 'CSV ➔ JSON', 'json2yaml': 'JSON ➔ CSV' })}
                </div>
                ${UI.createTextarea('csv-input', 'name,active,count\\nMaruf DevSuite,true,30\\nWebsite,false,5')}
                ${UI.createActionRow('csv-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Results</span>
                ${UI.createTextarea('csv-output', 'Output converted string...')}
                ${UI.createActionRow('csv-reset-output', 'csv-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#csv-input');
        const output = oc.querySelector('#csv-output');
        const mode = ic.querySelector('#csv-mode');

        const convert = () => {
            const raw = input.value.trim();
            if (!raw) {
                output.value = '';
                return;
            }

            try {
                if (mode.value === 'csv2json') {
                    const lines = raw.split('\n');
                    if (lines.length < 2) {
                        output.value = 'CSV must contain at least a header line and one data line.';
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                    const result = [];

                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;
                        const obj = {};
                        const currentline = lines[i].split(',');

                        headers.forEach((header, idx) => {
                            let val = currentline[idx] ? currentline[idx].trim().replace(/^"|"$/g, '') : '';
                            // Try cast numbers and bools
                            if (val.toLowerCase() === 'true') val = true;
                            else if (val.toLowerCase() === 'false') val = false;
                            else if (!isNaN(val) && val !== '') val = Number(val);
                            
                            obj[header] = val;
                        });
                        result.push(obj);
                    }
                    output.value = JSON.stringify(result, null, 2);
                } else {
                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed) || parsed.length === 0) {
                        output.value = 'JSON input must be a non-empty array of objects.';
                        return;
                    }

                    const headers = Object.keys(parsed[0]);
                    const csvRows = [headers.join(',')];

                    parsed.forEach(obj => {
                        const values = headers.map(header => {
                            const val = obj[header];
                            if (typeof val === 'string' && val.includes(',')) {
                                return `"${val}"`;
                            }
                            return val;
                        });
                        csvRows.push(values.join(','));
                    });
                    output.value = csvRows.join('\n');
                }
            } catch (err) {
                output.value = `Conversion Error: ${err.message}`;
            }
        };

        input.addEventListener('input', convert);
        mode.addEventListener('change', convert);

        oc.querySelector('#csv-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Clipped output to clipboard!');
        });

        const reset = () => { input.value = ''; output.value = ''; };
        ic.querySelector('#csv-reset').addEventListener('click', reset);
        oc.querySelector('#csv-reset-output').addEventListener('click', reset);

        // initial execution
        convert();
    }
});

// --------------------------------------------------------------------------
// 23. IMAGE TO BASE64 CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert local JPEG, PNG, or SVG image files into Base64 Data URL logs locally.',
    icon: 'fas fa-image-portrait',
    category: 'images',
    tags: ['image', 'base64', 'converter', 'dataurl', 'img', 'tag'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Image File Upload</span>
                    <div id="img-dropzone" class="w-full min-h-[140px] border-2 border-dashed border-slate-200 dark:border-darkborder hover:border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer bg-slate-100/20 dark:bg-slate-800/10 transition-colors">
                        <i class="fas fa-cloud-arrow-up text-slate-400 text-3xl mb-3"></i>
                        <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Drag & Drop image here</span>
                        <span class="text-[11px] text-slate-400 mt-1">Supports PNG, JPEG, SVG up to 5MB</span>
                        <input type="file" id="img-file-picker" accept="image/*" class="hidden">
                    </div>
                </div>
                ${UI.createActionRow('img-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Base64 Data URL string</span>
                    ${UI.createTextarea('img-output', 'Base64 string output...')}
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Copy as HTML tag</span>
                    <input type="text" id="img-html-tag" readonly class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 font-mono text-xs text-slate-500">
                </div>
                ${UI.createActionRow('img-reset-output', 'img-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const dropzone = ic.querySelector('#img-dropzone');
        const picker = ic.querySelector('#img-file-picker');
        
        const output = oc.querySelector('#img-output');
        const htmlTag = oc.querySelector('#img-html-tag');

        const processFile = (file) => {
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Url = e.target.result;
                output.value = base64Url;
                htmlTag.value = `<img src="${base64Url}" alt="DevSuite Base64 Image">`;
                app.showToast('Image converted successfully!');
            };
            reader.readAsDataURL(file);
        };

        dropzone.addEventListener('click', () => picker.click());
        picker.addEventListener('change', (e) => {
            const file = e.target.files[0];
            processFile(file);
        });

        // drag/drop
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.className = dropzone.className.replace('border-slate-200', 'border-primary-500'); });
        dropzone.addEventListener('dragleave', () => { dropzone.className = dropzone.className.replace('border-primary-500', 'border-slate-200'); });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.className = dropzone.className.replace('border-primary-500', 'border-slate-200');
            const file = e.dataTransfer.files[0];
            processFile(file);
        });

        oc.querySelector('#img-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Copied Base64 string!');
        });

        const reset = () => { picker.value = ''; output.value = ''; htmlTag.value = ''; };
        ic.querySelector('#img-reset').addEventListener('click', reset);
        oc.querySelector('#img-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 24. SVG TO PNG CONVERTER
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'svg-to-png',
    name: 'SVG to PNG Converter',
    description: 'Convert vector SVG markup or XML source directly into downloadable high-quality PNGs.',
    icon: 'fas fa-crop-simple',
    category: 'images',
    tags: ['svg', 'png', 'image', 'converter', 'vector', 'render'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">SVG XML Code</span>
                ${UI.createTextarea('svg-input', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">\\n  <circle cx="50" cy="50" r="40" fill="#6366f1" />\\n  <rect x="35" y="35" width="30" height="30" fill="#ffffff" />\\n</svg>')}
                ${UI.createActionRow('svg-reset', null, `
                    <button id="svg-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Render Canvas</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3 flex-grow items-center justify-center p-6 bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-darkborder rounded-2xl min-h-[220px]">
                    <div id="svg-render-holder" class="bg-white p-3 rounded-xl border border-slate-100 shadow flex items-center justify-center"></div>
                </div>
                ${UI.createActionRow('svg-reset-output', null, `
                    <button id="svg-download" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"><i class="fas fa-download"></i> Download PNG</button>
                `)}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const input = ic.querySelector('#svg-input');
        const holder = oc.querySelector('#svg-render-holder');
        
        let canvas = null;

        const renderPng = () => {
            const rawSvg = input.value.trim();
            if (!rawSvg) return;

            holder.innerHTML = '';
            
            try {
                // Parse Width/Height or default
                const parser = new DOMParser();
                const doc = parser.parseFromString(rawSvg, "image/svg+xml");
                const svgEl = doc.querySelector('svg');
                
                if (!svgEl) {
                    holder.innerHTML = '<span class="text-rose-500 font-semibold text-xs">Invalid SVG: Code must contain a &lt;svg&gt; element</span>';
                    return;
                }

                const width = svgEl.getAttribute('width') ? parseInt(svgEl.getAttribute('width')) : 200;
                const height = svgEl.getAttribute('height') ? parseInt(svgEl.getAttribute('height')) : 200;

                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                const blob = new Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);

                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    
                    // Render image inside view holder
                    const renderImg = new Image();
                    renderImg.src = canvas.toDataURL('image/png');
                    renderImg.className = 'max-h-[160px] object-contain shadow-sm border border-slate-100 rounded';
                    holder.appendChild(renderImg);
                };
                img.src = url;

            } catch (err) {
                holder.innerHTML = `<span class="text-rose-500 font-semibold text-xs">Renderer Failure: ${err.message}</span>`;
            }
        };

        ic.querySelector('#svg-run').addEventListener('click', renderPng);

        oc.querySelector('#svg-download').addEventListener('click', () => {
            if (canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'devsuite-rendered-vector.png';
                link.click();
                app.showToast('Downloaded PNG Image!');
            } else {
                app.showToast('No rendered PNG is active', 'error');
            }
        });

        const reset = () => {
            input.value = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">\n  <circle cx="50" cy="50" r="40" fill="#6366f1" />\n  <rect x="35" y="35" width="30" height="30" fill="#ffffff" />\n</svg>';
            renderPng();
        };

        ic.querySelector('#svg-reset').addEventListener('click', reset);
        oc.querySelector('#svg-reset-output').addEventListener('click', reset);

        // initial execution
        renderPng();
    }
});

// --------------------------------------------------------------------------
// 25. FAVICON GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'favicon-generator',
    name: 'Favicon Generator',
    description: 'Transform images locally to standard 32x32px .ico formats for browser support.',
    icon: 'fas fa-circle-nodes',
    category: 'images',
    tags: ['favicon', 'ico', 'image', 'brand', 'generators', 'resize'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Image File Upload</span>
                    <div id="fav-dropzone" class="w-full min-h-[140px] border-2 border-dashed border-slate-200 dark:border-darkborder hover:border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer bg-slate-100/20 dark:bg-slate-800/10 transition-colors">
                        <i class="fas fa-cloud-arrow-up text-slate-400 text-3xl mb-3"></i>
                        <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Drag & Drop image here</span>
                        <input type="file" id="fav-file-picker" accept="image/*" class="hidden">
                    </div>
                </div>
                ${UI.createActionRow('fav-reset')}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-3 flex-grow items-center justify-center p-6 bg-slate-100/30 dark:bg-slate-900/20 border border-slate-200 dark:border-darkborder rounded-2xl min-h-[220px]">
                    <div id="fav-preview-holder" class="bg-white p-6 rounded-xl border border-slate-100 shadow flex flex-col items-center gap-2">
                        <div id="fav-circle-wrap" class="w-12 h-12 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-full">
                            <span class="text-slate-400 text-xs">Favicon</span>
                        </div>
                    </div>
                </div>
                ${UI.createActionRow('fav-reset-output', null, `
                    <button id="fav-download" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"><i class="fas fa-download"></i> Download 32x32 PNG</button>
                `)}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const dropzone = ic.querySelector('#fav-dropzone');
        const picker = ic.querySelector('#fav-file-picker');
        
        const previewHolder = oc.querySelector('#fav-preview-holder');
        const circleWrap = oc.querySelector('#fav-circle-wrap');
        
        let canvas = null;

        const processFile = (file) => {
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    canvas = document.createElement('canvas');
                    canvas.width = 32;
                    canvas.height = 32;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 32, 32);

                    circleWrap.innerHTML = '';
                    
                    const rendered = new Image();
                    rendered.src = canvas.toDataURL('image/png');
                    rendered.className = 'w-8 h-8 object-contain border border-slate-100 shadow';
                    
                    circleWrap.appendChild(rendered);
                    app.showToast('Favicon compiled locally!');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        dropzone.addEventListener('click', () => picker.click());
        picker.addEventListener('change', (e) => {
            const file = e.target.files[0];
            processFile(file);
        });

        // drag/drop
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.className = dropzone.className.replace('border-slate-200', 'border-primary-500'); });
        dropzone.addEventListener('dragleave', () => { dropzone.className = dropzone.className.replace('border-primary-500', 'border-slate-200'); });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.className = dropzone.className.replace('border-primary-500', 'border-slate-200');
            const file = e.dataTransfer.files[0];
            processFile(file);
        });

        oc.querySelector('#fav-download').addEventListener('click', () => {
            if (canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'favicon-32x32.png';
                link.click();
                app.showToast('Favicon PNG Downloaded!');
            } else {
                app.showToast('No active favicon to download', 'error');
            }
        });

        const reset = () => { picker.value = ''; circleWrap.innerHTML = '<span class="text-slate-400 text-xs">Favicon</span>'; canvas = null; };
        ic.querySelector('#fav-reset').addEventListener('click', reset);
        oc.querySelector('#fav-reset-output').addEventListener('click', reset);
    }
});

// --------------------------------------------------------------------------
// 26. FAKE JSON API GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'fake-api-generator',
    name: 'Fake JSON API Generator',
    description: 'Instantly generate fake mock database JSON files (Users, Posts, Products) with dynamic sizing.',
    icon: 'fas fa-server',
    category: 'generators',
    tags: ['api', 'fake', 'mock', 'json', 'data', 'developer', 'seeding'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSelect('api-resource', 'Target Resource Schema', {
                        'users': 'Users (Profile lists)',
                        'posts': 'Posts (Blog elements)',
                        'products': 'Products (E-commerce lists)'
                    })}
                    ${UI.createSlider('api-count', 'Resource Count Size', 1, 100, 5)}
                </div>
                ${UI.createActionRow('api-reset', null, `
                    <button id="api-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Seed Fake Database</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Mock JSON database</span>
                ${UI.createTextarea('api-output', 'Seeded mock files...')}
                ${UI.createActionRow('api-reset-output', 'api-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const resource = ic.querySelector('#api-resource');
        const count = ic.querySelector('#api-count');
        const output = oc.querySelector('#api-output');

        const firstNames = ["Emily", "Michael", "Sophia", "Daniel", "Olivia", "James", "Emma", "David", "Isabella", "John"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
        const domains = ["gmail.com", "outlook.com", "yahoo.com", "devsuite.site", "website.com"];
        
        const postTitles = ["Unlocking CSS Variables", "Understanding JWT", "Modern Front-end Workflows", "Vite vs Rollup Performance", "Tailwind styling practices", "Local-first database models"];
        const postTags = ["css", "webdev", "frameworks", "performance", "security", "react"];

        const generateDatabase = () => {
            const size = parseInt(count.value);
            const res = resource.value;
            let list = [];

            for (let i = 1; i <= size; i++) {
                if (res === 'users') {
                    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
                    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
                    const domain = domains[Math.floor(Math.random() * domains.length)];
                    list.push({
                        id: i,
                        name: `${fn} ${ln}`,
                        username: `${fn.toLowerCase()}_${ln.toLowerCase()}`,
                        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
                        role: Math.random() > 0.4 ? 'Developer' : 'UI Designer',
                        active: Math.random() > 0.2
                    });
                } else if (res === 'posts') {
                    const title = postTitles[Math.floor(Math.random() * postTitles.length)];
                    const views = Math.floor(Math.random() * 5000) + 120;
                    list.push({
                        id: i,
                        title: `${title} - Chapter ${i}`,
                        authorId: Math.floor(Math.random() * 10) + 1,
                        tags: [postTags[Math.floor(Math.random() * postTags.length)], "devsuite"],
                        views: views,
                        published: Math.random() > 0.15
                    });
                } else {
                    const adj = ["Wireless", "Ergonomic", "Mechanical", "Sleek", "Portable", "Rechargeable"];
                    const prod = ["Mouse", "Keyboard", "Headphones", "Monitor", "Desk Lamp", "Charger"];
                    const title = `${adj[Math.floor(Math.random() * adj.length)]} ${prod[Math.floor(Math.random() * prod.length)]}`;
                    list.push({
                        id: i,
                        name: title,
                        price: Number((Math.random() * 150 + 10).toFixed(2)),
                        stock: Math.floor(Math.random() * 120) + 5,
                        inStock: Math.random() > 0.08
                    });
                }
            }

            output.value = JSON.stringify(list, null, 2);
        };

        ic.querySelector('#api-run').addEventListener('click', generateDatabase);
        count.addEventListener('input', () => {
            ic.querySelector('#api-count-lbl').textContent = count.value;
        });

        oc.querySelector('#api-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Fake Database Copied!');
        });

        const reset = () => {
            resource.value = 'users';
            count.value = 5;
            ic.querySelector('#api-count-lbl').textContent = '5';
            generateDatabase();
        };

        ic.querySelector('#api-reset').addEventListener('click', reset);
        oc.querySelector('#api-reset-output').addEventListener('click', reset);

        // seed first
        generateDatabase();
    }
});

// --------------------------------------------------------------------------
// 27. GITHUB README GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'github-readme-generator',
    name: 'GitHub README Generator',
    description: 'Visual markdown profile page builder to design compelling GitHub README files.',
    icon: 'fab fa-github',
    category: 'generators',
    tags: ['github', 'readme', 'markdown', 'generators', 'profile', 'developer'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Name</label>
                        <input type="text" id="readme-name" value="Md Maruf Hossen" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-semibold">
                    </div>
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitle/Bio</label>
                        <input type="text" id="readme-subtitle" value="Expert Digital Marketer & Graphic Designer in Bangladesh" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
                    </div>
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">GitHub Username</label>
                        <input type="text" id="readme-github" value="MdMarufHossen71" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono">
                    </div>
                    <div class="flex flex-col gap-3">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual Cards options</span>
                        <div class="flex flex-col gap-2">
                            ${UI.createCheckbox('readme-show-stats', 'Show Github stats card', true)}
                            ${UI.createCheckbox('readme-show-langs', 'Show top languages card', true)}
                        </div>
                    </div>
                </div>
                ${UI.createActionRow('readme-reset', null, `
                    <button id="readme-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate README</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Export README.md Code</span>
                ${UI.createTextarea('readme-output', 'Markdown output...')}
                ${UI.createActionRow('readme-reset-output', 'readme-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const name = ic.querySelector('#readme-name');
        const sub = ic.querySelector('#readme-subtitle');
        const gh = ic.querySelector('#readme-github');
        const stats = ic.querySelector('#readme-show-stats');
        const langs = ic.querySelector('#readme-show-langs');
        
        const output = oc.querySelector('#readme-output');

        const generateReadme = () => {
            const nameVal = name.value.trim();
            const subVal = sub.value.trim();
            const ghVal = gh.value.trim();

            let md = `# Hi there, I'm ${nameVal || 'Developer'} 👋\n\n`;
            if (subVal) {
                md += `> ${subVal}\n\n`;
            }

            md += `### About Me\n- 💻 Coding cool web apps locally\n- 🚀 Scaling digital marketing campaigns\n\n`;

            if (ghVal) {
                md += `### GitHub Analytics\n\n<p align="left">\n`;
                if (stats.checked) {
                    md += `  <img src="https://github-readme-stats.vercel.app/api?username=${ghVal}&show_icons=true&theme=transparent" alt="${nameVal}'s GitHub stats" height="150" />\n`;
                }
                if (langs.checked) {
                    md += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${ghVal}&layout=compact&theme=transparent" alt="Top Languages" height="150" />\n`;
                }
                md += `</p>\n`;
            }

            output.value = md;
        };

        ic.querySelector('#readme-run').addEventListener('click', generateReadme);

        oc.querySelector('#readme-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('README Markdown Copied!');
        });

        const reset = () => {
            name.value = 'Md Maruf Hossen';
            sub.value = 'Expert Digital Marketer & Graphic Designer in Bangladesh';
            gh.value = 'MdMarufHossen71';
            stats.checked = true;
            langs.checked = true;
            generateReadme();
        };

        ic.querySelector('#readme-reset').addEventListener('click', reset);
        oc.querySelector('#readme-reset-output').addEventListener('click', reset);

        // initial
        generateReadme();
    }
});

// --------------------------------------------------------------------------
// 28. .GITIGNORE GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'gitignore-generator',
    name: '.gitignore Generator',
    description: 'Compile standardized .gitignore template structures for node, python, or editors.',
    icon: 'fas fa-ban',
    category: 'generators',
    tags: ['gitignore', 'git', 'ignore', 'exclude', 'node', 'python'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Platform Templates</span>
                    <div class="grid grid-cols-2 gap-3">
                        ${UI.createCheckbox('gi-node', 'NodeJS / React', true)}
                        ${UI.createCheckbox('gi-py', 'Python (venv)', false)}
                        ${UI.createCheckbox('gi-ds', 'macOS DS_Store', true)}
                        ${UI.createCheckbox('gi-env', '.env Configurations', true)}
                    </div>
                </div>
                ${UI.createActionRow('gi-reset', null, `
                    <button id="gi-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate .gitignore</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiled .gitignore Output</span>
                ${UI.createTextarea('gi-output', 'Rules list...')}
                ${UI.createActionRow('gi-reset-output', 'gi-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const node = ic.querySelector('#gi-node');
        const py = ic.querySelector('#gi-py');
        const ds = ic.querySelector('#gi-ds');
        const env = ic.querySelector('#gi-env');

        const output = oc.querySelector('#gi-output');

        const generateGitignore = () => {
            let rules = [];

            if (ds.checked) {
                rules.push('# macOS system files\n.DS_Store\n.AppleDouble\n.LSOverride\n');
            }

            if (env.checked) {
                rules.push('# Environments & secrets\n.env\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n*.env\n');
            }

            if (node.checked) {
                rules.push('# Dependency directories\nnode_modules/\njspm_packages/\n\n# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# Build outputs\ndist/\nbuild/\n');
            }

            if (py.checked) {
                rules.push('# Byte-compiled / optimized / DLL files\n__pycache__/\n*.py[cod]\n*$py.class\n\n# Virtual environments\nvenv/\n.venv/\nenv/\nENV/\n');
            }

            output.value = rules.join('\n');
        };

        ic.querySelector('#gi-run').addEventListener('click', generateGitignore);

        oc.querySelector('#gi-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('.gitignore template copied!');
        });

        const reset = () => {
            node.checked = true;
            py.checked = false;
            ds.checked = true;
            env.checked = true;
            generateGitignore();
        };

        ic.querySelector('#gi-reset').addEventListener('click', reset);
        oc.querySelector('#gi-reset-output').addEventListener('click', reset);

        // initial
        generateGitignore();
    }
});

// --------------------------------------------------------------------------
// 29. META TAG GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Build robust SEO meta tags (Open Graph, Twitter Cards) with a live Google search preview.',
    icon: 'fas fa-tags',
    category: 'seo',
    tags: ['seo', 'meta', 'tags', 'crawler', 'head', 'html', 'keywords'],
    featured: true,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-1 scrollbar-thin">
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Title</label>
                        <input type="text" id="meta-title" value="Md Maruf Hossen | Graphic Designer" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-semibold">
                    </div>
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Description</label>
                        <textarea id="meta-desc" placeholder="Search snippet details..." class="w-full min-h-[70px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none">Expert brand identity designer & digital marketer in Dhaka, Bangladesh.</textarea>
                    </div>
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Keywords (Comma separated)</label>
                        <input type="text" id="meta-keys" value="design, brand, marketing" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
                    </div>
                    <div class="flex flex-col gap-3">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Crawling permissions</span>
                        ${UI.createCheckbox('meta-index', 'Allow search indexing (index, follow)', true)}
                    </div>
                </div>
                ${UI.createActionRow('meta-reset', null, `
                    <button id="meta-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate HTML Tags</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Google Search Snippet Preview</span>
                    <div class="p-4 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-darkborder rounded-2xl flex flex-col gap-1 leading-normal font-sans">
                        <span class="text-[11px] text-[#4d5156] dark:text-[#bdc1c6] truncate">https://mdmarufhossen71.site</span>
                        <h3 id="prev-meta-title" class="text-lg font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer truncate">Title</h3>
                        <p id="prev-meta-desc" class="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">Description snippet...</p>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Copy Compiled Meta Tags</span>
                    ${UI.createTextarea('meta-output', 'HTML head tags...')}
                </div>
                ${UI.createActionRow('meta-reset-output', 'meta-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const title = ic.querySelector('#meta-title');
        const desc = ic.querySelector('#meta-desc');
        const keys = ic.querySelector('#meta-keys');
        const idx = ic.querySelector('#meta-index');

        const prevTitle = oc.querySelector('#prev-meta-title');
        const prevDesc = oc.querySelector('#prev-meta-desc');
        const output = oc.querySelector('#meta-output');

        const generateMeta = () => {
            const titleVal = title.value.trim();
            const descVal = desc.value.trim();
            const keysVal = keys.value.trim();

            // update live search preview
            prevTitle.textContent = titleVal || 'Site Title';
            prevDesc.textContent = descVal || 'Description snippet...';

            let tags = `<!-- Primary SEO Meta Tags -->\n`;
            if (titleVal) tags += `<title>${titleVal}</title>\n`;
            if (descVal) tags += `<meta name="description" content="${descVal}">\n`;
            if (keysVal) tags += `<meta name="keywords" content="${keysVal}">\n`;
            
            tags += `<meta name="robots" content="${idx.checked ? 'index, follow' : 'noindex, nofollow'}">\n\n`;

            tags += `<!-- Open Graph / Facebook -->\n`;
            tags += `<meta property="og:type" content="website">\n`;
            if (titleVal) tags += `<meta property="og:title" content="${titleVal}">\n`;
            if (descVal) tags += `<meta property="og:description" content="${descVal}">\n`;

            output.value = tags;
        };

        [title, desc, keys].forEach(el => el.addEventListener('input', generateMeta));
        idx.addEventListener('change', generateMeta);
        
        ic.querySelector('#meta-run').addEventListener('click', generateMeta);

        oc.querySelector('#meta-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('Meta tags HTML Copied!');
        });

        const reset = () => {
            title.value = 'Md Maruf Hossen | Graphic Designer';
            desc.value = 'Expert brand identity designer & digital marketer in Dhaka, Bangladesh.';
            keys.value = 'design, brand, marketing';
            idx.checked = true;
            generateMeta();
        };

        ic.querySelector('#meta-reset').addEventListener('click', reset);
        oc.querySelector('#meta-reset-output').addEventListener('click', reset);

        // initial
        generateMeta();
    }
});

// --------------------------------------------------------------------------
// 30. ROBOTS.TXT GENERATOR
// --------------------------------------------------------------------------
window.DEV_TOOLS_LIST.push({
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Visual form builder to compile compliant robots.txt crawler rules.',
    icon: 'fas fa-robot',
    category: 'seo',
    tags: ['robots', 'seo', 'crawler', 'googlebot', 'site', 'sitemap'],
    featured: false,
    renderInput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <div class="flex flex-col gap-4">
                    ${UI.createSelect('robot-ua', 'User Agent Target', { '*': 'All Web Crawlers (*)', 'Googlebot': 'Googlebot', 'Bingbot': 'Bingbot' })}
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Disallow Paths (One per line)</label>
                        <textarea id="robot-disallow" placeholder="/admin/\\n/private/" class="w-full min-h-[80px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none">/admin/\n/private/</textarea>
                    </div>
                    <div class="flex flex-col gap-1.5 w-full">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Sitemap URL Link</label>
                        <input type="text" id="robot-sitemap" value="https://mdmarufhossen71.site/sitemap.xml" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-darkborder rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono text-slate-500">
                    </div>
                </div>
                ${UI.createActionRow('robot-reset', null, `
                    <button id="robot-run" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">Generate robots.txt</button>
                `)}
            </div>
        `;
    },
    renderOutput: (c) => {
        c.innerHTML = `
            <div class="flex flex-col gap-4 flex-grow h-full justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated robots.txt Output</span>
                ${UI.createTextarea('robot-output', 'Robots rules...')}
                ${UI.createActionRow('robot-reset-output', 'robot-copy')}
            </div>
        `;
    },
    init: (ic, oc, app) => {
        const ua = ic.querySelector('#robot-ua');
        const disallow = ic.querySelector('#robot-disallow');
        const sitemap = ic.querySelector('#robot-sitemap');

        const output = oc.querySelector('#robot-output');

        const generateRobots = () => {
            let robot = `# Web Crawlers robots.txt file\n`;
            robot += `User-agent: ${ua.value}\n`;

            const paths = disallow.value.split('\n').filter(p => p.trim());
            if (paths.length > 0) {
                paths.forEach(p => {
                    robot += `Disallow: ${p.trim()}\n`;
                });
            } else {
                robot += `Disallow:\n`;
            }

            if (sitemap.value.trim()) {
                robot += `\nSitemap: ${sitemap.value.trim()}\n`;
            }

            output.value = robot;
        };

        ic.querySelector('#robot-run').addEventListener('click', generateRobots);

        oc.querySelector('#robot-copy').addEventListener('click', () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            app.showToast('robots.txt copied successfully!');
        });

        const reset = () => {
            ua.value = '*';
            disallow.value = '/admin/\n/private/';
            sitemap.value = 'https://mdmarufhossen71.site/sitemap.xml';
            generateRobots();
        };

        ic.querySelector('#robot-reset').addEventListener('click', reset);
        oc.querySelector('#robot-reset-output').addEventListener('click', reset);

        // initial
        generateRobots();
    }
});
