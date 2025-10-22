/**
 * AI Report Components - Theme Manager
 * Centralized theme management system
 */
class AIThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.availableThemes = ['default', 'dark', 'minimal'];
        this.themeChangeCallbacks = [];
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('ai-theme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        }
        
        // Apply theme on page load
        this.applyTheme(this.currentTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return this.availableThemes;
    }

    setTheme(themeName) {
        if (!this.availableThemes.includes(themeName)) {
            console.warn(`Theme '${themeName}' not available. Available themes:`, this.availableThemes);
            return false;
        }

        this.currentTheme = themeName;
        localStorage.setItem('ai-theme', themeName);
        this.applyTheme(themeName);
        
        // Notify all callbacks
        this.themeChangeCallbacks.forEach(callback => {
            callback(themeName);
        });

        return true;
    }

    applyTheme(themeName) {
        // Remove existing theme links
        const existingThemeLinks = document.querySelectorAll('link[data-ai-theme]');
        existingThemeLinks.forEach(link => link.remove());

        // Add new theme link
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = `https://ltsach.github.io/AILearningHub/ai-report-components/css/themes/${themeName}.css`;
        themeLink.setAttribute('data-ai-theme', themeName);
        document.head.appendChild(themeLink);

        // Update body class for theme-specific styling
        document.body.className = document.body.className.replace(/ai-theme-\w+/g, '');
        document.body.classList.add(`ai-theme-${themeName}`);
    }

    onThemeChange(callback) {
        this.themeChangeCallbacks.push(callback);
    }

    offThemeChange(callback) {
        const index = this.themeChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.themeChangeCallbacks.splice(index, 1);
        }
    }

    // Theme-specific utilities
    getThemeColors(themeName = this.currentTheme) {
        const colors = {
            default: {
                primary: '#667eea',
                primaryLight: '#8b9cf6',
                primaryDark: '#4c63d2',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            dark: {
                primary: '#8b5cf6',
                primaryLight: '#a78bfa',
                primaryDark: '#7c3aed',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            minimal: {
                primary: '#2563eb',
                primaryLight: '#3b82f6',
                primaryDark: '#1d4ed8',
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                info: '#0891b2'
            }
        };
        return colors[themeName] || colors.default;
    }

    // Create theme selector UI
    createThemeSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="ai-theme-selector">
                <label for="ai-theme-select">Theme:</label>
                <select id="ai-theme-select" class="ai-theme-select">
                    ${this.availableThemes.map(theme => `
                        <option value="${theme}" ${theme === this.currentTheme ? 'selected' : ''}>
                            ${theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;

        // Add event listener
        const select = container.querySelector('#ai-theme-select');
        select.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
    }

    // Auto-detect system preference
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'default';
    }

    // Apply system theme preference
    applySystemTheme() {
        const systemTheme = this.detectSystemTheme();
        this.setTheme(systemTheme);
    }
}

// Create global instance
window.AIThemeManager = new AIThemeManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIThemeManager;
}
