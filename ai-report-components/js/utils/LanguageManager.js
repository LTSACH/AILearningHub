/**
 * AI Report Components - Language Manager
 * Centralized language management system
 */
class AILanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.availableLangs = ['en', 'vi'];
        this.languageChangeCallbacks = [];
        this.init();
    }

    init() {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem('ai-language');
        if (savedLang && this.availableLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        }
        
        // Apply language on page load
        this.applyLanguage(this.currentLang);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getAvailableLanguages() {
        return this.availableLangs;
    }

    setLanguage(langCode) {
        if (!this.availableLangs.includes(langCode)) {
            console.warn(`Language '${langCode}' not available. Available languages:`, this.availableLangs);
            return false;
        }

        this.currentLang = langCode;
        localStorage.setItem('ai-language', langCode);
        this.applyLanguage(langCode);
        
        // Notify all callbacks
        this.languageChangeCallbacks.forEach(callback => {
            callback(langCode);
        });

        return true;
    }

    applyLanguage(langCode) {
        // Update all elements with data attributes
        document.querySelectorAll('[data-en]').forEach(el => {
            const enText = el.getAttribute('data-en');
            const viText = el.getAttribute('data-vi');
            
            if (langCode === 'vi' && viText) {
                el.textContent = viText;
            } else if (langCode === 'en' && enText) {
                el.textContent = enText;
            }
        });

        // Update body class for language-specific styling
        document.body.className = document.body.className.replace(/ai-lang-\w+/g, '');
        document.body.classList.add(`ai-lang-${langCode}`);
    }

    onLanguageChange(callback) {
        this.languageChangeCallbacks.push(callback);
    }

    offLanguageChange(callback) {
        const index = this.languageChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.languageChangeCallbacks.splice(index, 1);
        }
    }

    // Create language switcher UI
    createLanguageSwitcher(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="ai-language-switcher">
                <button class="ai-lang-btn ${this.currentLang === 'en' ? 'active' : ''}" 
                        data-lang="en" title="English">
                    🇺🇸 EN
                </button>
                <button class="ai-lang-btn ${this.currentLang === 'vi' ? 'active' : ''}" 
                        data-lang="vi" title="Tiếng Việt">
                    🇻🇳 VI
                </button>
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.ai-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
                
                // Update button states
                container.querySelectorAll('.ai-lang-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // Auto-detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language.split('-')[0];
        if (this.availableLangs.includes(browserLang)) {
            return browserLang;
        }
        return 'en'; // Default to English
    }

    // Apply browser language preference
    applyBrowserLanguage() {
        const browserLang = this.detectBrowserLanguage();
        this.setLanguage(browserLang);
    }

    // Get language-specific text
    getText(key, lang = this.currentLang) {
        // This can be extended for more complex translation systems
        return key;
    }
}

// Create global instance
window.AILanguageManager = new AILanguageManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AILanguageManager;
}
