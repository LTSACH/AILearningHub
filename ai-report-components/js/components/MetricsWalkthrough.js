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

    renderFormulas() {
        const formulasContent = `
            <div class="formulas-content">
                <!-- Classification Metrics -->
                <div class="config-card" style="margin-bottom: 1.5rem;">
                    <h4>📊 Classification Metrics</h4>
                    <div style="line-height: 2.2;">
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>Accuracy:</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}} = \\frac{\\sum_{i=1}^{n} \\text{CM}[i,i]}{\\text{Total Samples}} \\)
                            </span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>Precision (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Precision}_i = \\frac{\\text{TP}_i}{\\text{TP}_i + \\text{FP}_i} = \\frac{\\text{CM}[i,i]}{\\sum_{j=1}^{n} \\text{CM}[j,i]} \\)
                            </span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>Recall (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Recall}_i = \\frac{\\text{TP}_i}{\\text{TP}_i + \\text{FN}_i} = \\frac{\\text{CM}[i,i]}{\\sum_{j=1}^{n} \\text{CM}[i,j]} \\)
                            </span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>F1-Score (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{F1}_i = \\frac{2 \\times \\text{Precision}_i \\times \\text{Recall}_i}{\\text{Precision}_i + \\text{Recall}_i} = \\frac{2 \\times \\text{CM}[i,i]}{\\text{Support}_i + \\text{Predicted}_i} \\)
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Averaging Methods -->
                <div class="config-card" style="margin-bottom: 1.5rem;">
                    <h4>📈 Averaging Methods</h4>
                    <div style="line-height: 2.2;">
                        <div style="padding: 0.75rem; background: #f0f4ff; border-radius: 8px; margin-bottom: 0.5rem; border-left: 4px solid #667eea;">
                            <strong>Macro Average:</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Metric}_{\\text{macro}} = \\frac{1}{n} \\sum_{i=1}^{n} \\text{Metric}_i \\)
                            </span><br>
                            <span style="font-size: 0.85rem; color: #666;">Equal weight to each class (good for imbalanced datasets)</span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #f0fff4; border-radius: 8px; margin-bottom: 0.5rem; border-left: 4px solid #10b981;">
                            <strong>Weighted Average:</strong><br>
                            <span style="font-size: 1.1rem; color: #10b981;">
                                \\( \\text{Metric}_{\\text{weighted}} = \\frac{\\sum_{i=1}^{n} \\text{Metric}_i \\times \\text{Support}_i}{\\sum_{i=1}^{n} \\text{Support}_i} \\)
                            </span><br>
                            <span style="font-size: 0.85rem; color: #666;">Weight by class frequency (reflects overall performance)</span>
                        </div>
                    </div>
                </div>
                
                <!-- Confusion Matrix Components -->
                <div class="config-card">
                    <h4>🎯 Confusion Matrix Components</h4>
                    <div style="line-height: 2.2;">
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>Support (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Support}_i = \\sum_{j=1}^{n} \\text{CM}[i,j] \\)
                            </span><br>
                            <span style="font-size: 0.85rem; color: #666;">Total actual instances of class i (row sum)</span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; margin-bottom: 0.5rem;">
                            <strong>Predicted (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #667eea;">
                                \\( \\text{Predicted}_i = \\sum_{j=1}^{n} \\text{CM}[j,i] \\)
                            </span><br>
                            <span style="font-size: 0.85rem; color: #666;">Total predicted instances of class i (column sum)</span>
                        </div>
                        
                        <div style="padding: 0.75rem; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #10b981;">
                            <strong>True Positives (per class i):</strong><br>
                            <span style="font-size: 1.1rem; color: #10b981;">
                                \\( \\text{TP}_i = \\text{CM}[i,i] \\)
                            </span><br>
                            <span style="font-size: 0.85rem; color: #666;">Diagonal element (correctly predicted instances)</span>
                        </div>
                    </div>
                </div>
                
                <!-- Note -->
                <div style="background: #fff3cd; color: #856404; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; border-left: 4px solid #ffc107;">
                    <strong>💡 Note:</strong> All formulas use the confusion matrix (CM) as the primary data structure. 
                    For multi-class classification with <em>n</em> classes, CM is an <em>n × n</em> matrix where CM[i,j] represents 
                    the number of samples with true label <em>i</em> predicted as label <em>j</em>.
                </div>
            </div>
        `;
        
        this.container.querySelector('.formulas-content').innerHTML = formulasContent;
        
        // Re-render MathJax
        if (window.MathJax) {
            window.MathJax.typesetPromise([this.container.querySelector('.formulas-content')]);
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIMetricsWalkthrough;
}
