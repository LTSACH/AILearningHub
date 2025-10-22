/**
 * AI Report Components - Confusion Matrix
 * Interactive confusion matrix visualization
 */
class AIConfusionMatrix {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showHeatmap: true,
            showStatistics: true,
            showClassNames: true,
            colorScheme: 'blues',
            ...options
        };
        this.data = null;
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIConfusionMatrix: Container not found');
            return;
        }
        this.loadStyles();
    }

    loadStyles() {
        // Load component CSS
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/confusion-matrix.css';
        document.head.appendChild(componentLink);
    }

    loadData(data) {
        this.data = data;
        this.render();
    }

    render() {
        if (!this.data) return;

        this.container.innerHTML = `
            <div class="confusion-matrix-container">
                <div class="confusion-matrix-header">
                    <h3>Confusion Matrix</h3>
                    <div class="confusion-matrix-controls">
                        <button class="toggle-normalized" onclick="this.toggleNormalized()">
                            Toggle Normalized
                        </button>
                    </div>
                </div>
                <div class="confusion-matrix-content">
                    ${this.renderMatrix()}
                    ${this.options.showStatistics ? this.renderStatistics() : ''}
                </div>
            </div>
        `;
    }

    renderMatrix() {
        const matrix = this.data.matrix;
        const classNames = this.data.class_names;
        const normalized = this.data.normalized;

        let matrixHtml = '<div class="confusion-matrix-table">';
        
        // Header row
        matrixHtml += '<div class="confusion-matrix-row header">';
        matrixHtml += '<div class="confusion-matrix-cell header">Actual</div>';
        for (let i = 0; i < classNames.length; i++) {
            matrixHtml += `<div class="confusion-matrix-cell header">${classNames[i]}</div>`;
        }
        matrixHtml += '</div>';

        // Data rows
        for (let i = 0; i < matrix.length; i++) {
            matrixHtml += '<div class="confusion-matrix-row">';
            matrixHtml += `<div class="confusion-matrix-cell header">${classNames[i]}</div>`;
            
            for (let j = 0; j < matrix[i].length; j++) {
                const value = normalized ? (matrix[i][j] * 100).toFixed(1) + '%' : matrix[i][j];
                const intensity = normalized ? matrix[i][j] : matrix[i][j] / Math.max(...matrix.flat());
                const cellClass = `confusion-matrix-cell intensity-${Math.floor(intensity * 10)}`;
                
                matrixHtml += `<div class="${cellClass}" title="Actual: ${classNames[i]}, Predicted: ${classNames[j]}">${value}</div>`;
            }
            matrixHtml += '</div>';
        }
        
        matrixHtml += '</div>';
        return matrixHtml;
    }

    renderStatistics() {
        const matrix = this.data.matrix;
        const classNames = this.data.class_names;
        
        // Calculate per-class metrics
        const metrics = classNames.map((className, i) => {
            const tp = matrix[i][i];
            const fp = matrix.reduce((sum, row, j) => sum + (j !== i ? row[i] : 0), 0);
            const fn = matrix[i].reduce((sum, val, j) => sum + (j !== i ? val : 0), 0);
            
            const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
            const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
            const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
            
            return {
                class: className,
                precision: precision.toFixed(3),
                recall: recall.toFixed(3),
                f1: f1.toFixed(3)
            };
        });

        return `
            <div class="confusion-statistics">
                <h4>Per-Class Metrics</h4>
                <div class="metrics-table">
                    <div class="metrics-header">
                        <div>Class</div>
                        <div>Precision</div>
                        <div>Recall</div>
                        <div>F1-Score</div>
                    </div>
                    ${metrics.map(metric => `
                        <div class="metrics-row">
                            <div class="class-name">${metric.class}</div>
                            <div class="metric-value">${metric.precision}</div>
                            <div class="metric-value">${metric.recall}</div>
                            <div class="metric-value">${metric.f1}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    toggleNormalized() {
        this.data.normalized = !this.data.normalized;
        this.render();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIConfusionMatrix;
}