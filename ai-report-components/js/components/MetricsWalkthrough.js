/**
 * AI Report Components - Metrics Walkthrough
 * Interactive metrics explanation and formulas
 */
class AIMetricsWalkthrough {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showFormulas: true,
            showExamples: true,
            showCalculations: true,
            ...options
        };
        this.data = null;
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIMetricsWalkthrough: Container not found');
            return;
        }
        this.loadStyles();
    }

    loadStyles() {
        // Load component CSS
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/metrics-walkthrough.css';
        document.head.appendChild(componentLink);
    }

    loadData(data) {
        this.data = data;
        this.render();
    }

    render() {
        if (!this.data) return;

        this.container.innerHTML = `
            <div class="metrics-walkthrough-container">
                <div class="metrics-walkthrough-header">
                    <h3>Metrics Walkthrough</h3>
                    <p>Understanding the key metrics used to evaluate model performance</p>
                </div>
                <div class="metrics-walkthrough-content">
                    ${this.renderMetrics()}
                </div>
            </div>
        `;
    }

    renderMetrics() {
        const metrics = Object.keys(this.data);
        
        return metrics.map(metricName => {
            const metric = this.data[metricName];
            return `
                <div class="metric-card">
                    <div class="metric-header">
                        <h4>${metricName.charAt(0).toUpperCase() + metricName.slice(1).replace('_', ' ')}</h4>
                        <div class="metric-icon">📊</div>
                    </div>
                    <div class="metric-content">
                        <div class="metric-explanation">
                            <p><strong>What it measures:</strong> ${metric.explanation}</p>
                        </div>
                        ${this.options.showFormulas ? `
                            <div class="metric-formula">
                                <h5>Formula:</h5>
                                <div class="formula-box">
                                    <code>${metric.formula}</code>
                                </div>
                            </div>
                        ` : ''}
                        ${this.options.showCalculations ? `
                            <div class="metric-calculation">
                                <h5>Calculation:</h5>
                                <div class="calculation-box">
                                    <code>${metric.calculation}</code>
                                </div>
                            </div>
                        ` : ''}
                        ${this.options.showExamples ? this.renderExample(metricName, metric) : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderExample(metricName, metric) {
        // Mock example data
        const examples = {
            'accuracy': {
                scenario: '37-class pet breed classification',
                example: 'Correctly predicted 3,520 out of 3,700 test samples',
                calculation: '3,520 / 3,700 = 0.952 (95.2%)'
            },
            'precision': {
                scenario: 'Bengal cat classification',
                example: 'Predicted 45 Bengal cats, 43 were actually Bengal',
                calculation: '43 / 45 = 0.956 (95.6%)'
            },
            'recall': {
                scenario: 'Bengal cat classification',
                example: '45 actual Bengal cats, model found 43',
                calculation: '43 / 45 = 0.956 (95.6%)'
            },
            'f1_score': {
                scenario: 'Bengal cat classification',
                example: 'Precision: 0.956, Recall: 0.956',
                calculation: '2 × (0.956 × 0.956) / (0.956 + 0.956) = 0.956'
            }
        };

        const example = examples[metricName];
        if (!example) return '';

        return `
            <div class="metric-example">
                <h5>Example:</h5>
                <div class="example-scenario">
                    <strong>Scenario:</strong> ${example.scenario}
                </div>
                <div class="example-description">
                    ${example.example}
                </div>
                <div class="example-calculation">
                    <strong>Calculation:</strong> ${example.calculation}
                </div>
            </div>
        `;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIMetricsWalkthrough;
}
