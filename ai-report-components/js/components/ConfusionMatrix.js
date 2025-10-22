/**
 * AI Report Components - Confusion Matrix
 * Interactive confusion matrix with walkthrough and metrics
 */
class AIConfusionMatrix {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            theme: 'default',
            showMetrics: true,
            showWalkthrough: true,
            interactive: true,
            ...options
        };
        this.data = null;
        this.currentStep = 0;
        this.totalSteps = 3;
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
        // Load theme CSS
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = `ai-report-components/css/themes/${this.options.theme}.css`;
        document.head.appendChild(themeLink);

        // Load component CSS
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'ai-report-components/css/components/confusion-matrix.css';
        document.head.appendChild(componentLink);
    }

    loadData(data) {
        this.data = data;
        this.render();
    }

    render() {
        if (!this.data) return;

        this.container.innerHTML = `
            <div class="ai-cm-container">
                <div class="ai-cm-header">
                    <h2 class="ai-cm-title">Confusion Matrix</h2>
                </div>
                <div class="ai-cm-content">
                    ${this.renderMatrix()}
                    ${this.options.showMetrics ? this.renderMetrics() : ''}
                    ${this.options.showWalkthrough ? this.renderWalkthrough() : ''}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderMatrix() {
        const { matrix, labels } = this.data;
        const size = matrix.length;

        return `
            <div class="ai-cm-matrix">
                <table class="ai-cm-table">
                    <thead>
                        <tr>
                            <th></th>
                            ${labels.map(label => `<th>Predicted ${label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${matrix.map((row, i) => `
                            <tr>
                                <th>Actual ${labels[i]}</th>
                                ${row.map((cell, j) => {
                                    const highlight = this.getCellHighlight(cell, i, j, matrix);
                                    return `<td class="${highlight}" data-row="${i}" data-col="${j}">${cell}</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderMetrics() {
        const metrics = this.calculateMetrics();
        
        return `
            <div class="ai-cm-metrics">
                <div class="ai-cm-metric-card">
                    <div class="ai-cm-metric-label">Precision</div>
                    <div class="ai-cm-metric-value ai-cm-metric-precision">${metrics.precision.toFixed(3)}</div>
                </div>
                <div class="ai-cm-metric-card">
                    <div class="ai-cm-metric-label">Recall</div>
                    <div class="ai-cm-metric-value ai-cm-metric-recall">${metrics.recall.toFixed(3)}</div>
                </div>
                <div class="ai-cm-metric-card">
                    <div class="ai-cm-metric-label">F1-Score</div>
                    <div class="ai-cm-metric-value ai-cm-metric-f1">${metrics.f1Score.toFixed(3)}</div>
                </div>
                <div class="ai-cm-metric-card">
                    <div class="ai-cm-metric-label">Support</div>
                    <div class="ai-cm-metric-value ai-cm-metric-support">${metrics.support}</div>
                </div>
            </div>
        `;
    }

    renderWalkthrough() {
        return `
            <div class="ai-cm-walkthrough">
                <div class="ai-cm-walkthrough-header">
                    <h3 class="ai-cm-walkthrough-title">Understanding the Confusion Matrix</h3>
                    <div class="ai-cm-walkthrough-controls">
                        <button class="ai-cm-walkthrough-btn" id="cm-prev-step" ${this.currentStep === 0 ? 'disabled' : ''}>Previous</button>
                        <button class="ai-cm-walkthrough-btn" id="cm-next-step" ${this.currentStep === this.totalSteps - 1 ? 'disabled' : ''}>Next</button>
                    </div>
                </div>
                <div class="ai-cm-progress">
                    <div class="ai-cm-progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                </div>
                <div class="ai-cm-progress-text">Step ${this.currentStep + 1} of ${this.totalSteps}</div>
                ${this.renderWalkthroughStep()}
            </div>
        `;
    }

    renderWalkthroughStep() {
        const steps = [
            {
                title: "What is a Confusion Matrix?",
                description: "A confusion matrix shows how well your model performs by comparing actual vs predicted values. The diagonal shows correct predictions, off-diagonal shows errors."
            },
            {
                title: "Reading the Matrix",
                description: "Each cell shows the count of predictions. Green cells (diagonal) are correct predictions. Red/orange cells are prediction errors."
            },
            {
                title: "Understanding Metrics",
                description: "Precision: How many of the predicted positives were actually positive. Recall: How many of the actual positives were correctly predicted. F1-Score: Harmonic mean of precision and recall."
            }
        ];

        const step = steps[this.currentStep];
        return `
            <div class="ai-cm-step active">
                <h4 class="ai-cm-step-title">${step.title}</h4>
                <p class="ai-cm-step-description">${step.description}</p>
                <div class="ai-cm-step-code">
                    ${this.getStepCode()}
                </div>
            </div>
        `;
    }

    getStepCode() {
        const codes = [
            `# Confusion Matrix shows actual vs predicted
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_true, y_pred)`,
            `# Reading the matrix
# Diagonal: Correct predictions
# Off-diagonal: Misclassifications
# Row i, Column j: Actual class i predicted as class j`,
            `# Calculate metrics
from sklearn.metrics import precision_score, recall_score, f1_score
precision = precision_score(y_true, y_pred, average='weighted')
recall = recall_score(y_true, y_pred, average='weighted')
f1 = f1_score(y_true, y_pred, average='weighted')`
        ];
        return codes[this.currentStep] || '';
    }

    attachEventListeners() {
        // Walkthrough controls
        const prevBtn = this.container.querySelector('#cm-prev-step');
        const nextBtn = this.container.querySelector('#cm-next-step');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());

        // Interactive matrix cells
        if (this.options.interactive) {
            this.container.querySelectorAll('.ai-cm-table td[data-row]').forEach(cell => {
                cell.addEventListener('click', (e) => this.highlightCell(e.target));
                cell.addEventListener('mouseenter', (e) => this.hoverCell(e.target));
                cell.addEventListener('mouseleave', (e) => this.unhoverCell(e.target));
            });
        }
    }

    getCellHighlight(cell, row, col, matrix) {
        if (row === col) {
            // Diagonal - correct predictions
            return 'ai-cm-correct';
        } else {
            // Off-diagonal - errors
            const total = matrix[row].reduce((sum, val) => sum + val, 0);
            const errorRate = cell / total;
            if (errorRate > 0.3) return 'ai-cm-error-critical';
            if (errorRate > 0.1) return 'ai-cm-error-major';
            return 'ai-cm-error-minor';
        }
    }

    calculateMetrics() {
        const { matrix } = this.data;
        const total = matrix.flat().reduce((sum, val) => sum + val, 0);
        const correct = matrix.map((row, i) => row[i]).reduce((sum, val) => sum + val, 0);
        
        // Calculate precision, recall, F1-score (simplified)
        const precision = correct / total;
        const recall = precision; // Simplified for demo
        const f1Score = 2 * (precision * recall) / (precision + recall);
        
        return {
            precision,
            recall,
            f1Score,
            support: total
        };
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.render();
        }
    }

    highlightCell(cell) {
        // Remove previous highlights
        this.container.querySelectorAll('.ai-cm-table td').forEach(c => c.classList.remove('highlighted'));
        
        // Add highlight to clicked cell
        cell.classList.add('highlighted');
        
        // Show cell information
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = cell.textContent;
        
        console.log(`Cell [${row}, ${col}]: ${value}`);
    }

    hoverCell(cell) {
        cell.style.transform = 'scale(1.1)';
        cell.style.zIndex = '10';
    }

    unhoverCell(cell) {
        cell.style.transform = 'scale(1)';
        cell.style.zIndex = '1';
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIConfusionMatrix;
}
