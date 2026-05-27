// ==========================================================================
// CORE APP CONTROLLER: DEVELOPER TOOLS SUITE
// ==========================================================================

class DevSuiteApp {
    constructor() {
        this.activeTool = null;
        this.recentlyUsedKey = 'maruf-dev-suite-recents';
        this.favoritesKey = 'maruf-dev-suite-favs';
        this.cdnRegistry = {
            marked: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
            jsyaml: 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js',
            cryptojs: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js',
            qrcode: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
            jsdiff: 'https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js'
        };
        this.loadedLibraries = new Set();
        
        // Dom Elements
        this.sidebar = document.getElementById('tools-sidebar');
        this.sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
        this.sidebarCloseBtn = document.getElementById('sidebar-close-btn');
        this.sidebarBackdrop = document.getElementById('sidebar-backdrop');
        this.searchInput = document.getElementById('global-tool-search');
        this.searchClearBtn = document.getElementById('search-clear-btn');
        
        this.init();
    }

    init() {
        // Init Event Listeners
        this.initSidebar();
        this.initSearch();
        this.initRouting();
        
        // Populate tool counts
        const allBadge = document.getElementById('badge-all-count');
        if (allBadge && window.DEV_TOOLS_LIST) {
            allBadge.textContent = window.DEV_TOOLS_LIST.length;
        }

        // Hook into theme change if triggered globally
        const observer = new MutationObserver(() => this.syncTheme());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    // --- SIDEBAR NAV SYSTEM ---
    initSidebar() {
        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener('click', () => this.toggleSidebar(true));
        }
        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener('click', () => this.toggleSidebar(false));
        }
        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener('click', () => this.toggleSidebar(false));
        }

        // Category Filter Buttons
        const catBtns = document.querySelectorAll('.cat-nav-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active', 'bg-slate-100', 'dark:bg-slate-800'));
                btn.classList.add('active', 'bg-slate-100', 'dark:bg-slate-800');
                
                // Clear search on category shift
                if (this.searchInput) {
                    this.searchInput.value = '';
                    if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
                }

                const cat = btn.getAttribute('data-cat');
                
                // Route to dashboard if currently inside a tool page
                if (window.location.hash !== '#/' && window.location.hash !== '') {
                    window.location.hash = '#/';
                    // Brief delay to allow view transition before filtering
                    setTimeout(() => this.filterTools(cat, ''), 100);
                } else {
                    this.filterTools(cat, '');
                }

                this.toggleSidebar(false);
            });
        });
    }

    toggleSidebar(isOpen) {
        if (!this.sidebar || !this.sidebarBackdrop) return;
        if (isOpen) {
            this.sidebar.classList.remove('-translate-x-full');
            this.sidebarBackdrop.classList.remove('hidden');
        } else {
            this.sidebar.classList.add('-translate-x-full');
            this.sidebarBackdrop.classList.add('hidden');
        }
    }

    // --- SEARCH SYSTEM ---
    initSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (this.searchClearBtn) {
                if (query.length > 0) {
                    this.searchClearBtn.classList.remove('hidden');
                } else {
                    this.searchClearBtn.classList.add('hidden');
                }
            }

            // Route to dashboard if searching from a tool page
            if (window.location.hash !== '#/' && window.location.hash !== '') {
                window.location.hash = '#/';
                setTimeout(() => {
                    this.filterTools('all', query);
                }, 100);
            } else {
                const activeCatBtn = document.querySelector('.cat-nav-btn.active');
                const cat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';
                this.filterTools(cat, query);
            }
        });

        if (this.searchClearBtn) {
            this.searchClearBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.searchClearBtn.classList.add('hidden');
                const activeCatBtn = document.querySelector('.cat-nav-btn.active');
                const cat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';
                this.filterTools(cat, '');
                this.searchInput.focus();
            });
        }

        const resetBtn = document.getElementById('reset-search-notfound-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.searchInput) {
                    this.searchInput.value = '';
                    if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
                }
                this.filterTools('all', '');
            });
        }
    }

    filterTools(category, query) {
        const gridList = document.getElementById('tools-grid-list');
        const notFoundCard = document.getElementById('search-not-found-card');
        const sectionTitle = document.getElementById('current-category-title');
        
        if (!gridList || !window.DEV_TOOLS_LIST) return;

        gridList.innerHTML = '';
        
        // Filter based on criteria
        let list = window.DEV_TOOLS_LIST;
        
        if (category === 'featured') {
            list = list.filter(t => t.featured);
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-star text-amber-500"></i> Featured Developer Tools`;
        } else if (category !== 'all') {
            list = list.filter(t => t.category === category);
            const catNameMap = {
                utilities: 'Developer Utilities',
                converters: 'Converters',
                styling: 'Design & Styling',
                images: 'Image Tools',
                text: 'Text & Code',
                generators: 'Generators'
            };
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-list text-primary-500"></i> ${catNameMap[category] || 'Tools'}`;
        } else {
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-list text-primary-500"></i> All Developer Tools`;
        }

        if (query) {
            list = list.filter(t => 
                t.name.toLowerCase().includes(query) || 
                t.description.toLowerCase().includes(query) || 
                t.tags.some(tag => tag.toLowerCase().includes(query))
            );
            if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-search text-primary-500"></i> Search Results for "${query}"`;
        }

        // Render Cards
        if (list.length === 0) {
            if (notFoundCard) notFoundCard.classList.remove('hidden');
        } else {
            if (notFoundCard) notFoundCard.classList.add('hidden');
            list.forEach(tool => {
                gridList.appendChild(this.createToolCard(tool));
            });
        }
    }

    createToolCard(tool) {
        const card = document.createElement('article');
        card.className = 'glassmorphism rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-primary-500/5 group';
        
        const catColors = {
            utilities: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            converters: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
            styling: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            images: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            text: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
            generators: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        };

        const catTextMap = {
            utilities: 'Utils',
            converters: 'Converter',
            styling: 'Styling',
            images: 'Image',
            text: 'Text',
            generators: 'Generator'
        };

        const catBadgeClass = catColors[tool.category] || 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        const catBadgeText = catTextMap[tool.category] || 'Tool';

        const favs = this.getFavorites();
        const isFav = favs.includes(tool.id);

        card.innerHTML = `
            <div class="flex flex-col gap-3">
                <div class="flex justify-between items-start">
                    <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase border rounded-full ${catBadgeClass}">${catBadgeText}</span>
                    <button class="card-fav-btn text-slate-300 hover:text-amber-500 dark:text-slate-700 dark:hover:text-amber-500 transition-colors" data-id="${tool.id}">
                        <i class="${isFav ? 'fas fa-star text-amber-500' : 'far fa-star'}"></i>
                    </button>
                </div>
                <h3 class="font-extrabold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors flex items-center gap-2">
                    <i class="${tool.icon} text-slate-400 group-hover:text-primary-500 transition-colors"></i>
                    ${tool.name}
                </h3>
                <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">${tool.description}</p>
            </div>
            <a href="#/${tool.id}" class="w-full text-center bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-600 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm">
                Open Tool
            </a>
        `;

        // Favorite click handle
        const favBtn = card.querySelector('.card-fav-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.toggleFavorite(tool.id, favBtn.querySelector('i'));
        });

        return card;
    }

    // --- LAZY CDN SCRIPT LOAD ENGINE ---
    loadLibrary(libName) {
        return new Promise((resolve, reject) => {
            if (this.loadedLibraries.has(libName)) {
                resolve();
                return;
            }
            
            const src = this.cdnRegistry[libName];
            if (!src) {
                reject(new Error(`Library ${libName} not registered.`));
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                this.loadedLibraries.add(libName);
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Failed to load ${libName} from ${src}`));
            };
            document.body.appendChild(script);
        });
    }

    // --- ROUTER SYSTEM ---
    initRouting() {
        const handleRoute = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/') && hash.length > 2) {
                const toolId = hash.slice(2);
                this.loadTool(toolId);
            } else {
                this.loadDashboard();
            }
        };

        window.addEventListener('hashchange', handleRoute);
        window.addEventListener('load', handleRoute);
    }

    loadDashboard() {
        this.activeTool = null;
        
        // Toggle view containers
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('view-tool-workspace').classList.add('hidden');
        
        // Reset sidebar active buttons to All if nothing is active
        const activeCatBtn = document.querySelector('.cat-nav-btn.active');
        const cat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';
        const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        
        this.filterTools(cat, query);
        this.renderRecentlyUsed();
    }

    async loadTool(toolId) {
        if (!window.DEV_TOOLS_LIST) return;
        
        const tool = window.DEV_TOOLS_LIST.find(t => t.id === toolId);
        if (!tool) {
            this.showToast('Tool not found', 'error');
            window.location.hash = '#/';
            return;
        }

        this.activeTool = tool;

        // Toggle Views
        document.getElementById('view-dashboard').classList.add('hidden');
        const workspace = document.getElementById('view-tool-workspace');
        workspace.classList.remove('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update Breadcrumbs and Header
        const catNameMap = {
            utilities: 'Developer Utilities',
            converters: 'Converters',
            styling: 'Design & Styling',
            images: 'Image Tools',
            text: 'Text & Code',
            generators: 'Generators'
        };
        
        document.getElementById('tool-breadcrumbs-cat').textContent = catNameMap[tool.category] || 'Tool';
        document.getElementById('active-tool-title').innerHTML = `<i class="${tool.icon} text-primary-500"></i> ${tool.name}`;
        document.getElementById('active-tool-desc').textContent = tool.description;

        // Sync Favorite Button Icon
        const favBtn = document.getElementById('tool-fav-btn');
        const isFav = this.getFavorites().includes(tool.id);
        if (favBtn) {
            favBtn.innerHTML = `<i class="${isFav ? 'fas fa-star text-amber-500' : 'far fa-star'}"></i>`;
            // Remove previous listeners
            const newFavBtn = favBtn.cloneNode(true);
            favBtn.parentNode.replaceChild(newFavBtn, favBtn);
            newFavBtn.addEventListener('click', () => {
                this.toggleFavorite(tool.id, newFavBtn.querySelector('i'));
            });
        }

        // Render Tool loading indicator
        const activeContainer = document.getElementById('active-tool-container');
        if (!activeContainer) return;
        
        activeContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center p-12 text-center gap-3">
                <div class="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
                <span class="text-sm font-semibold text-slate-400">Loading modules...</span>
            </div>
        `;

        try {
            // Load required external script libraries if any
            if (tool.libraries && tool.libraries.length > 0) {
                await Promise.all(tool.libraries.map(lib => this.loadLibrary(lib)));
            }

            // Render Input and Output structures
            activeContainer.innerHTML = `
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-stretch">
                    <!-- Input Section -->
                    <div id="tool-input-wrapper" class="flex flex-col gap-3">
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><i class="fas fa-arrow-right-to-bracket text-primary-500"></i> Input</h3>
                        <div id="tool-input-area" class="w-full flex-1 min-h-[300px] bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-darkborder rounded-2xl p-5 flex flex-col gap-4"></div>
                    </div>
                    
                    <!-- Output Section -->
                    <div id="tool-output-wrapper" class="flex flex-col gap-3">
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><i class="fas fa-arrow-right-from-bracket text-emerald-500"></i> Output</h3>
                        <div id="tool-output-area" class="w-full flex-1 min-h-[300px] bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-darkborder rounded-2xl p-5 flex flex-col gap-4 justify-between"></div>
                    </div>
                </div>
            `;

            const inputArea = document.getElementById('tool-input-area');
            const outputArea = document.getElementById('tool-output-area');

            // Invoke tool renderings and initialization
            if (tool.renderInput) tool.renderInput(inputArea);
            if (tool.renderOutput) tool.renderOutput(outputArea);
            if (tool.init) tool.init(inputArea, outputArea, this);

            // Log tool in recents
            this.logRecent(tool.id);

        } catch (error) {
            console.error(error);
            activeContainer.innerHTML = `
                <div class="glassmorphism rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-rose-500/25">
                    <div class="bg-rose-500/10 text-rose-500 text-3xl w-14 h-14 rounded-full flex items-center justify-center"><i class="fas fa-triangle-exclamation"></i></div>
                    <h3 class="font-extrabold text-slate-900 dark:text-white">Module Load Failure</h3>
                    <p class="text-xs text-slate-400 max-w-sm">Failed to download external dependencies. Check your network connection and try again.</p>
                    <a href="#/" class="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow">Return to Dashboard</a>
                </div>
            `;
            this.showToast('Module download failure', 'error');
        }
    }

    // --- FAVORITES TRACKER ---
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(this.favoritesKey)) || [];
        } catch {
            return [];
        }
    }

    toggleFavorite(toolId, iconElement) {
        let favs = this.getFavorites();
        const index = favs.indexOf(toolId);
        
        if (index > -1) {
            favs.splice(index, 1);
            if (iconElement) iconElement.className = 'far fa-star';
            this.showToast('Removed from favorites', 'info');
        } else {
            favs.push(toolId);
            if (iconElement) iconElement.className = 'fas fa-star text-amber-500';
            this.showToast('Added to favorites', 'success');
        }

        localStorage.setItem(this.favoritesKey, JSON.stringify(favs));
    }

    // --- RECENTLY USED SYSTEM ---
    getRecents() {
        try {
            return JSON.parse(localStorage.getItem(this.recentlyUsedKey)) || [];
        } catch {
            return [];
        }
    }

    logRecent(toolId) {
        let recents = this.getRecents();
        // Remove duplicate if already logged
        recents = recents.filter(id => id !== toolId);
        // Push to top
        recents.unshift(toolId);
        // Cap at 3 items
        recents = recents.slice(0, 3);
        
        localStorage.setItem(this.recentlyUsedKey, JSON.stringify(recents));
    }

    renderRecentlyUsed() {
        const container = document.getElementById('section-recently-used');
        const grid = document.getElementById('recently-used-grid');
        
        if (!container || !grid || !window.DEV_TOOLS_LIST) return;

        const recents = this.getRecents();
        const recentToolsList = recents
            .map(id => window.DEV_TOOLS_LIST.find(t => t.id === id))
            .filter(Boolean); // discard missing entries

        if (recentToolsList.length === 0) {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
            grid.innerHTML = '';
            recentToolsList.forEach(tool => {
                grid.appendChild(this.createToolCard(tool));
            });
        }
    }

    // --- TOAST ENGINE SYSTEM ---
    showToast(message, type = 'success') {
        const container = document.getElementById('global-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'flex items-center gap-3 bg-white dark:bg-darkcard border border-slate-200/80 dark:border-darkborder px-4 py-3 rounded-2xl shadow-xl transform translate-y-6 opacity-0 transition-all duration-300 pointer-events-auto max-w-sm';
        
        const icons = {
            success: '<i class="fas fa-check-circle text-emerald-500 text-lg"></i>',
            error: '<i class="fas fa-circle-xmark text-rose-500 text-lg"></i>',
            info: '<i class="fas fa-info-circle text-blue-500 text-lg"></i>'
        };

        toast.innerHTML = `
            ${icons[type] || icons.success}
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">${message}</span>
        `;

        container.appendChild(toast);

        // Slide Up entry
        setTimeout(() => {
            toast.classList.remove('translate-y-6', 'opacity-0');
        }, 50);

        // Slide Down exit & remove
        setTimeout(() => {
            toast.classList.add('translate-y-6', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Theme sync helper
    syncTheme() {
        // Tailwind automatically handles color updates based on class/selector in config!
    }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
    window.DevSuiteAppInstance = new DevSuiteApp();
});
