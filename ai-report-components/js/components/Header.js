/**
 * AI Report Components - Header
 * Standardized header component with navigation
 */
class AIHeader {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            brand: 'AI Learning Hub',
            brandUrl: '../../index.html',
            navItems: [],
            activeItem: null,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIHeader: Container not found');
            return;
        }
        this.loadStyles();
        this.render();
    }

    loadStyles() {
        // Load component CSS (theme is managed by ThemeManager)
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/header.css';
        document.head.appendChild(componentLink);
    }

    render() {
        this.container.innerHTML = `
            <nav class="ai-header">
                <div class="ai-header-container">
                    <a href="${this.options.brandUrl}" class="ai-header-brand">${this.options.brand}</a>
                    <ul class="ai-header-nav">
                        ${this.renderNavItems()}
                    </ul>
                </div>
            </nav>
        `;
    }

    renderNavItems() {
        return this.options.navItems.map(item => `
            <li>
                <a href="${item.url}" class="ai-header-nav-item ${item.active ? 'active' : ''}">
                    ${item.label}
                </a>
            </li>
        `).join('');
    }

    setActiveItem(itemLabel) {
        this.options.navItems.forEach(item => {
            item.active = item.label === itemLabel;
        });
        this.render();
    }

    addNavItem(item) {
        this.options.navItems.push(item);
        this.render();
    }

    removeNavItem(itemLabel) {
        this.options.navItems = this.options.navItems.filter(item => item.label !== itemLabel);
        this.render();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHeader;
}
