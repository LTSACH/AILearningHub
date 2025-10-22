/**
 * AI Report Components - Hero Section
 * Standardized hero section with stats
 */
class AIHero {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: 'Project Title',
            subtitle: 'Project description',
            stats: [],
            gradient: true,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIHero: Container not found');
            return;
        }
        this.loadStyles();
        this.render();
    }

    loadStyles() {
        // Load component CSS (theme is already loaded in HTML)
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/hero.css';
        document.head.appendChild(componentLink);
    }

    render() {
        const gradientClass = this.options.gradient ? 'ai-hero-gradient' : '';
        
        this.container.innerHTML = `
            <section class="ai-hero ${gradientClass}">
                <div class="ai-hero-container">
                    <h1 class="ai-hero-title">${this.options.title}</h1>
                    <p class="ai-hero-subtitle">${this.options.subtitle}</p>
                    ${this.options.stats.length > 0 ? this.renderStats() : ''}
                </div>
            </section>
        `;
    }

    renderStats() {
        return `
            <div class="ai-hero-stats">
                ${this.options.stats.map(stat => `
                    <div class="ai-hero-stat">
                        <div class="ai-hero-stat-value">${stat.value}</div>
                        <div class="ai-hero-stat-label">${stat.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateTitle(title) {
        this.options.title = title;
        this.render();
    }

    updateSubtitle(subtitle) {
        this.options.subtitle = subtitle;
        this.render();
    }

    updateStats(stats) {
        this.options.stats = stats;
        this.render();
    }

    addStat(stat) {
        this.options.stats.push(stat);
        this.render();
    }

    removeStat(index) {
        this.options.stats.splice(index, 1);
        this.render();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHero;
}
