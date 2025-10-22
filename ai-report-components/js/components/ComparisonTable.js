/**
 * AI Report Components - Comparison Table
 * Standardized comparison table component with interactive features
 */
class AIComparisonTable {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            theme: 'default',
            showTabs: true,
            showMetrics: true,
            showWalkthrough: false,
            ...options
        };
        this.data = null;
        this.currentTab = null;
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIComparisonTable: Container not found');
            return;
        }
        this.loadStyles();
    }

    loadStyles() {
        // Load theme CSS
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = `ai-report-components/css/themes/${this.options.theme}.css`;
        document.head.appendChild(themeLink);

        // Load component CSS
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'ai-report-components/css/components/comparison.css';
        document.head.appendChild(componentLink);
    }

    loadData(data) {
        this.data = data;
        this.render();
    }

    render() {
        if (!this.data) return;

        this.container.innerHTML = `
            <div class="ai-comparison-container">
                <div class="ai-comparison-header">
                    <h2 class="ai-comparison-title">Model Comparison</h2>
                    ${this.options.showTabs ? this.renderTabs() : ''}
                </div>
                <div class="ai-comparison-content">
                    ${this.renderTable()}
                    ${this.options.showMetrics ? this.renderMetrics() : ''}
                    ${this.options.showWalkthrough ? this.renderWalkthrough() : ''}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderTabs() {
        const tabs = Object.keys(this.data);
        return `
            <div class="ai-comparison-tabs">
                ${tabs.map(tab => `
                    <button class="ai-comparison-tab ${tab === this.currentTab ? 'active' : ''}" 
                            data-tab="${tab}">
                        ${this.formatTabName(tab)}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderTable() {
        if (!this.currentTab && this.data) {
            this.currentTab = Object.keys(this.data)[0];
        }

        const tabData = this.data[this.currentTab];
        if (!tabData) return '';

        return `
            <table class="ai-comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        ${Object.keys(tabData).map(model => `<th>${model}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this.renderTableRows(tabData)}
                </tbody>
            </table>
        `;
    }

    renderTableRows(tabData) {
        const metrics = this.extractMetrics(tabData);
        return metrics.map(metric => `
            <tr>
                <td><strong>${metric.name}</strong></td>
                ${Object.values(tabData).map(values => {
                    const value = values[metric.key];
                    const formatted = this.formatMetricValue(value, metric.type);
                    const highlight = this.getMetricHighlight(value, metric);
                    return `<td class="${highlight}">${formatted}</td>`;
                }).join('')}
            </tr>
        `).join('');
    }

    renderMetrics() {
        const summary = this.calculateSummary();
        return `
            <div class="ai-comparison-metrics">
                <div class="ai-comparison-metric-card">
                    <div class="ai-comparison-metric-label">Best Model</div>
                    <div class="ai-comparison-metric-value">${summary.bestModel}</div>
                </div>
                <div class="ai-comparison-metric-card">
                    <div class="ai-comparison-metric-label">Best Accuracy</div>
                    <div class="ai-comparison-metric-value">${summary.bestAccuracy}%</div>
                </div>
                <div class="ai-comparison-metric-card">
                    <div class="ai-comparison-metric-label">Models Compared</div>
                    <div class="ai-comparison-metric-value">${summary.modelCount}</div>
                </div>
            </div>
        `;
    }

    renderWalkthrough() {
        return `
            <div class="ai-comparison-walkthrough">
                <div class="ai-comparison-walkthrough-header">
                    <h3 class="ai-comparison-walkthrough-title">How to Read This Table</h3>
                    <div class="ai-comparison-walkthrough-controls">
                        <button class="ai-comparison-walkthrough-btn" id="prev-step">Previous</button>
                        <button class="ai-comparison-walkthrough-btn" id="next-step">Next</button>
                    </div>
                </div>
                <div class="ai-comparison-progress">
                    <div class="ai-comparison-progress-fill" style="width: 0%"></div>
                </div>
                <div class="ai-comparison-progress-text">Step 1 of 3</div>
                <div class="ai-comparison-step active">
                    <h4>Understanding Metrics</h4>
                    <p>Each row represents a different performance metric. Higher values are generally better for accuracy, precision, recall, and F1-score.</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Tab switching
        this.container.querySelectorAll('.ai-comparison-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Walkthrough controls
        if (this.options.showWalkthrough) {
            const prevBtn = this.container.querySelector('#prev-step');
            const nextBtn = this.container.querySelector('#next-step');
            
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        this.render();
    }

    extractMetrics(tabData) {
        const firstModel = Object.values(tabData)[0];
        return Object.keys(firstModel).map(key => ({
            key,
            name: this.formatMetricName(key),
            type: this.getMetricType(key)
        }));
    }

    formatMetricName(key) {
        const names = {
            'accuracy': 'Accuracy',
            'precision': 'Precision',
            'recall': 'Recall',
            'f1_score': 'F1-Score',
            'training_time': 'Training Time',
            'prediction_time': 'Prediction Time',
            'memory_usage': 'Memory Usage'
        };
        return names[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatMetricValue(value, type) {
        if (type === 'percentage') {
            return `${(value * 100).toFixed(2)}%`;
        } else if (type === 'time') {
            return `${value.toFixed(2)}s`;
        } else if (type === 'memory') {
            return `${value.toFixed(2)}MB`;
        }
        return value.toFixed(4);
    }

    getMetricType(key) {
        if (['accuracy', 'precision', 'recall', 'f1_score'].includes(key)) {
            return 'percentage';
        } else if (['training_time', 'prediction_time'].includes(key)) {
            return 'time';
        } else if (key === 'memory_usage') {
            return 'memory';
        }
        return 'number';
    }

    getMetricHighlight(value, metric) {
        if (metric.type === 'percentage') {
            if (value >= 0.9) return 'ai-metric-best';
            if (value >= 0.8) return 'ai-metric-good';
            if (value >= 0.7) return 'ai-metric-warning';
            return 'ai-metric-error';
        } else if (metric.type === 'time') {
            if (value <= 1) return 'ai-metric-best';
            if (value <= 5) return 'ai-metric-good';
            if (value <= 10) return 'ai-metric-warning';
            return 'ai-metric-error';
        }
        return '';
    }

    calculateSummary() {
        const allModels = Object.values(this.data[this.currentTab] || {});
        const bestModel = this.findBestModel();
        const bestAccuracy = this.getBestAccuracy();
        
        return {
            bestModel,
            bestAccuracy: (bestAccuracy * 100).toFixed(2),
            modelCount: allModels.length
        };
    }

    findBestModel() {
        const models = Object.keys(this.data[this.currentTab] || {});
        let bestModel = models[0];
        let bestScore = 0;

        models.forEach(model => {
            const data = this.data[this.currentTab][model];
            const score = (data.accuracy || 0) + (data.f1_score || 0);
            if (score > bestScore) {
                bestScore = score;
                bestModel = model;
            }
        });

        return bestModel;
    }

    getBestAccuracy() {
        const models = Object.values(this.data[this.currentTab] || {});
        return Math.max(...models.map(model => model.accuracy || 0));
    }

    formatTabName(tab) {
        return tab.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Walkthrough methods
    prevStep() {
        // Implementation for previous step
        console.log('Previous step');
    }

    nextStep() {
        // Implementation for next step
        console.log('Next step');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIComparisonTable;
}
